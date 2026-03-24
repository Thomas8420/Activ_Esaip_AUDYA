import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/Home/HomeScreen';
import HealthScreen from './src/screens/Health/HealthScreen';
import ProfessionalsScreen from './src/screens/Professionals/ProfessionalsScreen';
import ProfessionalProfileScreen from './src/screens/Professionals/ProfessionalProfileScreen';
import AddProfessionalScreen from './src/screens/Professionals/AddProfessionalScreen';
import InviteProfessionalScreen from './src/screens/Professionals/InviteProfessionalScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import MessagingScreen from './src/screens/Messaging/MessagingScreen';
import MessagingChatScreen from './src/screens/Messaging/MessagingChatScreen';
import AgendaScreen from './src/screens/Agenda/AgendaScreen';
import AgendaDayViewScreen from './src/screens/Agenda/AgendaDayViewScreen';
import AgendaFormScreen from './src/screens/Agenda/AgendaFormScreen';
import CarnetAuditionScreen from './src/screens/Carnet_Audition/CarnetAuditionScreen';
import AppareillageScreen from './src/screens/Appareillage/AppareillageScreen';
import QuestionnaireScreen from './src/screens/Questionnaire/QuestionnaireScreen';
import QuestionnaireDetailScreen from './src/screens/Questionnaire/QuestionnaireDetailScreen';
import { NavigationProvider, useNavigation } from './src/context/NavigationContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthFlow from './src/components/auth/AuthFlow';

/**
 * Contenu principal de l'app (affiché uniquement si authentifié).
 */
function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const { currentScreen } = useNavigation();

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'health' && <HealthScreen />}
      {currentScreen === 'professionals' && <ProfessionalsScreen />}
      {currentScreen === 'professional-profile' && <ProfessionalProfileScreen />}
      {currentScreen === 'add-professional' && <AddProfessionalScreen />}
      {currentScreen === 'invite-professional' && <InviteProfessionalScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}
      {currentScreen === 'my-profile' && <ProfileScreen />}
      {currentScreen === 'messaging' && <MessagingScreen />}
      {currentScreen === 'messaging-chat' && <MessagingChatScreen />}
      {currentScreen === 'agenda' && <AgendaScreen />}
      {currentScreen === 'agenda-day' && <AgendaDayViewScreen />}
      {currentScreen === 'agenda-form' && <AgendaFormScreen />}
      {currentScreen === 'carnet-audition' && <CarnetAuditionScreen />}
      {currentScreen === 'appareillage' && <AppareillageScreen />}
      {currentScreen === 'questionnaire' && <QuestionnaireScreen />}
      {currentScreen === 'questionnaire-detail' && <QuestionnaireDetailScreen />}
    </>
  );
}

/**
 * Routeur principal : affiche le flux d'auth ou l'app selon l'état de connexion.
 */
function AppRouter() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

/**
 * Composant racine — enveloppe l'app avec SafeAreaProvider et AuthProvider.
 */
function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
