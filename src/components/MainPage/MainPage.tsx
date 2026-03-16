import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../screens/Home/HomeScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import { useNavigation } from '../../context/NavigationContext';
import { MENU_ITEMS } from '../../constants';

/**
 * Composant principal qui assemble les différentes parties de l'écran d'accueil.
 * Il intègre la barre de navigation, le corps de la page (scrollable) et le bouton d'action flottant.
 */
const MainPage = () => {
  const { navigateTo, navigateToMessaging, navigateToAgenda } = useNavigation();

  /**
   * Gère le clic sur un élément du menu
   */
  const handleMenuItemPress = (itemId: string) => {
    if (itemId === 'professionals') {
      navigateTo('professionals');
    } else if (itemId === 'message') {
      navigateToMessaging();
    } else if (itemId === 'agenda') {
      navigateToAgenda();
    }
    // TODO: Implémenter la navigation pour les autres éléments du menu
  };

  return (
    // SafeAreaView assure que le contenu ne chevauche pas les encoches du téléphone.
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Affiche la barre de navigation */}
      <NavBar />

      {/* Le contenu principal est dans un ScrollView pour permettre le défilement */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Grille de tuiles cliquables */}
        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.tile}
              activeOpacity={0.7}
              onPress={() => handleMenuItemPress(item.id)}
            >
              <item.icon width={48} height={48} />
              <Text style={styles.tileLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bannière promotionnelle ou d'information */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef' }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>
              Audya simplifie le suivi patient et renforce la coordination pluridisciplinaire
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Barre de navigation inférieure (inclut le bouton chat) */}
      <BottomNav />
    </SafeAreaView>
  );
};

export default MainPage;
