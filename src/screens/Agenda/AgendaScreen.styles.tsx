import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const COLORS = {
  orange:      '#E8622A',
  teal:        '#3ABFBF',
  white:       '#FFFFFF',
  offWhite:    '#F8F9FA',
  text:        '#2D2D2D',
  textLight:   '#6B6B6B',
  textLighter: '#999999',
  border:      '#E0E0E0',
  background:  '#F5F3EF',
  today:       '#E8622A',
  selected:    '#E8622A',
};

export const FONT_REGULAR  = 'Montserrat-Regular';
export const FONT_SEMIBOLD = 'Montserrat-SemiBold';
export const FONT_BOLD     = 'Montserrat-Bold';

/** Largeur d'une cellule jour = 1/7 de l'espace disponible
 *  SCREEN_WIDTH - 32 (marginHorizontal 16×2) - 16 (paddingHorizontal 8×2 du calendarCard) */
export const DAY_CELL_SIZE = Math.floor((SCREEN_WIDTH - 48) / 7);

/** Hauteur d'une heure en px dans la timeline */
export const HOUR_HEIGHT = 64;
export const TIMELINE_START_HOUR = 6;
export const TIMELINE_END_HOUR   = 22;

export const styles = StyleSheet.create({

  // ── Commun ─────────────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  flex: { flex: 1 },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pageTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 17,
    color: COLORS.orange,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ── Calendrier mensuel ─────────────────────────────────────────────────────
  calendarCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontFamily: FONT_BOLD,
    fontSize: 18,
    color: COLORS.orange,
    lineHeight: 22,
  },
  calendarMonthYear: {
    fontFamily: FONT_BOLD,
    fontSize: 15,
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekDayLabel: {
    width: DAY_CELL_SIZE,
    textAlign: 'center',
    fontFamily: FONT_SEMIBOLD,
    fontSize: 11,
    color: COLORS.textLighter,
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: DAY_CELL_SIZE,
    height: DAY_CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  dayNumberToday: {
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
  },
  dayNumberSelected: {
    fontFamily: FONT_BOLD,
    color: COLORS.white,
  },
  dayNumberOtherMonth: {
    color: COLORS.textLighter,
  },
  daySelectedCircle: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.orange,
  },
  todayCircle: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.orange,
  },
  eventDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 4,
    gap: 2,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  // ── Barre du jour sélectionné ──────────────────────────────────────────────
  selectedDayBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  selectedDayText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.text,
  },
  dayViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    gap: 4,
  },
  dayViewBtnText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 11,
    color: COLORS.teal,
  },

  // ── Liste des events du jour ────────────────────────────────────────────────
  eventListContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyDayText: {
    textAlign: 'center',
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.textLighter,
    marginTop: 32,
  },
  eventRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventColorBar: {
    width: 5,
  },
  eventContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  eventTitle: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 3,
  },
  eventTime: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  eventPro: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.teal,
  },
  eventLocation: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLighter,
  },
  eventEditBtn: {
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  eventEditBtnText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.textLight,
  },

  // ── FAB + ─────────────────────────────────────────────────────────────────
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: {
    fontFamily: FONT_BOLD,
    fontSize: 26,
    color: COLORS.white,
    lineHeight: 30,
  },

  // ── Timeline (vue jour) ────────────────────────────────────────────────────
  timelineScrollContent: {
    paddingBottom: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    height: HOUR_HEIGHT,
  },
  timeLabel: {
    width: 52,
    paddingTop: 4,
    paddingRight: 8,
    alignItems: 'flex-end',
  },
  timeLabelText: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLighter,
  },
  timeSlotArea: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    position: 'relative',
  },
  timelineEventsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  timelineEventBlock: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  timelineEventTitle: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.white,
  },
  timelineEventTime: {
    fontFamily: FONT_REGULAR,
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
  dayViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayViewHeaderDate: {
    fontFamily: FONT_BOLD,
    fontSize: 15,
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  dayViewNavBtn: {
    padding: 8,
  },
  dayViewNavBtnText: {
    fontFamily: FONT_BOLD,
    fontSize: 18,
    color: COLORS.orange,
  },
  dayViewAddBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: COLORS.orange,
    borderRadius: 14,
  },
  dayViewAddBtnText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.white,
  },
  currentTimeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.orange,
    zIndex: 10,
  },
  currentTimeDot: {
    position: 'absolute',
    left: -4,
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
  },

  // ── Formulaire ─────────────────────────────────────────────────────────────
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  formSectionTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 13,
    color: COLORS.textLighter,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
  },
  formInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 11,
  },
  formPickerBtn: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formPickerBtnText: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
  },
  formPickerChevron: {
    fontFamily: FONT_BOLD,
    fontSize: 14,
    color: COLORS.textLighter,
  },
  formTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formTimeField: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.white,
  },
  deleteButton: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EF5350',
  },
  deleteButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: '#EF5350',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  formHeaderTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 16,
    color: COLORS.orange,
    textTransform: 'uppercase',
  },
  formCancelBtn: {
    padding: 4,
  },
  formCancelBtnText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.textLight,
  },

  // ── Time picker modal ──────────────────────────────────────────────────────
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  pickerTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  pickerColumns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 180,
  },
  pickerColumn: {
    width: 80,
    height: 180,
  },
  pickerColumnContent: {
    paddingVertical: 64,
  },
  pickerItem: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemText: {
    fontFamily: FONT_REGULAR,
    fontSize: 22,
    color: COLORS.textLighter,
  },
  pickerItemTextSelected: {
    fontFamily: FONT_BOLD,
    fontSize: 26,
    color: COLORS.orange,
  },
  pickerSeparator: {
    fontFamily: FONT_BOLD,
    fontSize: 26,
    color: COLORS.text,
    marginTop: -8,
  },
  pickerHighlight: {
    position: 'absolute',
    top: 68,
    left: 0,
    right: 0,
    height: 44,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: COLORS.orange,
    borderRadius: 8,
  },
  pickerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  pickerCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  pickerCancelBtnText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.textLight,
  },
  pickerConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
  },
  pickerConfirmBtnText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.white,
  },

  // ── Date picker modal ──────────────────────────────────────────────────────
  datePickerContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  datePickerTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  datePickerConfirmBtn: {
    marginTop: 16,
    backgroundColor: COLORS.orange,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  datePickerConfirmBtnText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.white,
  },
});
