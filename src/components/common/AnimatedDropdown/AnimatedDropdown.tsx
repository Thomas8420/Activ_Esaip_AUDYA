import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface Props {
  visible: boolean;
  children: React.ReactNode;
  /** Pour les dropdowns position:absolute — repositionne le wrapper à top:0 du parent afin de préserver l'origine absolue. */
  absolute?: boolean;
}

/**
 * AnimatedDropdown — Wrapper d'animation pour les listes déroulantes.
 * Fade in + léger slide-down à l'ouverture, fade out + slide-up à la fermeture.
 * Gère le montage/démontage pour éviter les espaces résiduels.
 */
const AnimatedDropdown: React.FC<Props> = ({ visible, children, absolute = false }) => {
  const [mounted, setMounted] = useState(visible);
  const fadeAnim    = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateY  = useRef(new Animated.Value(visible ? 0 : -6)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 130,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -6,
          duration: 130,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible, fadeAnim, translateY]);

  if (!mounted) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents={absolute ? 'box-none' : 'auto'}
      style={[
        absolute && { position: 'absolute', top: 0, left: 0, right: 0 },
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedDropdown;
