import React, { useEffect, useRef, useState } from 'react';
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
import { useLanguage } from '../../context/LanguageContext';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import {
  styles,
  COLORS,
  HOUR_HEIGHT,
  TIMELINE_START_HOUR,
  TIMELINE_END_HOUR,
} from '../../screens/Agenda/AgendaScreen.styles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function parseDateParts(dateISO: string): { year: number; month: number; day: number } {
  return {
    year: Number.parseInt(dateISO.slice(0, 4), 10),
    month: Number.parseInt(dateISO.slice(5, 7), 10) - 1,
    day: Number.parseInt(dateISO.slice(8, 10), 10),
  };
}

function formatDayHeader(dateISO: string): string {
  const { year, month, day } = parseDateParts(dateISO);
  const date = new Date(year, month, day);
  const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  return `${dayName.charAt(0).toUpperCase()}${dayName.slice(1)} ${day} ${MONTHS_FR[month]}`;
}

function addDays(dateISO: string, delta: number): string {
  const { year, month, day } = parseDateParts(dateISO);
  const date = new Date(year, month, day + delta);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function timeToMinutes(timeStr: string): number {
  const hours = Number.parseInt(timeStr.slice(0, 2), 10);
  const minutes = Number.parseInt(timeStr.slice(3, 5), 10);
  return hours * 60 + minutes;
}

/** Calcule la position et la hauteur d'un bloc event dans la timeline */
function eventLayout(event: AgendaEvent) {
  const startMin = timeToMinutes(event.start.slice(11, 16));
  const endMin   = timeToMinutes(event.end.slice(11, 16));
  const originMin = TIMELINE_START_HOUR * 60;
  const top    = Math.max(0, (startMin - originMin) * (HOUR_HEIGHT / 60));
  const height = Math.max(24, (endMin - startMin) * (HOUR_HEIGHT / 60));
  return { top, height };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AgendaDayViewPageProps {
  date: string; // "YYYY-MM-DD"
}

/**
 * Vue timeline d'une journée — affiche les events sur un axe horaire (6h–22h).
 */
const AgendaDayViewPage: React.FC<AgendaDayViewPageProps> = ({ date: initialDate }) => {
  const { navigateToAgendaForm } = useNavigation();
  const { t } = useLanguage();
  const scrollRef = useRef<ScrollView>(null);

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const HOURS = Array.from(
    { length: TIMELINE_END_HOUR - TIMELINE_START_HOUR },
    (_, i) => TIMELINE_START_HOUR + i,
  );
  const totalHeight = HOURS.length * HOUR_HEIGHT;

  // Ligne heure actuelle
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowTop = (nowMinutes - TIMELINE_START_HOUR * 60) * (HOUR_HEIGHT / 60);
  const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const showCurrentLine = currentDate === todayISO && nowTop >= 0 && nowTop <= totalHeight;

  // ── Chargement ─────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const allEvents = USE_AGENDA_API ? await fetchEvents() : getMockEvents();
        setEvents(allEvents);
      } catch {
        Alert.alert('Erreur', 'Impossible de charger les rendez-vous.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Scroll vers l'heure actuelle à l'ouverture ─────────────────────────
  useEffect(() => {
    if (!isLoading && showCurrentLine) {
      const id = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: Math.max(0, nowTop - 80), animated: true });
      }, 300);
      return () => clearTimeout(id);
    }
  }, [isLoading]);

  const dayEvents = events.filter(e => e.start.startsWith(currentDate));

  // ── Navigation jour précédent / suivant ────────────────────────────────
  const goPrevDay = () => setCurrentDate(prev => addDays(prev, -1));
  const goNextDay = () => setCurrentDate(prev => addDays(prev, 1));

  // ── Ouvrir le formulaire (création) ─────────────────────────────────────
  const handleAddEvent = (hour: number = 9) => {
    const startStr = `${currentDate} ${String(hour).padStart(2, '0')}:00`;
    const endStr   = `${currentDate} ${String(hour + 1).padStart(2, '0')}:00`;
    const event: SelectedAgendaEvent = {
      id: null,
      title: '',
      type: 'appointment',
      start: startStr,
      end: endStr,
      location: '',
      notes: '',
      professionalName: '',
      backgroundColor: '#3ABFBF',
    };
    navigateToAgendaForm(event);
  };

  // ── Ouvrir le formulaire (édition) ──────────────────────────────────────
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

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      {/* Titre */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>{t('screen.agenda')}</Text>
      </View>

      {/* Header navigation jour */}
      <View style={styles.dayViewHeader}>
        <TouchableOpacity style={styles.dayViewNavBtn} onPress={goPrevDay} testID="prevDay">
          <Text style={styles.dayViewNavBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.dayViewHeaderDate} testID="dayViewDate">
          {formatDayHeader(currentDate)}
        </Text>
        <TouchableOpacity style={styles.dayViewNavBtn} onPress={goNextDay} testID="nextDay">
          <Text style={styles.dayViewNavBtnText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton ajouter */}
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.white }}>
        <TouchableOpacity
          style={styles.dayViewAddBtn}
          onPress={() => handleAddEvent()}
          testID="dayViewAddBtn"
          activeOpacity={0.8}
        >
          <Text style={styles.dayViewAddBtnText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[styles.timelineScrollContent, { minHeight: totalHeight + 40 }]}
          showsVerticalScrollIndicator={false}
          testID="timelineScroll"
        >
          {/* Grille horaire */}
          <View style={{ flexDirection: 'row' }}>
            {/* Colonne étiquettes heures */}
            <View style={{ width: 52 }}>
              {HOURS.map(h => (
                <View key={h} style={[styles.timeLabel, { height: HOUR_HEIGHT }]}>
                  <Text style={styles.timeLabelText}>
                    {String(h).padStart(2, '0')}:00
                  </Text>
                </View>
              ))}
            </View>

            {/* Zone events */}
            <View style={{ flex: 1 }}>
              {/* Lignes horaires + zones tappables */}
              {HOURS.map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.timeSlotArea, { height: HOUR_HEIGHT }]}
                  onPress={() => handleAddEvent(h)}
                  activeOpacity={0.3}
                  testID={`timeSlot-${h}`}
                />
              ))}

              {/* Ligne heure actuelle */}
              {showCurrentLine && (
                <View
                  style={[styles.currentTimeLine, { top: nowTop }]}
                  pointerEvents="none"
                >
                  <View style={styles.currentTimeDot} />
                </View>
              )}

              {/* Blocs events */}
              {dayEvents.map(ev => {
                const { top, height } = eventLayout(ev);
                return (
                  <TouchableOpacity
                    key={ev.id}
                    style={[
                      styles.timelineEventBlock,
                      { top, height, backgroundColor: ev.backgroundColor },
                    ]}
                    onPress={() => handleEditEvent(ev)}
                    activeOpacity={0.8}
                    testID={`timelineEvent-${ev.id}`}
                  >
                    <Text style={styles.timelineEventTitle} numberOfLines={1}>
                      {ev.title}
                    </Text>
                    <Text style={styles.timelineEventTime}>
                      {ev.start.slice(11, 16)} – {ev.end.slice(11, 16)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}

      <BottomNav />
    </SafeAreaView>
  );
};

export default AgendaDayViewPage;
