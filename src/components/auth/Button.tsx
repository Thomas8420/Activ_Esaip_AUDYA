import React, {useState} from 'react';
import {TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle} from 'react-native';
import {COLORS} from '../../styles/auth/colors';
import {buttonStyles as styles} from './styles/ButtonStyles';

/**
 * Variantes disponibles :
 * 'primary'     → Bouton orange plein
 * 'outline'     → Bouton contour orange, fond transparent
 * 'secondary'   → Bouton fond secondaire
 * 'verify'      → primary compact
 * 'resend'      → outline compact
 * 'newEmail'    → fond blanc + contour orange → orange plein au clic
 * 'validatePwd' → primary pleine largeur
 * 'register'    → alias outline
 */
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'verify'
  | 'resend'
  | 'newEmail'
  | 'validatePwd'
  | 'register';

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
};

const resolveBase = (
  variant: ButtonVariant,
): 'primary' | 'secondary' | 'outline' | 'newEmail' => {
  if (['verify', 'validatePwd'].includes(variant)) return 'primary';
  if (['resend', 'register'].includes(variant)) return 'outline';
  if (variant === 'newEmail') return 'newEmail';
  return variant as 'primary' | 'secondary' | 'outline';
};

const AuthButton: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}) => {
  const [pressed, setPressed] = useState(false);
  const base = resolveBase(variant);

  const buttonStyles: ViewStyle[] = [
    styles.button,
    ...(base === 'primary' ? [styles.button_primary] : []),
    ...(base === 'secondary' ? [styles.button_secondary] : []),
    ...(base === 'outline' ? [styles.button_outline] : []),
    ...(base === 'newEmail' && !pressed ? [styles.button_newEmail] : []),
    ...(base === 'newEmail' && pressed ? [styles.button_newEmailPressed] : []),
    ...(variant === 'verify' || variant === 'resend' ? [styles.button_compact] : []),
    ...(variant === 'validatePwd' ? [styles.button_fullWidth] : []),
    ...(pressed && base === 'primary' ? [styles.button_primaryPressed] : []),
    ...(pressed && base === 'outline' ? [styles.button_outlinePressed] : []),
    ...((disabled || loading) ? [styles.button_disabled] : []),
  ];

  const labelStyles: TextStyle[] = [
    styles.text,
    ...(base === 'primary' ? [styles.text_primary] : []),
    ...(base === 'secondary' ? [styles.text_secondary] : []),
    ...(base === 'outline' ? [styles.text_outline] : []),
    ...(base === 'newEmail' && !pressed ? [styles.text_newEmail] : []),
    ...(base === 'newEmail' && pressed ? [styles.text_newEmailPressed] : []),
    ...(variant === 'verify' || variant === 'resend' ? [styles.text_compact] : []),
    ...(pressed && base === 'primary' ? [styles.text_primaryPressed] : []),
  ];

  return (
    <TouchableOpacity
      style={[...buttonStyles, style]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
      activeOpacity={1}
      testID={testID}>
      {loading ? (
        <ActivityIndicator
          color={base === 'outline' ? COLORS.primary : COLORS.textWhite}
        />
      ) : (
        <Text
          style={[...labelStyles, textStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AuthButton;
