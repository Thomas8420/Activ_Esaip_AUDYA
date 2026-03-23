import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent } from 'react-native';

// 👉 Définition de tes couleurs (à adapter selon tes constantes globales)
// Utilisation d'un orange primary estimé à partir des images.
const PRIMARY_COLOR = '#F15A24'; // Orange primary
const WHITE_COLOR = '#FFFFFF';
const TEXT_DARK = '#333333'; // Gris foncé pour le texte par défaut
// const FONT_SEMIBOLD = 'Montserrat-SemiBold'; // Si tu as une police spécifique

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
      // Défaut : orange plein, Pressé : blanc avec contour orange
      backgroundColor: isPressed ? WHITE_COLOR : PRIMARY_COLOR,
      borderColor: PRIMARY_COLOR, // Toujours la même couleur pour le contour
      borderWidth: 1, // Contour toujours présent pour la constance de taille
    },
    style, // Application des styles externes (marges, etc.)
  ];

  // 👉 Styles dynamiques pour le texte à l'intérieur
  const textStyle = [
    styles.text,
    {
      // Défaut : texte blanc, Pressé : texte orange
      color: isPressed ? PRIMARY_COLOR : WHITE_COLOR,
    },
  ];

  return (
    <Pressable
      // 👉 Gestion des états de presse
      onPressIn={() => setIsPressed(true)}   // Quand on commence à appuyer
      onPressOut={() => setIsPressed(false)} // Quand on relâche
      onPress={onPress}                     // L'action principale
      style={buttonStyle}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    // 👉 Style de base du bouton (layout, arrondis)
    borderRadius: 20, // Coins très arrondis comme sur les images
    paddingVertical: 10, // Espace vertical à l'intérieur
    paddingHorizontal: 20, // Espace horizontal à l'intérieur
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100, // Taille minimale pour éviter des boutons trop étroits
  },
  text: {
    // 👉 Style de base du texte
    // fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600', // Poids du texte (SemiBold)
  },
});

export default Cta1Button;