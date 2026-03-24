import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatIcon from '../../../assets/images/chat.svg';
import { COLORS, FONT_REGULAR, FONT_SEMIBOLD } from '../../../screens/Home/HomeScreen.styles';
import { Screen, useNavigation } from '../../../context/NavigationContext';
import { MENU_ITEMS } from '../../../constants';
import ChatbotModal from '../../Chatbot/ChatbotModal';

/** Icône maison */
const HomeIcon = ({ color }: { color: string }) => (
  <Icon name="home" size={28} color={color} />
);

/** Icône hamburger */
const MenuIcon = ({ color }: { color: string }) => (
  <Icon name="menu" size={24} color={color} />
);

/** Correspondance écran → libellé affiché dans le bouton central */
const SCREEN_LABELS: Partial<Record<Screen, string>> = {
  home: 'Accueil',
  professionals: 'Mes professionnels',
  'professional-profile': 'Mes professionnels',
  'add-professional': 'Mes professionnels',
  'invite-professional': 'Mes professionnels',
  settings: 'Mes paramètres',
  'my-profile': 'Mon profil',
  'messaging': 'Ma messagerie',
  'messaging-chat': 'Ma messagerie',
  'agenda': 'Mon agenda',
  'agenda-day': 'Mon agenda',
  'agenda-form': 'Mon agenda',
};

/**
 * Barre de navigation inférieure.
 * - Gauche : icône maison → retour à l'accueil
 * - Centre : bouton pill blanc → nom de la section active / ouvre le menu
 * - Droite : bouton chat (Fab intégré)
 */
const BottomNav = () => {
  const { currentScreen, goHome, navigateTo, navigateToMessaging, navigateToAgenda } = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { bottom: bottomInset } = useSafeAreaInsets();

  const sectionLabel = SCREEN_LABELS[currentScreen] ?? 'Menu';

  const handleMenuItemPress = (itemId: string) => {
    setMenuOpen(false);
    if (itemId === 'professionals') {
      navigateTo('professionals');
    } else if (itemId === 'home') {
      goHome();
    } else if (itemId === 'message') {
      navigateToMessaging();
    } else if (itemId === 'agenda') {
      navigateToAgenda();
    }
    // TODO: implémenter la navigation pour les autres onglets
  };

  return (
    <>
      {/* ── Chatbot ── */}
      <ChatbotModal visible={chatbotOpen} onClose={() => setChatbotOpen(false)} />

      {/* ── Popup menu ── */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuPopup}>
            {MENU_ITEMS.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <View style={styles.menuSeparator} />}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.id)}
                  activeOpacity={0.7}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                >
                  <item.icon width={22} height={22} fill={COLORS.orange} />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* ── Barre ── */}
      <View style={[styles.container, { paddingBottom: 10 + bottomInset / 4 }]}>
        {/* Bouton Accueil */}
        <TouchableOpacity
          style={styles.sideButton}
          onPress={goHome}
          activeOpacity={0.7}
          accessibilityLabel="Accueil"
          accessibilityRole="button"
        >
          <HomeIcon color={COLORS.white} />
        </TouchableOpacity>

        {/* Bouton central : section active + ouvre le menu */}
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => setMenuOpen(true)}
          activeOpacity={0.85}
          accessibilityLabel="Ouvrir le menu"
          accessibilityRole="button"
        >
          <MenuIcon color={COLORS.orange} />
          <Text style={styles.centerLabel} numberOfLines={1}>
            {sectionLabel}
          </Text>
        </TouchableOpacity>

        {/* Bouton Chat (Fab intégré) — ouvre le chatbot AUDYA */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setChatbotOpen(true)}
          activeOpacity={0.7}
          accessibilityLabel="Assistant AUDYA"
          accessibilityRole="button"
        >
          <ChatIcon width={26} height={26} fill={COLORS.white} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  sideButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  centerLabel: {
    flex: 1,
    fontFamily: FONT_SEMIBOLD,
    fontSize: 15,
    color: COLORS.orange,
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Menu popup ──
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  menuPopup: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 16,
  },
  menuItemLabel: {
    fontFamily: FONT_REGULAR,
    fontSize: 15,
    color: COLORS.text,
  },
  menuSeparator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 24,
  },
});

export default BottomNav;
