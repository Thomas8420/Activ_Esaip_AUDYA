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
 *
 * Race condition fix : l'animation en cours est stoppée avant d'en démarrer
 * une nouvelle. `setMounted(false)` n'est appelé que si l'animation de
 * fermeture s'est terminée naturellement (finished === true), évitant ainsi
 * le crash "connectedAnimatedNodeToView" lors de toggles rapides.
 */
const AnimatedDropdown: React.FC<Props> = ({ visible, children, absolute = false }) => {
  const [mounted, setMounted] = useState(visible);
  const fadeAnim   = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(visible ? 0 : -6)).current;
  const animRef    = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Stopper toute animation en cours avant d'en lancer une nouvelle
    if (animRef.current) {
      animRef.current.stop();
      animRef.current = null;
    }

    if (visible) {
      setMounted(true);
      animRef.current = Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]);
      animRef.current.start(({ finished }) => {
        if (finished) { animRef.current = null; }
      });
    } else {
      animRef.current = Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 130, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -6, duration: 130, useNativeDriver: true }),
      ]);
      animRef.current.start(({ finished }) => {
        animRef.current = null;
        // Ne démonter que si l'animation est allée jusqu'au bout
        // (pas stoppée par un toggle rapide)
        if (finished) { setMounted(false); }
      });
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
