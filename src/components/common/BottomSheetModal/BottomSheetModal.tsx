import React, { useCallback, useEffect, useRef } from 'react';
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
 * Les enfants fournissent leur propre style de feuille (borderRadius, padding…).
 */
const BottomSheetModal = ({ visible, onClose, children }: Props) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const animateIn = useCallback(() => {
    Animated.parallel([
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
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleClose = useCallback(() => {
    Animated.parallel([
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
    ]).start(() => onClose());
  }, [fadeAnim, slideAnim, onClose]);

  useEffect(() => {
    if (visible) {
      animateIn();
    } else {
      // Réinitialise pour la prochaine ouverture
      fadeAnim.setValue(0);
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible, animateIn, fadeAnim, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Fond sombre — absoluteFill, ne capture aucune touche */}
        <Animated.View
          style={[styles.overlay, { opacity: fadeAnim }]}
          pointerEvents="none"
        />

        {/* Zone de fermeture au tap — absoluteFill, sous le sheet */}
        <TouchableWithoutFeedback onPress={handleClose}>
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
