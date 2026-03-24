import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AgendaEvent,
  fetchEvents,
  getMockEvents,
  USE_AGENDA_API,
} from '../../services/agendaService';
import { useNavigation, SelectedAgendaEvent } from '../../context/NavigationContext';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import { styles, COLORS, DAY_CELL_SIZE } from '../../screens/Agenda/AgendaScreen.styles';
import { getTodayISO, formatDateISO, buildCalendarGrid } from '../../utils/agendaHelpers';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const DAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAYS_FR_KEYS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];

function formatSelectedDay(year: number, month: number, day: number): string {
  const date = new Date(year, month, day);
  const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  return `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)} ${day} ${MONTHS_FR[month]} ${year}`;
}

function formatTime(datetime: string): string {
  return datetime.slice(11, 16); // "HH:mm"
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Page principale Mon Agenda.
 * Calendrier mensuel avec navigation + liste des events du jour sélectionné.
 */
const AgendaPage = () => {
  const { navigateToAgendaDay, navigateToAgendaForm } = useNavigation();

  const today = new Date();
  const todayISO = getTodayISO();

  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);

  // ── Chargement ───────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (USE_AGENDA_API) {
          setEvents(await fetchEvents());
        } else {
          setEvents(getMockEvents());
        }
      } catch {
        Alert.alert('Erreur', 'Impossible de charger les rendez-vous.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Calendrier ───────────────────────────────────────────────────────────
  const grid = buildCalendarGrid(currentYear, currentMonth);

  const { eventDateSet, eventsByDate } = useMemo(() => {
    const dateSet = new Set(events.map(event => event.start.slice(0, 10)));
    const byDate: Record<string, AgendaEvent[]> = {};
    for (const event of events) {
      const dateKey = event.start.slice(0, 10);
      if (!byDate[dateKey]) {
        byDate[dateKey] = [];
      }
      byDate[dateKey].push(event);
    }
    return { eventDateSet: dateSet, eventsByDate: byDate };
  }, [events]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(y => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(y => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const selectedEvents = eventsByDate[selectedDate] ?? [];

  // ── Ouvrir le formulaire (création) ─────────────────────────────────────
  const handleAddEvent = () => {
    const event: SelectedAgendaEvent = {
      id: null,
      title: '',
      type: 'appointment',
      start: `${selectedDate} 09:00`,
      end: `${selectedDate} 10:00`,
      location: '',
      notes: '',
      professionalName: '',
      backgroundColor: '#3ABFBF',
    };
    navigateToAgendaForm(event);
  };

  // ── Ouvrir le formulaire (édition) ───────────────────────────────────────
  const handleEditEvent = (ev: AgendaEvent) => {
    const event: SelectedAgendaEvent = {
      id: ev.id,
      title: ev.title,
      type: ev.type,
      start: ev.start,
      end: ev.end,
      location: ev.location,
      notes: ev.notes,
      professionalName: ev.professionalName,
      backgroundColor: ev.backgroundColor,
    };
    navigateToAgendaForm(event);
  };

  // ── Render du contenu journalier ─────────────────────────────────────────
  const renderDayContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 32 }} />;
    }
    if (selectedEvents.length === 0) {
      return (
        <Text style={styles.emptyDayText} testID="emptyDay">
          Aucun rendez-vous ce jour
        </Text>
      );
    }
    return (
      <View style={styles.eventListContainer} testID="eventList">
        {selectedEvents.map(ev => (
          <TouchableOpacity
            key={ev.id}
            style={styles.eventRow}
            onPress={() => handleEditEvent(ev)}
            activeOpacity={0.75}
            testID={`event-${ev.id}`}
          >
            <View style={[styles.eventColorBar, { backgroundColor: ev.backgroundColor }]} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{ev.title}</Text>
              <Text style={styles.eventTime}>
                {formatTime(ev.start)} – {formatTime(ev.end)}
              </Text>
              {!!ev.professionalName && (
                <Text style={styles.eventPro}>{ev.professionalName}</Text>
              )}
              {!!ev.location && (
                <Text style={styles.eventLocation}>{ev.location}</Text>
              )}
            </View>
            <View style={styles.eventEditBtn}>
              <Text style={styles.eventEditBtnText}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      {/* Titre */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>MON AGENDA</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Calendrier mensuel ── */}
        <View style={styles.calendarCard}>
          {/* Header mois */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity style={styles.arrowBtn} onPress={prevMonth} testID="prevMonth">
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.calendarMonthYear}>
              {MONTHS_FR[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity style={styles.arrowBtn} onPress={nextMonth} testID="nextMonth">
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Jours de la semaine */}
          <View style={styles.weekRow}>
            {DAYS_FR.map((d, i) => (
              <Text key={DAYS_FR_KEYS[i]} style={styles.weekDayLabel}>{d}</Text>
            ))}
          </View>

          {/* Grille des jours */}
          <View style={styles.daysGrid} testID="calendarGrid">
            {grid.map(cell => {
              const dateISO = cell.otherMonth
                ? '' // on ne sélectionne pas les jours des autres mois
                : formatDateISO(currentYear, currentMonth, cell.day);
              const isSelected = !cell.otherMonth && dateISO === selectedDate;
              const isToday = !cell.otherMonth && dateISO === todayISO;
              const hasEvents = !cell.otherMonth && eventDateSet.has(dateISO);
              const dayEvents = hasEvents ? (eventsByDate[dateISO] ?? []) : [];
              const cellKey = cell.otherMonth ? `other-${cell.day}` : dateISO;

              return (
                <TouchableOpacity
                  key={cellKey}
                  style={[styles.dayCell, { width: DAY_CELL_SIZE, height: DAY_CELL_SIZE + 16 }]}
                  onPress={() => {
                    if (!cell.otherMonth) {
                      setSelectedDate(dateISO);
                    }
                  }}
                  activeOpacity={cell.otherMonth ? 1 : 0.7}
                  testID={cell.otherMonth ? undefined : `day-${dateISO}`}
                >
                  {isSelected && !isToday && (
                    <View style={styles.daySelectedCircle} />
                  )}
                  {isToday && !isSelected && (
                    <View style={styles.todayCircle} />
                  )}
                  {isToday && isSelected && (
                    <View style={styles.daySelectedCircle} />
                  )}
                  <Text
                    style={[
                      styles.dayNumber,
                      cell.otherMonth && styles.dayNumberOtherMonth,
                      isToday && !isSelected && styles.dayNumberToday,
                      isSelected && styles.dayNumberSelected,
                    ]}
                  >
                    {cell.day}
                  </Text>
                  {hasEvents && (
                    <View style={styles.eventDotsRow}>
                      {dayEvents.slice(0, 3).map(ev => (
                        <View
                          key={ev.id}
                          style={[styles.eventDot, { backgroundColor: ev.backgroundColor }]}
                        />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Barre jour sélectionné ── */}
        <View style={styles.selectedDayBar}>
          <Text style={styles.selectedDayText} testID="selectedDayText">
            {formatSelectedDay(
              Number.parseInt(selectedDate.slice(0, 4), 10),
              Number.parseInt(selectedDate.slice(5, 7), 10) - 1,
              Number.parseInt(selectedDate.slice(8, 10), 10),
            )}
          </Text>
          <TouchableOpacity
            style={styles.dayViewBtn}
            onPress={() => navigateToAgendaDay(selectedDate)}
            testID="dayViewBtn"
            activeOpacity={0.7}
          >
            <Text style={styles.dayViewBtnText}>Vue jour</Text>
          </TouchableOpacity>
        </View>

        {/* ── Liste des events du jour ── */}
        {renderDayContent()}

        {/* Espace bas pour le FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB + */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddEvent}
        activeOpacity={0.8}
        accessibilityLabel="Ajouter un rendez-vous"
        testID="fabAddEvent"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <BottomNav />
    </SafeAreaView>
  );
};

export default AgendaPage;
