import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * BottomSheetModal — Wrapper générique pour les modaux bottom-sheet.
 * Overlay (fond sombre) et sheet (contenu blanc) s'animent indépendamment :
 * - Overlay : fade-in / fade-out
 * - Sheet   : spring slide-up / timing slide-down
 * Le composant anime toujours la fermeture, qu'elle soit déclenchée par
 * l'overlay ou par le parent (passage de visible à false).
 * Les enfants fournissent leur propre style de feuille (borderRadius, padding…).
 */
const BottomSheetModal = ({ visible, onClose, children }: Props) => {
  const [mounted, setMounted] = useState(visible);
  const fadeAnim  = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(visible ? 0 : SCREEN_HEIGHT)).current;
  const animRef   = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Stopper toute animation en cours avant d'en lancer une nouvelle
    if (animRef.current) {
      animRef.current.stop();
      animRef.current = null;
    }

    if (visible) {
      setMounted(true);
      animRef.current = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 180,
          mass: 0.8,
          overshootClamping: false,
          useNativeDriver: true,
        }),
      ]);
      animRef.current.start(({ finished }) => {
        if (finished) { animRef.current = null; }
      });
    } else {
      animRef.current = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);
      animRef.current.start(({ finished }) => {
        animRef.current = null;
        // Ne démonter que si l'animation est allée jusqu'au bout
        if (finished) { setMounted(false); }
      });
    }
  }, [visible, fadeAnim, slideAnim]);

  if (!mounted) { return null; }

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Fond sombre — absoluteFill, ne capture aucune touche */}
        <Animated.View
          style={[styles.overlay, { opacity: fadeAnim }]}
          pointerEvents="none"
        />

        {/* Zone de fermeture au tap — absoluteFill, sous le sheet */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

        {/* Sheet — positionné en bas par justifyContent, slide animé */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
});

export default BottomSheetModal;
