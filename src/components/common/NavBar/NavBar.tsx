import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, COLORS, FONT_BOLD } from '../../../screens/Home/HomeScreen.styles';
import { useNavigation } from '../../../context/NavigationContext';
import { useAuth } from '../../../context/AuthContext';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  AppNotification,
} from '../../../services/notificationService';
import NotificationPanel from './NotificationPanel';

// --- Imports des icônes SVG ---
// Chaque icône est un composant React à part entière.
import LogoAudya from '../../../assets/images/logo-audya.svg';
import BellIcon from '../../../assets/images/bell.svg';
import SettingsIcon from '../../../assets/images/parameter.svg';
import ProfileIcon from '../../../assets/images/human.svg';
import DropdownIcon from '../../../assets/images/dropdown.svg';
import LogoutIcon from '../../../assets/images/on-off.svg';

/**
 * Barre de navigation supérieure de l'application.
 * Gère l'affichage du logo, des actions rapides (notifications, paramètres)
 * et le menu déroulant du profil utilisateur.
 */
const NavBar = () => {
  const { navigateToSettings, navigateToMyProfile } = useNavigation();
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { top: topInset } = useSafeAreaInsets();

  useEffect(() => {
    fetchNotifications()
      .then(setNotifications)
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter(n => n.readAt === null).length;

  const handleBellPress = () => {
    setNotifOpen(prev => !prev);
    setProfileOpen(false);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    const updated = await fetchNotifications();
    setNotifications(updated);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    const updated = await fetchNotifications();
    setNotifications(updated);
  };

  return (
    <>
      {/* -- Barre de navigation principale -- */}
      <View style={styles.header}>
        {/* Logo à gauche */}
        <View style={styles.headerLeft}>
          <LogoAudya width={152} height={81} />
        </View>

        {/* Actions à droite (pilule orange) */}
        <View style={styles.headerActions}>

          {/* Cloche notifications + badge */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : ''}`}
            accessibilityRole="button"
            onPress={handleBellPress}
          >
            <BellIcon width={30} height={30} fill={COLORS.white} />
            {unreadCount > 0 && (
              <View style={badgeStyles.badge}>
                <Text style={badgeStyles.badgeText}>
                  {unreadCount > 9 ? '9+' : String(unreadCount)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            accessibilityLabel="Paramètres"
            accessibilityRole="button"
            onPress={navigateToSettings}
          >
            <SettingsIcon width={30} height={30} color="white" />
          </TouchableOpacity>

          {/* Bouton pour ouvrir/fermer le menu déroulant */}
          <TouchableOpacity
            style={styles.headerIconBtnWide}
            onPress={() => { setProfileOpen(prev => !prev); setNotifOpen(false); }}
            accessibilityLabel="Menu profil"
            accessibilityRole="button"
          >
            <ProfileIcon width={30} height={30} color="white" />
            <DropdownIcon width={18} height={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* -- Panel notifications -- */}
      {notifOpen && (
        <NotificationPanel
          notifications={notifications}
          topOffset={25 + topInset}
          onClose={() => setNotifOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}

      {/* -- Menu déroulant du profil -- */}
      {profileOpen && (
        <>
          {/* Filtre gris semi-transparent qui ferme le menu au clic */}
          <Pressable style={styles.dropdownOverlay} onPress={() => setProfileOpen(false)} />

          {/* Contenu du menu déroulant */}
          <View style={[styles.dropdown, { top: 25 + topInset }]}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => { setProfileOpen(false); navigateToMyProfile(); }}
              accessibilityLabel="Mon profil"
              accessibilityRole="button"
            >
                <ProfileIcon width={18} height={18} color="#F15A24" />
                <Text style={styles.dropdownLabel}>Profil</Text>
            </TouchableOpacity>
            <View style={styles.dropdownSeparator} />
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => { setProfileOpen(false); navigateToSettings(); }}
              accessibilityLabel="Préférences"
              accessibilityRole="button"
            >
                <SettingsIcon width={18} height={18} color="#F15A24" />
                <Text style={styles.dropdownLabel}>Préférences</Text>
            </TouchableOpacity>
            <View style={styles.dropdownSeparator} />
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => { setProfileOpen(false); logout(); }}
              accessibilityLabel="Déconnexion"
              accessibilityRole="button"
            >
                <LogoutIcon width={18} height={18} color="#F15A24" />
                <Text style={styles.dropdownLabel}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

// ─── Styles locaux (badge uniquement) ─────────────────────────────────────────

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: FONT_BOLD,
    fontSize: 9,
    color: COLORS.orange,
    lineHeight: 12,
  },
});

export default NavBar;
