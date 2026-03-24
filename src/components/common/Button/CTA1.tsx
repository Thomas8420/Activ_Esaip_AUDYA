import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONT_SEMIBOLD } from '../../../screens/Home/HomeScreen.styles';

interface Cta1ButtonProps {
  readonly label: string;
  readonly onPress?: () => void;
  readonly style?: ViewStyle;
}

const Cta1Button: React.FC<Cta1ButtonProps> = ({ label, onPress, style }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
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
  text: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.white,
  },
});

export default Cta1Button;
