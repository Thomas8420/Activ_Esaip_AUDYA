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
};

export const FONT_REGULAR  = 'Montserrat-Regular';
export const FONT_SEMIBOLD = 'Montserrat-SemiBold';
export const FONT_BOLD     = 'Montserrat-Bold';

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

  // ── QR Code section ────────────────────────────────────────────────────────
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  qrBox: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  qrText: {
    flex: 1,
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  // ── Profile photo ──────────────────────────────────────────────────────────
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.offWhite,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    marginBottom: 8,
  },
  photoImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  photoLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 13,
    color: COLORS.textLight,
  },
  photoHint: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLighter,
    marginTop: 2,
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

  // ── Field ─────────────────────────────────────────────────────────────────
  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 11,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
  },

  // ── Gender selector ────────────────────────────────────────────────────────
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
  },
  genderButtonActive: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  genderButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.textLight,
  },
  genderButtonTextActive: {
    color: COLORS.white,
  },

  // ── Two-column row ─────────────────────────────────────────────────────────
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  twoColField: {
    flex: 1,
    marginBottom: 14,
  },

  // ── Save button (CTA 1) ────────────────────────────────────────────────────
  saveButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 30,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonPressed: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.orange,
  },
  saveButtonText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.white,
  },
  saveButtonTextPressed: {
    color: COLORS.orange,
  },

  // ── Dropdown trigger ───────────────────────────────────────────────────────
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownTriggerText: {
    flex: 1,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
  },
  dropdownTriggerPlaceholder: {
    flex: 1,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.textLighter,
  },

  // ── Dropdown modal ─────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  modalItemSelected: {
    backgroundColor: '#FFF5F0',
  },
  modalItemText: {
    flex: 1,
    fontFamily: FONT_REGULAR,
    fontSize: 15,
    color: COLORS.text,
  },
  modalItemTextSelected: {
    color: COLORS.orange,
    fontFamily: FONT_SEMIBOLD,
  },

  // ── Photo modal ────────────────────────────────────────────────────────────
  photoModalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
  },
  photoModalTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  photoModalPickBtn: {
    backgroundColor: COLORS.orange,
    borderRadius: 22,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  photoModalPickBtnText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.white,
  },
  photoModalCancelBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoModalCancelText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.textLight,
  },
});
