import React from 'react';
import {
  Image,
  Linking,
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
import { useLanguage } from '../../context/LanguageContext';
import { MENU_ITEMS } from '../../constants';

/**
 * Composant principal qui assemble les différentes parties de l'écran d'accueil.
 * Il intègre la barre de navigation, le corps de la page (scrollable) et le bouton d'action flottant.
 */
const MainPage = () => {
  const { navigateTo, navigateToMessaging, navigateToAgenda, navigateToHealth, navigateToQuestionnaire, navigateToNews } = useNavigation();
  const { t } = useLanguage();

  /**
   * Gère le clic sur un élément du menu
   */
  const handleMenuItemPress = (itemId: string) => {
    if (itemId === 'health') {
      navigateToHealth();
    } else if (itemId === 'professionals') {
      navigateTo('professionals');
    } else if (itemId === 'message') {
      navigateToMessaging();
    } else if (itemId === 'agenda') {
      navigateToAgenda();
    } else if (itemId === 'notebook') {
            navigateTo('carnet-audition');
    } else if (itemId === 'hearing') {
        navigateTo('appareillage');
    } else if (itemId === 'questionnaire') {
      navigateToQuestionnaire();
    } else if (itemId === 'news') {
      navigateToNews();
    }
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
              accessibilityLabel={item.label}
              accessibilityRole="button"
            >
              <item.icon width={48} height={48} />
              <Text style={styles.tileLabel}>{t(`menu.${item.id}`)}</Text>
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
            <Text style={styles.bannerText}>{t('main.banner')}</Text>
          </View>
        </View>

        {/* Pied de page légal */}
        <View style={styles.footer}>
          <Text style={styles.footerCopyright}>{t('main.footer.copyright').replace('{year}', String(new Date().getFullYear()))}</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://audya.com/mentions-legales')}
              accessibilityLabel="Mentions légales"
              accessibilityRole="link"
            >
              <Text style={styles.footerLink}>{t('main.footer.legal')}</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>·</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://audya.com/politique-de-confidentialite')}
              accessibilityLabel="Politique de confidentialité RGPD"
              accessibilityRole="link"
            >
              <Text style={styles.footerLink}>{t('main.footer.rgpd')}</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>·</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://audya.com/cookies')}
              accessibilityLabel="Gestion des cookies"
              accessibilityRole="link"
            >
              <Text style={styles.footerLink}>{t('main.footer.cookies')}</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>·</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:contact@audya.com')}
              accessibilityLabel="Nous contacter"
              accessibilityRole="link"
            >
              <Text style={styles.footerLink}>{t('main.footer.contact')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Barre de navigation inférieure (inclut le bouton chat) */}
      <BottomNav />
    </SafeAreaView>
  );
};

export default MainPage;
