import { StyleSheet } from 'react-native';
import { COLORS, FONT_REGULAR, FONT_SEMIBOLD, FONT_BOLD } from '../Home/HomeScreen.styles';

export { COLORS, FONT_REGULAR, FONT_SEMIBOLD, FONT_BOLD } from '../Home/HomeScreen.styles';

export const registerStyles = StyleSheet.create({
  // ── Layout ──
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // ── Logo ──
  logo: {
    marginBottom: 24,
  },

  // ── Badge étape ──
  stepBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepBadgeText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  stepLabel: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.orange,
    marginBottom: 16,
  },

  // ── Carte blanche ──
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardTitle: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'right',
    marginBottom: 16,
  },

  // ── Champs ──
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  inputPrefilled: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.textLight,
    backgroundColor: '#F0F0F0',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  inputRowText: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
  },

  // ── Label champ ──
  fieldLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 4,
  },

  // ── Bouton principal ──
  btnPrimary: {
    backgroundColor: COLORS.orange,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.white,
  },

  // ── Bouton secondaire (outline) ──
  btnSecondary: {
    borderWidth: 2,
    borderColor: COLORS.orange,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    flex: 1,
  },
  btnSecondaryText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 14,
    color: COLORS.orange,
  },

  // ── Radio ──
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  radioLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.text,
    marginRight: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.orange,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
  },
  radioText: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.text,
  },

  // ── Toggle (Switch) ──
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  toggleLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    paddingRight: 8,
  },

  // ── Checkbox ──
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  checkboxLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },

  // ── Question ──
  questionText: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  questionBlock: {
    marginBottom: 16,
  },

  // ── Séparateur ──
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },

  // ── Erreur ──
  errorText: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: '#E53935',
    marginTop: -8,
    marginBottom: 8,
  },

  // ── Ligne de boutons ──
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  // ── Bouton principal petit et centré ──
  btnPrimarySmall: {
    backgroundColor: COLORS.orange,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: COLORS.orange,
  },
  btnPrimarySmallPressed: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
  },
  btnPrimaryTextPressed: {
    color: COLORS.orange,
  },

  // ── Badge étape dans la carte ──
  stepBadgeInCard: {
    alignItems: 'center',
    marginBottom: 12,
  },

  // ── Titre de carte compact ──
  cardTitleCompact: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
    flexShrink: 1,
  },

  // ── Label consentement centré ──
  consentLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },

  // ── Icône @ (étape 1bis) ──
  atContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  atIcon: {
    fontSize: 48,
    color: COLORS.textLight,
    fontFamily: FONT_REGULAR,
  },

  // ── Description email vérification ──
  emailDescription: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    marginTop: 12,
  },

  // ── Bouton principal — état pressé ──
  btnPrimaryPressed: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
  },

  // ── Toggle mot de passe ──
  eyeToggleText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: COLORS.orange,
    paddingHorizontal: 4,
  },

  // ── Bouton outline (blanc + contour orange) ──
  btnOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.orange,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnOutlineText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.orange,
  },
  btnOutlinePressed: {
    backgroundColor: '#F4956A',
    borderColor: COLORS.orange,
  },
  btnOutlineTextPressed: {
    color: COLORS.white,
  },

  // ── Champ en erreur ──
  inputError: {
    borderColor: '#E53935',
  },

  // ── Photo de profil ──
  photoField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 12,
  },
  photoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderIcon: {
    fontSize: 20,
  },
  photoPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  photoFieldLabel: {
    flex: 1,
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textLight,
  },
  photoIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIconText: {
    fontSize: 16,
  },
  removePhotoBtn: {
    alignItems: 'center',
    marginBottom: 8,
  },
  removePhotoText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: '#E53935',
  },

  // ── Modal pays / listes ──
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
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  modalItemSelected: {
    backgroundColor: '#FFF5F0',
  },
  modalItemText: {
    fontFamily: FONT_REGULAR,
    fontSize: 15,
    color: COLORS.text,
  },
  modalItemTextSelected: {
    color: COLORS.orange,
    fontFamily: FONT_SEMIBOLD,
  },
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
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
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
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  photoModalCancelText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.textLight,
  },

  // ── Checkbox verte (Q10) ──
  checkboxGreen: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },

  // ── Checkbox row centrée ──
  checkboxRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },

  // ── Carte succès (plus grande) ──
  cardSuccess: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    paddingVertical: 48,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    alignItems: 'center',
  },
  successTitle: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
  },
  successDescription: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },

  // ── Boutons étape 5 — "Je ne trouve pas" (outline) ──
  btnStep5Skip: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.orange,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: COLORS.white,
  },
  btnStep5SkipPressed: {
    backgroundColor: '#F4956A',
    borderColor: COLORS.orange,
  },
  btnStep5SkipText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.orange,
    textAlign: 'center',
  },
  btnStep5SkipTextPressed: {
    color: COLORS.white,
  },

  // ── Boutons étape 5 — "Je valide" (orange plein) ──
  btnStep5Validate: {
    flex: 1,
    backgroundColor: COLORS.orange,
    borderWidth: 2,
    borderColor: COLORS.orange,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnStep5ValidatePressed: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange,
  },
  btnStep5ValidateText: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
  },
  btnStep5ValidateTextPressed: {
    color: COLORS.orange,
  },

  // ── Intro questionnaire ──
  questionIntro: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 4,
  },
});