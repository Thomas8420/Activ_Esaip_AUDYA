import {StyleSheet} from 'react-native';
import {COLORS} from '../../styles/auth/colors';
import {TYPOGRAPHY} from '../../styles/auth/typography';
import {SPACING, BORDER_RADIUS} from '../../styles/auth/spacing';

export const forgotPasswordScreenStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },

  description: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.lg,
  },

  serverError: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },

  submitButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    alignSelf: 'center',
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  registerText: {fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textPrimary},
  registerLink: {fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.primary},
});
