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

type ResolvedBase = 'primary' | 'secondary' | 'outline' | 'newEmail';

const resolveBase = (variant: ButtonVariant): ResolvedBase => {
  if (['verify', 'validatePwd'].includes(variant)) return 'primary';
  if (['resend', 'register'].includes(variant)) return 'outline';
  if (variant === 'newEmail') return 'newEmail';
  return variant as ResolvedBase;
};

const resolveButtonStyles = (
  base: ResolvedBase,
  variant: ButtonVariant,
  pressed: boolean,
  disabled: boolean,
  loading: boolean,
): ViewStyle[] => {
  const s: ViewStyle[] = [styles.button];
  if (base === 'primary') { s.push(styles.button_primary); }
  if (base === 'secondary') { s.push(styles.button_secondary); }
  if (base === 'outline') { s.push(styles.button_outline); }
  if (base === 'newEmail' && !pressed) { s.push(styles.button_newEmail); }
  if (base === 'newEmail' && pressed) { s.push(styles.button_newEmailPressed); }
  if (variant === 'verify' || variant === 'resend') { s.push(styles.button_compact); }
  if (variant === 'validatePwd') { s.push(styles.button_fullWidth); }
  if (pressed && base === 'primary') { s.push(styles.button_primaryPressed); }
  if (pressed && base === 'outline') { s.push(styles.button_outlinePressed); }
  if (disabled || loading) { s.push(styles.button_disabled); }
  return s;
};

const resolveLabelStyles = (
  base: ResolvedBase,
  variant: ButtonVariant,
  pressed: boolean,
): TextStyle[] => {
  const s: TextStyle[] = [styles.text];
  if (base === 'primary') { s.push(styles.text_primary); }
  if (base === 'secondary') { s.push(styles.text_secondary); }
  if (base === 'outline') { s.push(styles.text_outline); }
  if (base === 'newEmail' && !pressed) { s.push(styles.text_newEmail); }
  if (base === 'newEmail' && pressed) { s.push(styles.text_newEmailPressed); }
  if (variant === 'verify' || variant === 'resend') { s.push(styles.text_compact); }
  if (pressed && base === 'primary') { s.push(styles.text_primaryPressed); }
  return s;
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
  const buttonStyles = resolveButtonStyles(base, variant, pressed, disabled, loading);
  const labelStyles = resolveLabelStyles(base, variant, pressed);

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
