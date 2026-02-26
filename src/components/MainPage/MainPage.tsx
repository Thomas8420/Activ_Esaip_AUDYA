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
import Fab from '../common/Button/Fab';

// --- Imports des icônes SVG pour la grille ---
import HealthIcon from '../../assets/images/patient.svg';
import HearingIcon from '../../assets/images/son-doreille.svg';
import NotebookIcon from '../../assets/images/dossier-patient.svg';
import ProfessionalsIcon from '../../assets/images/medecin-de-lutilisateur.svg';
import AgendaIcon from '../../assets/images/calendrier.svg';
import MessageIcon from '../../assets/images/discussion-sur-les-bulles.svg';
import QuestionnaireIcon from '../../assets/images/barre-de-satisfaction.svg';
import NewsIcon from '../../assets/images/journal.svg';

/**
 * Données statiques pour les éléments de la grille de menu.
 * Chaque objet contient un identifiant, un libellé et le composant icône à afficher.
 */
const MENU_ITEMS = [
  { id: 'health', label: 'Ma santé', icon: HealthIcon },
  { id: 'hearing', label: 'Mon appareillage', icon: HearingIcon },
  { id: 'notebook', label: 'Mon carnet audition', icon: NotebookIcon },
  { id: 'professionals', label: 'Mes professionnels', icon: ProfessionalsIcon },
  { id: 'agenda', label: 'Mon agenda', icon: AgendaIcon },
  { id: 'message', label: 'Ma messagerie', icon: MessageIcon },
  { id: 'questionnaire', label: 'Mes questionnaires', icon: QuestionnaireIcon },
  { id: 'news', label: 'Mes actualités', icon: NewsIcon },
];

/**
 * Composant principal qui assemble les différentes parties de l'écran d'accueil.
 * Il intègre la barre de navigation, le corps de la page (scrollable) et le bouton d'action flottant.
 */
const MainPage = () => {
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
            <TouchableOpacity key={item.id} style={styles.tile} activeOpacity={0.7}>
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

      {/* Affiche le bouton d'action flottant */}
      <Fab />
    </SafeAreaView>
  );
};

export default MainPage;
