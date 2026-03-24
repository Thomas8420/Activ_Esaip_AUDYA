import React from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';

// 👉 Définition de tes couleurs Figma (image_50.png)
const CTA4_BACKGROUND = '#C8D6E1'; // Gris-bleu très clair uni
const CTA4_TEXT = '#172A4F'; // Marine très foncé

interface CTA4Props {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle; // Pour des ajustements de layout
  textStyle?: TextStyle;
}

const CTA4: React.FC<CTA4Props> = ({ label, onPress, style, textStyle }) => {
  // 👉 Style du bouton
  const buttonStyle: ViewStyle[] = [
    styles.button,
    style, // Application des styles externes
  ];

  // 👉 Style du texte
  const textStyleComputed: TextStyle[] = [
    styles.text,
    textStyle,
  ];

  return (
    <Pressable
      onPress={onPress} // L'action principale
      style={buttonStyle}
    >
      <Text style={textStyleComputed}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    // 👉 Style de base du bouton selon Figma (image_50.png)
    borderRadius: 20, // Corner radius
    backgroundColor: CTA4_BACKGROUND, // Fill
    paddingVertical: 10, // Padding vertical
    paddingHorizontal: 20, // Padding horizontal
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    // 👉 Style de base du texte selon Figma (image_50.png)
    fontSize: 16,
    textAlign: 'center',
    color: CTA4_TEXT, // Texte color
    fontWeight: '600', // Poids du texte (SemiBold)
  },
});

export default CTA4;