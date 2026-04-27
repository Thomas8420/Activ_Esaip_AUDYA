import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, FONT_SEMIBOLD } from '../../../screens/Home/HomeScreen.styles';

interface Cta1ButtonProps {
  readonly label: string;
  readonly onPress?: () => void;
  readonly style?: ViewStyle;
  readonly textStyle?: TextStyle;
  readonly disabled?: boolean;
}

const Cta1Button: React.FC<Cta1ButtonProps> = ({ label, onPress, style, textStyle, disabled }) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      pressed && !disabled && styles.buttonPressed,
      disabled && styles.buttonDisabled,
      style,
    ]}
    onPress={disabled ? undefined : onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled }}
  >
    {({ pressed }) => (
      <Text style={[styles.text, pressed && !disabled && styles.textPressed, textStyle]}>
        {label}
      </Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    backgroundColor: COLORS.orange,
    borderWidth: 1,
    borderColor: COLORS.orange,
  },
  buttonPressed: {
    backgroundColor: COLORS.white,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  text: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.white,
  },
  textPressed: {
    color: COLORS.orange,
  },
});

export default Cta1Button;
