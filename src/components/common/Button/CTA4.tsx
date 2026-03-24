import React from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';
import { FONT_SEMIBOLD } from '../../../screens/Home/HomeScreen.styles';

const CTA4_BACKGROUND = '#C8D6E1';
const CTA4_TEXT = '#172A4F';

interface CTA4Props {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle; // Pour des ajustements de layout
  textStyle?: TextStyle;
}

const CTA4: React.FC<CTA4Props> = ({ label, onPress, style, textStyle }) => {
  const buttonStyle: ViewStyle[] = style ? [styles.button, style] : [styles.button];
  const textStyleComputed: TextStyle[] = textStyle ? [styles.text, textStyle] : [styles.text];

  return (
    <Pressable
      onPress={onPress}
      style={buttonStyle}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={textStyleComputed}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: CTA4_BACKGROUND,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    textAlign: 'center',
    color: CTA4_TEXT,
  },
});

export default CTA4;