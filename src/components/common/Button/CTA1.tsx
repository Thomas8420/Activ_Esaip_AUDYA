import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { COLORS, FONT_SEMIBOLD } from '../../../screens/Home/HomeScreen.styles';

interface Cta1ButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: object; // Pour des ajustements de layout (marge, etc.)
}

const Cta1Button: React.FC<Cta1ButtonProps> = ({ label, onPress, style }) => {
  // 👉 État local pour savoir si le bouton est pressé
  const [isPressed, setIsPressed] = useState(false);

  // 👉 Styles dynamiques pour le conteneur du bouton
  const buttonStyle = [
    styles.button,
    {
      backgroundColor: isPressed ? COLORS.white : COLORS.orange,
      borderColor: COLORS.orange,
      borderWidth: 1,
    },
    style,
  ];

  const textStyle = [
    styles.text,
    { color: isPressed ? COLORS.orange : COLORS.white },
  ];

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      style={buttonStyle}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  text: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Cta1Button;