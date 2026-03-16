import {StyleSheet} from 'react-native';
import {COLORS} from '../../styles/auth/colors';
import {TYPOGRAPHY} from '../../styles/auth/typography';
import {SPACING, BORDER_RADIUS} from '../../styles/auth/spacing';

export const emailVerificationScreenStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },

  atIcon: {
    fontSize: 64,
    color: '#AAAAAA',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },

  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },

  description: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },

  button: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
});
