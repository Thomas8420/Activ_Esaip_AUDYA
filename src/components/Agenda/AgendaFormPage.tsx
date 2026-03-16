import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AgendaEvent,
  addMockEvent,
  removeMockEvent,
  updateMockEvent,
  createEvent,
  deleteEvent,
  USE_AGENDA_API,
} from '../../services/agendaService';
import { SelectedAgendaEvent, useNavigation } from '../../context/NavigationContext';
import NavBar from '../common/NavBar/NavBar';
import { styles, COLORS, DAY_CELL_SIZE } from '../../screens/Agenda/AgendaScreen.styles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const DAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const EVENT_COLORS = [
  '#3ABFBF', '#E8622A', '#42A5F5', '#66BB6A',
  '#AB47BC', '#EF5350', '#FF7043', '#8D6E63',
];

function formatDateDisplay(dateISO: string): string {
  const y = dateISO.slice(0, 4);
  const m = parseInt(dateISO.slice(5, 7)) - 1;
  const d = parseInt(dateISO.slice(8, 10));
  return `${d} ${MONTHS_FR[m]} ${y}`;
}

function buildCalendarGrid(year: number, month: number): { day: number; otherMonth: boolean }[] {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const grid: { day: number; otherMonth: boolean }[] = [];
  for (let i = offset - 1; i >= 0; i--) {
    grid.push({ day: prevMonthDays - i, otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push({ day: d, otherMonth: false });
  }
  while (grid.length % 7 !== 0) {
    grid.push({ day: grid.length - (offset + daysInMonth) + 1, otherMonth: true });
  }
  return grid;
}

function formatDateISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ─── TimePicker modal ─────────────────────────────────────────────────────────

interface TimePickerProps {
  visible: boolean;
  title: string;
  value: string; // "HH:mm"
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

const HOURS   = Array.from({ length: 17 }, (_, i) => i + 6); // 6..22
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const TimePicker: React.FC<TimePickerProps> = ({ visible, title, value, onConfirm, onCancel }) => {
  const initH = parseInt(value.slice(0, 2));
  const initM = parseInt(value.slice(3, 5));
  const [selHour,   setSelHour]   = useState(HOURS.includes(initH) ? initH : 9);
  const [selMinute, setSelMinute] = useState(MINUTES.includes(initM) ? initM : 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.pickerOverlay} onPress={onCancel}>
        <Pressable onPress={e => e.stopPropagation()}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>{title}</Text>

            <View style={styles.pickerColumns}>
              {/* Heures */}
              <ScrollView
                style={styles.pickerColumn}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pickerColumnContent}
              >
                {HOURS.map(h => (
                  <TouchableOpacity
                    key={h}
                    style={styles.pickerItem}
                    onPress={() => setSelHour(h)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selHour === h && styles.pickerItemTextSelected,
                    ]}>
                      {String(h).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.pickerSeparator}>:</Text>

              {/* Minutes */}
              <ScrollView
                style={styles.pickerColumn}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.pickerColumnContent}
              >
                {MINUTES.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={styles.pickerItem}
                    onPress={() => setSelMinute(m)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selMinute === m && styles.pickerItemTextSelected,
                    ]}>
                      {String(m).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerButtons}>
              <TouchableOpacity style={styles.pickerCancelBtn} onPress={onCancel}>
                <Text style={styles.pickerCancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerConfirmBtn}
                onPress={() => {
                  const time = `${String(selHour).padStart(2, '0')}:${String(selMinute).padStart(2, '0')}`;
                  onConfirm(time);
                }}
                testID="timePickerConfirm"
              >
                <Text style={styles.pickerConfirmBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ─── DatePicker modal (mini-calendrier) ──────────────────────────────────────

interface DatePickerProps {
  visible: boolean;
  value: string; // "YYYY-MM-DD"
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

const DatePickerModal: React.FC<DatePickerProps> = ({ visible, value, onConfirm, onCancel }) => {
  const initYear  = parseInt(value.slice(0, 4));
  const initMonth = parseInt(value.slice(5, 7)) - 1;
  const [pickerYear,  setPickerYear]  = useState(initYear);
  const [pickerMonth, setPickerMonth] = useState(initMonth);
  const [pickerDay,   setPickerDay]   = useState(parseInt(value.slice(8, 10)));

  const grid = buildCalendarGrid(pickerYear, pickerMonth);

  const prevMonth = () => {
    if (pickerMonth === 0) { setPickerYear(y => y - 1); setPickerMonth(11); }
    else { setPickerMonth(m => m - 1); }
  };
  const nextMonth = () => {
    if (pickerMonth === 11) { setPickerYear(y => y + 1); setPickerMonth(0); }
    else { setPickerMonth(m => m + 1); }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.pickerOverlay} onPress={onCancel}>
        <Pressable onPress={e => e.stopPropagation()}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerTitle}>Choisir une date</Text>

            {/* Navigation mois */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity style={styles.arrowBtn} onPress={prevMonth}>
                <Text style={styles.arrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.calendarMonthYear}>
                {MONTHS_FR[pickerMonth]} {pickerYear}
              </Text>
              <TouchableOpacity style={styles.arrowBtn} onPress={nextMonth}>
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Jours de la semaine */}
            <View style={styles.weekRow}>
              {DAYS_FR.map((d, i) => (
                <Text key={i} style={styles.weekDayLabel}>{d}</Text>
              ))}
            </View>

            {/* Grille */}
            <View style={styles.daysGrid}>
              {grid.map((cell, idx) => {
                const isSelected = !cell.otherMonth && cell.day === pickerDay
                  && pickerMonth === parseInt(value.slice(5, 7)) - 1
                  && pickerYear === parseInt(value.slice(0, 4))
                  ? false : !cell.otherMonth && cell.day === pickerDay;
                const actuallySelected = !cell.otherMonth && cell.day === pickerDay;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.dayCell, { width: DAY_CELL_SIZE, height: DAY_CELL_SIZE }]}
                    onPress={() => { if (!cell.otherMonth) { setPickerDay(cell.day); } }}
                    activeOpacity={cell.otherMonth ? 1 : 0.7}
                  >
                    {actuallySelected && <View style={styles.daySelectedCircle} />}
                    <Text style={[
                      styles.dayNumber,
                      cell.otherMonth && styles.dayNumberOtherMonth,
                      actuallySelected && styles.dayNumberSelected,
                    ]}>
                      {cell.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.datePickerConfirmBtn}
              onPress={() => onConfirm(formatDateISO(pickerYear, pickerMonth, pickerDay))}
              testID="datePickerConfirm"
            >
              <Text style={styles.datePickerConfirmBtnText}>
                Confirmer — {pickerDay} {MONTHS_FR[pickerMonth]} {pickerYear}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

interface AgendaFormPageProps {
  event: SelectedAgendaEvent | null;
}

/**
 * Formulaire de création / édition d'un rendez-vous.
 * Champs : titre, date, heure début/fin, professionnel, lieu, notes, couleur.
 */
const AgendaFormPage: React.FC<AgendaFormPageProps> = ({ event }) => {
  const { goBack } = useNavigation();
  const isEdit = event?.id != null;

  // ── State champs ──────────────────────────────────────────────────────
  const [title,      setTitle]      = useState(event?.title ?? '');
  const [date,       setDate]       = useState(event?.start.slice(0, 10) ?? '');
  const [startTime,  setStartTime]  = useState(event?.start.slice(11, 16) ?? '09:00');
  const [endTime,    setEndTime]    = useState(event?.end.slice(11, 16)   ?? '10:00');
  const [proName,    setProName]    = useState(event?.professionalName ?? '');
  const [location,   setLocation]   = useState(event?.location ?? '');
  const [notes,      setNotes]      = useState(event?.notes ?? '');
  const [bgColor,    setBgColor]    = useState(event?.backgroundColor ?? '#3ABFBF');
  const [isSaving,   setIsSaving]   = useState(false);

  // ── Pickers ───────────────────────────────────────────────────────────
  const [showDatePicker,  setShowDatePicker]  = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker,   setShowEndPicker]   = useState(false);

  // ── Sauvegarde ────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Champ requis', 'Le titre du rendez-vous est obligatoire.');
      return;
    }
    if (!date) {
      Alert.alert('Champ requis', 'La date est obligatoire.');
      return;
    }

    setIsSaving(true);
    try {
      const params = {
        title: title.trim(),
        type: event?.type ?? 'appointment',
        start: `${date} ${startTime}`,
        end:   `${date} ${endTime}`,
        location: location.trim(),
        notes: notes.trim(),
        professionalName: proName.trim(),
      };

      if (USE_AGENDA_API) {
        if (isEdit && event?.id != null) {
          // API: delete old + create new
          await deleteEvent(event.id);
        }
        const newId = await createEvent(params);
        const newEvent: AgendaEvent = { ...params, id: newId, backgroundColor: bgColor };
        addMockEvent(newEvent); // même en mode API on met à jour le store local
      } else {
        if (isEdit && event?.id != null) {
          const updated: AgendaEvent = {
            id: event.id,
            ...params,
            backgroundColor: bgColor,
          };
          updateMockEvent(updated);
        } else {
          const newEvent: AgendaEvent = {
            id: Date.now(),
            ...params,
            backgroundColor: bgColor,
          };
          addMockEvent(newEvent);
        }
      }
      goBack();
    } catch (err) {
      Alert.alert('Erreur', "Impossible de sauvegarder le rendez-vous.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Suppression ───────────────────────────────────────────────────────
  const handleDelete = () => {
    Alert.alert(
      'Supprimer ce rendez-vous',
      'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            if (event?.id == null) { return; }
            try {
              if (USE_AGENDA_API) {
                await deleteEvent(event.id);
              } else {
                removeMockEvent(event.id);
              }
              goBack();
            } catch (err) {
              Alert.alert('Erreur', "Impossible de supprimer le rendez-vous.");
            }
          },
        },
      ],
    );
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      {/* Header */}
      <View style={styles.formHeader}>
        <Text style={styles.formHeaderTitle}>
          {isEdit ? 'MODIFIER UN RDV' : 'NOUVEAU RDV'}
        </Text>
        <TouchableOpacity
          style={styles.formCancelBtn}
          onPress={goBack}
          testID="formCancelBtn"
        >
          <Text style={styles.formCancelBtnText}>Annuler</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Informations générales ── */}
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Informations</Text>

            {/* Titre */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Titre *</Text>
              <TextInput
                style={styles.formInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex : Consultation audioprothésiste"
                placeholderTextColor={COLORS.textLighter}
                testID="fieldTitle"
              />
            </View>

            {/* Professionnel */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Professionnel</Text>
              <TextInput
                style={styles.formInput}
                value={proName}
                onChangeText={setProName}
                placeholder="Nom du professionnel"
                placeholderTextColor={COLORS.textLighter}
                testID="fieldPro"
              />
            </View>

            {/* Lieu */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Lieu</Text>
              <TextInput
                style={styles.formInput}
                value={location}
                onChangeText={setLocation}
                placeholder="Adresse ou cabinet"
                placeholderTextColor={COLORS.textLighter}
                testID="fieldLocation"
              />
            </View>
          </View>

          {/* ── Date & Heure ── */}
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Date & Heure</Text>

            {/* Date */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Date *</Text>
              <TouchableOpacity
                style={styles.formPickerBtn}
                onPress={() => setShowDatePicker(true)}
                testID="fieldDate"
              >
                <Text style={styles.formPickerBtnText}>
                  {date ? formatDateDisplay(date) : 'Choisir une date'}
                </Text>
                <Text style={styles.formPickerChevron}>▾</Text>
              </TouchableOpacity>
            </View>

            {/* Heure début / fin */}
            <View style={styles.formTimeRow}>
              <View style={[styles.formField, styles.formTimeField]}>
                <Text style={styles.formLabel}>Heure début</Text>
                <TouchableOpacity
                  style={styles.formPickerBtn}
                  onPress={() => setShowStartPicker(true)}
                  testID="fieldStartTime"
                >
                  <Text style={styles.formPickerBtnText}>{startTime}</Text>
                  <Text style={styles.formPickerChevron}>▾</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.formField, styles.formTimeField]}>
                <Text style={styles.formLabel}>Heure fin</Text>
                <TouchableOpacity
                  style={styles.formPickerBtn}
                  onPress={() => setShowEndPicker(true)}
                  testID="fieldEndTime"
                >
                  <Text style={styles.formPickerBtnText}>{endTime}</Text>
                  <Text style={styles.formPickerChevron}>▾</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ── Notes ── */}
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Notes</Text>
            <View style={styles.formField}>
              <TextInput
                style={[styles.formInput, styles.formInputMultiline]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Notes supplémentaires…"
                placeholderTextColor={COLORS.textLighter}
                multiline
                numberOfLines={3}
                testID="fieldNotes"
              />
            </View>
          </View>

          {/* ── Couleur ── */}
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Couleur</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
              {EVENT_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setBgColor(c)}
                  testID={`color-${c.replace('#', '')}`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: c,
                    borderWidth: bgColor === c ? 3 : 0,
                    borderColor: COLORS.text,
                  }}
                />
              ))}
            </View>
          </View>

          {/* ── Boutons d'action ── */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={isSaving}
            testID="saveBtn"
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Ajouter le rendez-vous'}
            </Text>
          </TouchableOpacity>

          {isEdit && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              testID="deleteBtn"
            >
              <Text style={styles.deleteButtonText}>Supprimer ce rendez-vous</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <DatePickerModal
        visible={showDatePicker}
        value={date || new Date().toISOString().slice(0, 10)}
        onConfirm={d => { setDate(d); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
      />
      <TimePicker
        visible={showStartPicker}
        title="Heure de début"
        value={startTime}
        onConfirm={t => { setStartTime(t); setShowStartPicker(false); }}
        onCancel={() => setShowStartPicker(false)}
      />
      <TimePicker
        visible={showEndPicker}
        title="Heure de fin"
        value={endTime}
        onConfirm={t => { setEndTime(t); setShowEndPicker(false); }}
        onCancel={() => setShowEndPicker(false)}
      />
    </SafeAreaView>
  );
};

export default AgendaFormPage;
