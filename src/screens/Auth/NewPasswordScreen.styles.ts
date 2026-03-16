import {StyleSheet} from 'react-native';
import {COLORS} from '../../styles/auth/colors';
import {TYPOGRAPHY} from '../../styles/auth/typography';
import {SPACING, BORDER_RADIUS} from '../../styles/auth/spacing';

export const newPasswordScreenStyles = StyleSheet.create({
  keyboardView: {flex: 1},
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },

  logoContainer: {alignItems: 'center', marginBottom: 40},

  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.inputBackground,
    marginBottom: SPACING.sm,
  },
  inputError: {borderColor: COLORS.error, backgroundColor: COLORS.errorLight},
  input: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
  },
  eyeBtn: {padding: SPACING.md},
  eyeText: {fontSize: 18, color: '#666'},

  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    marginRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {borderColor: COLORS.primary},
  checkmark: {width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary},
  checkboxLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    flex: 1,
  },

  contactLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  radioRow: {flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg},
  radioOption: {flexDirection: 'row', alignItems: 'center', marginRight: SPACING.xl},
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  radioCircleSelected: {borderColor: COLORS.primary},
  radioInner: {width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary},
  radioLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  infoText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  submitButton: {marginBottom: SPACING.md},
});
