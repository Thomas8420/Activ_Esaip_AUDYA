import React, { useState } from 'react';
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles, COLORS } from '../../../screens/Home/HomeScreen.styles';

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
  // État local pour gérer la visibilité du menu déroulant.
  const [profileOpen, setProfileOpen] = useState(false);

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
          <TouchableOpacity style={styles.headerIconBtn} accessibilityLabel="Notifications">
            <BellIcon width={30} height={30} fill={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerIconBtn} accessibilityLabel="Paramètres">
            <SettingsIcon width={30} height={30} fill={COLORS.white} />
          </TouchableOpacity>

          {/* Bouton pour ouvrir/fermer le menu déroulant */}
          <TouchableOpacity
            style={[styles.headerIconBtn, {flexDirection: 'row', gap: 4, width: 'auto', paddingHorizontal: 5}]}
            onPress={() => setProfileOpen(!profileOpen)}
          >
            <ProfileIcon width={30} height={30} fill={COLORS.white} />
            <DropdownIcon width={18} height={18} fill={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* -- Menu déroulant du profil -- */}
      {/* Conditionnellement rendu en fonction de l'état `profileOpen` */}
      {profileOpen && (
        <>
          {/* Filtre gris semi-transparent qui ferme le menu au clic */}
          <Pressable style={styles.dropdownOverlay} onPress={() => setProfileOpen(false)} />

          {/* Contenu du menu déroulant */}
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownItem}>
                <ProfileIcon width={18} height={18} fill={COLORS.white} />
                <Text style={styles.dropdownLabel}>Profil</Text>
            </TouchableOpacity>
            <View style={styles.dropdownSeparator} />
            <TouchableOpacity style={styles.dropdownItem}>
                <SettingsIcon width={18} height={18} fill={COLORS.white} />
                <Text style={styles.dropdownLabel}>Préférences</Text>
            </TouchableOpacity>
            <View style={styles.dropdownSeparator} />
            <TouchableOpacity style={styles.dropdownItem}>
                <LogoutIcon width={18} height={18} fill={COLORS.white} />
                <Text style={styles.dropdownLabel}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

export default NavBar;
