import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

/** Bulles décoratives en arrière-plan des écrans d'authentification. */
const Bubbles: React.FC = () => (
  <>
    <View style={[styles.baseBubble, styles.bubbleTopRight]} pointerEvents="none" />
    <View style={[styles.baseBubble, styles.bubbleBottomLeft]} pointerEvents="none" />
  </>
);

const styles = StyleSheet.create({
  baseBubble: {
    position: 'absolute',
    width: 180,
    height: 180,
    backgroundColor: '#D9D9D9',
    opacity: 0.3,
  } as ViewStyle,
  bubbleTopRight: {
    borderRadius: 75,
    top: 60,
    right: -80,
  },
  bubbleBottomLeft: {
    borderRadius: 85,
    bottom: 60,
    left: -80,
  },
});

export default Bubbles;
