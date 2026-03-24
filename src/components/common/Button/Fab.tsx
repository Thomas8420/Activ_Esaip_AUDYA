import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles, COLORS } from '../../../screens/Home/HomeScreen.styles';

import ChatIcon from '../../../assets/images/chat.svg';

/**
 * Affiche le bouton d'action flottant (Floating Action Button) pour le chat.
 * C'est un composant commun qui peut être réutilisé sur d'autres écrans.
 */
const Fab = () => {
  return (
    // Le bouton est rendu via un TouchableOpacity pour la rétroaction au toucher.
    <TouchableOpacity
      style={styles.fab}
      accessibilityLabel="Assistant AUDYA"
      accessibilityRole="button"
    >
      <ChatIcon width={26} height={26} fill={COLORS.white} />
    </TouchableOpacity>
  );
};

export default Fab;
