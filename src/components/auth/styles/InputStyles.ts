import {StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/auth/colors';
import {TYPOGRAPHY} from '../../../styles/auth/typography';
import {SPACING, BORDER_RADIUS} from '../../../styles/auth/spacing';

export const inputStyles = StyleSheet.create({
  container: {marginBottom: SPACING.md},
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: 50,
  },
  inputContainerFocused: {borderColor: COLORS.inputBorderFocus, borderWidth: 2},
  inputContainerError: {borderColor: COLORS.inputBorderError, backgroundColor: COLORS.errorLight},
  inputContainerDisabled: {backgroundColor: COLORS.backgroundGray, opacity: 0.6},
  iconContainer: {marginRight: SPACING.sm},
  input: {flex: 1, fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.textPrimary, paddingVertical: SPACING.sm},
  inputWithIcon: {marginLeft: SPACING.xs},
  eyeIcon: {padding: SPACING.xs},
  eyeIconText: {fontSize: 18, color: '#666'},
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});
