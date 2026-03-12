import { StyleSheet } from 'react-native';

export const COLORS = {
  orange:      '#E8622A',
  teal:        '#3ABFBF',
  white:       '#FFFFFF',
  offWhite:    '#F8F9FA',
  text:        '#2D2D2D',
  textLight:   '#6B6B6B',
  textLighter: '#999999',
  border:      '#E0E0E0',
  background:  '#f5f3ef',
  msgMe:       '#66BB6A',   // vert  → patient (moi)
  msgAdmin:    '#42A5F5',   // bleu  → admin
  msgPro:      '#3ABFBF',   // teal  → professionnel
  unreadBadge: '#E8622A',
};

export const FONT_REGULAR  = 'Montserrat-Regular';
export const FONT_SEMIBOLD = 'Montserrat-SemiBold';
export const FONT_BOLD     = 'Montserrat-Bold';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  titleSection: {
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 17,
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ── Filter row ─────────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  filterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.teal,
  },
  filterBadgeActive: {
    backgroundColor: COLORS.teal,
  },
  filterBadgeText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 11,
    color: COLORS.teal,
  },
  filterBadgeTextActive: {
    color: COLORS.white,
  },

  // ── Conversation list ──────────────────────────────────────────────────────
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
    backgroundColor: COLORS.background,
  },
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FONT_BOLD,
    fontSize: 15,
    color: COLORS.white,
  },
  convContent: {
    flex: 1,
  },
  convName: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  convSubject: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  convPreview: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLighter,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.unreadBadge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    fontFamily: FONT_BOLD,
    fontSize: 11,
    color: COLORS.white,
  },

  // ── Empty state ────────────────────────────────────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
