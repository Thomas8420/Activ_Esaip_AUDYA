import { StyleSheet } from 'react-native';

export const COLORS = {
  orange: '#E8622A',
  teal: '#3ABFBF',
  white: '#FFFFFF',
  offWhite: '#F8F9FA',
  text: '#2D2D2D',
  textLight: '#6B6B6B',
  textLighter: '#999999',
  border: '#E0E0E0',
  background: '#f5f3ef',
  danger: '#D32F2F',
};

export const FONT_REGULAR = 'Montserrat-Regular';
export const FONT_SEMIBOLD = 'Montserrat-SemiBold';
export const FONT_BOLD = 'Montserrat-Bold';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    backgroundColor: COLORS.background,
  },

  // ── Title ──────────────────────────────────────────────────────────────────
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
    textAlign: 'center',
  },

  // ── Preferences Dropdowns ──────────────────────────────────────────────────
  prefsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  prefDropdownWrapper: {
    flex: 1,
  },
  prefDropdownLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 11,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  prefDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  prefDropdownButtonOpen: {
    borderColor: COLORS.orange,
  },
  prefDropdownValue: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  prefDropdownChevron: {
    fontSize: 9,
    color: COLORS.textLighter,
    marginLeft: 2,
  },
  prefDropdownMenu: {
    position: 'absolute',
    top: 62,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 100,
    elevation: 6,
  },
  prefDropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  prefDropdownItemLast: {
    borderBottomWidth: 0,
  },
  prefDropdownItemText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.text,
  },
  prefDropdownItemTextActive: {
    color: COLORS.orange,
    fontFamily: FONT_SEMIBOLD,
  },

  // ── Section Card ───────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 13,
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  // ── Notification Rows ─────────────────────────────────────────────────────
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notifRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  notifLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    paddingRight: 12,
  },

  // ── Password Inputs ────────────────────────────────────────────────────────
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 12,
  },
  eyeButton: {
    padding: 6,
  },
  passwordMismatch: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.danger,
    marginBottom: 10,
    marginTop: -6,
  },
  pwdRulesContainer: {
    marginTop: -4,
    marginBottom: 12,
    gap: 5,
  },
  pwdRuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pwdRuleText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLighter,
  },
  pwdRuleTextValid: {
    color: '#2E7D32',
  },

  // ── Buttons ────────────────────────────────────────────────────────────────
  outlineButton: {
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  outlineButtonDisabled: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.border,
  },
  outlineButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.orange,
  },
  outlineButtonTextDisabled: {
    color: COLORS.textLighter,
  },
  dangerButton: {
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.danger,
  },
  saveButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonPressed: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.orange,
  },
  saveButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.white,
  },
  saveButtonTextPressed: {
    color: COLORS.orange,
  },

  // ── CTA Styles ─────────────────────────────────────────────────────────────
  ctaPrimary: {
    backgroundColor: COLORS.orange,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaPrimaryPressed: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.orange,
  },
  ctaPrimaryText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.white,
  },
  ctaPrimaryTextPressed: {
    color: COLORS.orange,
  },
  ctaSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.orange,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaSecondaryText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.orange,
  },

  // ── Delete Confirmation Modal ──────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.orange,
    backgroundColor: COLORS.white,
  },
  modalCancelText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.orange,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: COLORS.orange,
  },
  modalConfirmText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.white,
  },
});
