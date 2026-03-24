import React from 'react';
import {View, StyleSheet} from 'react-native';

/** Bulles décoratives en arrière-plan des écrans d'authentification. */
const Bubbles: React.FC = () => (
  <>
    <View style={styles.bubbleTopRight} pointerEvents="none" />
    <View style={styles.bubbleBottomLeft} pointerEvents="none" />
  </>
);

const styles = StyleSheet.create({
  bubbleTopRight: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 75,
    backgroundColor: '#D9D9D9',
    top: 60,
    right: -80,
    opacity: 0.3,
  },
  bubbleBottomLeft: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 85,
    backgroundColor: '#D9D9D9',
    bottom: 60,
    left: -80,
    opacity: 0.3,
  },
});

export default Bubbles;
