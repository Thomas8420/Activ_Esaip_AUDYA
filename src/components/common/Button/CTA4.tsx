import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { FONT_SEMIBOLD } from '../../../screens/Home/HomeScreen.styles';

const CTA4_BACKGROUND = '#C8D6E1';
const CTA4_TEXT = '#172A4F';

interface CTA4Props {
  readonly label: string;
  readonly onPress?: () => void;
  readonly style?: ViewStyle;
}

const CTA4: React.FC<CTA4Props> = ({ label, onPress, style }) => (
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
