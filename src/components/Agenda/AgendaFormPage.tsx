import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheetModal from '../common/BottomSheetModal/BottomSheetModal';
import DropdownIcon from '../../assets/images/dropdown.svg';
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
import { sanitizeName, sanitizeText } from '../../utils/validators';
import NavBar from '../common/NavBar/NavBar';
import { styles, COLORS, DAY_CELL_SIZE } from '../../screens/Agenda/AgendaScreen.styles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const DAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAYS_FR_KEYS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];

const EVENT_COLORS = [
  '#3ABFBF', '#E8622A', '#42A5F5', '#66BB6A',
  '#AB47BC', '#EF5350', '#FF7043', '#8D6E63',
];

function formatDateDisplay(dateISO: string): string {
  const y = dateISO.slice(0, 4);
  const m = Number.parseInt(dateISO.slice(5, 7), 10) - 1;
  const d = Number.parseInt(dateISO.slice(8, 10), 10);
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

// ─── TimePicker — constantes et données ──────────────────────────────────────

const HOURS   = Array.from({ length: 17 }, (_, i) => i + 6); // 6..22
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

/** Hauteur d'un item = styles.pickerItem.height */
const ITEM_H = 44;
/**
 * Padding vertical qui centre l'item sélectionné sur le pickerHighlight (top: 68).
 * Maths : paddingTop + 0 * ITEM_H = offset 0 → item 0 visible y = paddingTop.
 * Pour que item 0 soit centré sur highlight (top: 68) : paddingTop = 68.
 * scrollTo({ y: idx * ITEM_H }) centre alors item idx sur le highlight pour tout idx.
 */
const PAD = 68;

// ─── WheelColumn ──────────────────────────────────────────────────────────────
// Déclaré au niveau module — évite le démontage/remontage à chaque re-render (CLAUDE.md).

interface WheelColumnProps {
  data:     number[];
  value:    number;
  onChange: (v: number) => void;
}

const WheelColumn: React.FC<WheelColumnProps> = ({ data, value, onChange }) => {
  const ref = useRef<ScrollView>(null);

  // Scroll programmatique vers la valeur courante (initialisation + tap).
  // 50 ms de délai pour laisser le layout se stabiliser après un rendu.
  useEffect(() => {
    const idx = data.indexOf(value);
    if (idx < 0) { return; }
    const timer = setTimeout(() => {
      ref.current?.scrollTo({ y: idx * ITEM_H, animated: false });
    }, 50);
    return () => clearTimeout(timer);
  }, [data, value]);

  const onScrollEnd = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
    const idx = Math.max(0, Math.min(
      data.length - 1,
      Math.round(e.nativeEvent.contentOffset.y / ITEM_H),
    ));
    onChange(data[idx]);
  };

  return (
    <ScrollView
      ref={ref}
      style={styles.pickerColumn}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: PAD }}
      snapToInterval={ITEM_H}
      decelerationRate="fast"
      onMomentumScrollEnd={onScrollEnd}
      onScrollEndDrag={onScrollEnd}
    >
      {data.map(item => (
        <TouchableOpacity
          key={item}
          style={styles.pickerItem}
          onPress={() => {
            onChange(item);
            ref.current?.scrollTo({ y: data.indexOf(item) * ITEM_H, animated: true });
          }}
        >
          <Text style={[styles.pickerItemText, item === value && styles.pickerItemTextSelected]}>
            {String(item).padStart(2, '0')}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// ─── TimePicker modal ─────────────────────────────────────────────────────────

interface TimePickerProps {
  visible: boolean;
  title: string;
  value: string; // "HH:mm"
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ visible, title, value, onConfirm, onCancel }) => {
  const initH = Number.parseInt(value.slice(0, 2), 10);
  const initM = Number.parseInt(value.slice(3, 5), 10);
  const [selHour,   setSelHour]   = useState(HOURS.includes(initH) ? initH : 9);
  const [selMinute, setSelMinute] = useState(MINUTES.includes(initM) ? initM : 0);

  return (
    <BottomSheetModal visible={visible} onClose={onCancel}>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerTitle}>{title}</Text>

        <View style={styles.pickerColumns}>
          <WheelColumn data={HOURS}   value={selHour}   onChange={setSelHour}   />
          <Text style={styles.pickerSeparator}>:</Text>
          <WheelColumn data={MINUTES} value={selMinute} onChange={setSelMinute} />
          {/* Barre de sélection — positionnée en absolu sur les deux colonnes */}
          <View style={styles.pickerHighlight} pointerEvents="none" />
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
    </BottomSheetModal>
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
  const initYear  = Number.parseInt(value.slice(0, 4), 10);
  const initMonth = Number.parseInt(value.slice(5, 7), 10) - 1;
  const [pickerYear,  setPickerYear]  = useState(initYear);
  const [pickerMonth, setPickerMonth] = useState(initMonth);
  const [pickerDay,   setPickerDay]   = useState(Number.parseInt(value.slice(8, 10), 10));

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
    <BottomSheetModal visible={visible} onClose={onCancel}>
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
            <Text key={DAYS_FR_KEYS[i]} style={styles.weekDayLabel}>{d}</Text>
          ))}
        </View>

        {/* Grille */}
        <View style={styles.daysGrid}>
          {grid.map(cell => {
            const actuallySelected = !cell.otherMonth && cell.day === pickerDay;
            const cellKey = `${cell.otherMonth ? 'other' : 'main'}-${cell.day}`;
            return (
              <TouchableOpacity
                key={cellKey}
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
    </BottomSheetModal>
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

  // ── Validation heures ─────────────────────────────────────────────────
  // Comparaison lexicographique valide car format "HH:mm" zéro-paddé
  const timeError = endTime <= startTime;

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
    if (timeError) {
      Alert.alert('Heures incorrectes', "L'heure de fin doit être après l'heure de début.");
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
      } else if (isEdit && event?.id != null) {
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
      goBack();
    } catch {
      Alert.alert('Erreur', "Impossible de sauvegarder le rendez-vous.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Suppression ───────────────────────────────────────────────────────
  const doDelete = async () => {
    if (event?.id == null) { return; }
    try {
      if (USE_AGENDA_API) {
        await deleteEvent(event.id);
      } else {
        removeMockEvent(event.id);
      }
      goBack();
    } catch {
      Alert.alert('Erreur', "Impossible de supprimer le rendez-vous.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer ce rendez-vous',
      'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => { void doDelete(); },
        },
      ],
    );
  };

  // ── Render ────────────────────────────────────────────────────────────
  let saveButtonLabel = 'Ajouter le rendez-vous';
  if (isEdit) { saveButtonLabel = 'Mettre à jour'; }
  if (isSaving) { saveButtonLabel = 'Enregistrement…'; }

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
                onChangeText={v => setTitle(v.replace(/[<>]/g, ''))}
                placeholder="Ex : Consultation audioprothésiste"
                placeholderTextColor={COLORS.textLighter}
                maxLength={200}
                testID="fieldTitle"
              />
            </View>

            {/* Professionnel */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Professionnel</Text>
              <TextInput
                style={styles.formInput}
                value={proName}
                onChangeText={v => setProName(sanitizeName(v))}
                placeholder="Nom du professionnel"
                placeholderTextColor={COLORS.textLighter}
                maxLength={100}
                testID="fieldPro"
              />
            </View>

            {/* Lieu */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Lieu</Text>
              <TextInput
                style={styles.formInput}
                value={location}
                onChangeText={v => setLocation(v.replace(/[<>]/g, ''))}
                placeholder="Adresse ou cabinet"
                placeholderTextColor={COLORS.textLighter}
                maxLength={200}
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
                <View style={styles.dropdownArrowBg}>
                  <DropdownIcon width={10} height={10} fill="white" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Heure début / fin */}
            <View style={styles.formTimeRow}>
              <View style={[styles.formField, styles.formTimeField]}>
                <Text style={styles.formLabel}>Heure début</Text>
                <TouchableOpacity
                  style={[styles.formPickerBtn, timeError && { borderColor: '#D32F2F', borderWidth: 1 }]}
                  onPress={() => setShowStartPicker(true)}
                  testID="fieldStartTime"
                >
                  <Text style={styles.formPickerBtnText}>{startTime}</Text>
                  <View style={styles.dropdownArrowBg}>
                    <DropdownIcon width={10} height={10} fill="white" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={[styles.formField, styles.formTimeField]}>
                <Text style={styles.formLabel}>Heure fin</Text>
                <TouchableOpacity
                  style={[styles.formPickerBtn, timeError && { borderColor: '#D32F2F', borderWidth: 1 }]}
                  onPress={() => setShowEndPicker(true)}
                  testID="fieldEndTime"
                >
                  <Text style={styles.formPickerBtnText}>{endTime}</Text>
                  <View style={styles.dropdownArrowBg}>
                    <DropdownIcon width={10} height={10} fill="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {timeError && (
              <Text style={styles.formTimeError}>
                L'heure de fin doit être après l'heure de début.
              </Text>
            )}
          </View>

          {/* ── Notes ── */}
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Notes</Text>
            <View style={styles.formField}>
              <TextInput
                style={[styles.formInput, styles.formInputMultiline]}
                value={notes}
                onChangeText={v => setNotes(sanitizeText(v))}
                placeholder="Notes supplémentaires…"
                placeholderTextColor={COLORS.textLighter}
                multiline
                numberOfLines={3}
                maxLength={500}
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
            onPress={() => { void handleSave(); }}
            disabled={isSaving}
            testID="saveBtn"
          >
            <Text style={styles.saveButtonText}>{saveButtonLabel}</Text>
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
