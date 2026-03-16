import {StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/auth/colors';
import {TYPOGRAPHY} from '../../../styles/auth/typography';
import {SPACING, BORDER_RADIUS} from '../../../styles/auth/spacing';

export const buttonStyles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    alignSelf: 'center',
  },

  // Fonds de base
  button_primary: {backgroundColor: COLORS.primary},
  button_secondary: {backgroundColor: COLORS.secondary},
  button_outline: {backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.primary},

  // newEmail : blanc + contour orange au repos, orange plein au clic
  button_newEmail: {backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: COLORS.primary},
  button_newEmailPressed: {backgroundColor: COLORS.primary, borderWidth: 2, borderColor: COLORS.primary},

  // Feedback clic primary et outline
  button_primaryPressed: {backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: COLORS.primary},
  button_outlinePressed: {backgroundColor: COLORS.primary + '20'},

  // Modificateurs de taille
  button_compact: {flex: 1, paddingVertical: SPACING.sm, minHeight: 42},
  button_fullWidth: {alignSelf: 'stretch'},

  // Désactivé
  button_disabled: {opacity: 0.5},

  // Textes
  text: {fontSize: TYPOGRAPHY.fontSize.base, fontWeight: TYPOGRAPHY.fontWeight.semibold},
  text_primary: {color: COLORS.textWhite},
  text_secondary: {color: COLORS.textWhite},
  text_outline: {color: COLORS.primary},

  // newEmail : texte orange au repos → blanc au clic
  text_newEmail: {color: COLORS.primary},
  text_newEmailPressed: {color: COLORS.textWhite},

  text_primaryPressed: {color: COLORS.primary},
  text_compact: {fontSize: TYPOGRAPHY.fontSize.sm},
});
