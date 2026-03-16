import {StyleSheet} from 'react-native';
import {COLORS} from '../../styles/auth/colors';
import {TYPOGRAPHY} from '../../styles/auth/typography';
import {SPACING, BORDER_RADIUS} from '../../styles/auth/spacing';

export const verifyCodeScreenStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },

  modalContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
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
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },

  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },

  successText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.success,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: SPACING.md,
    gap: 12,
  },
});
