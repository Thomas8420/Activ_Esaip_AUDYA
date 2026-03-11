import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/Home/HomeScreen';
import ProfessionalsScreen from './src/screens/Professionals/ProfessionalsScreen';
import ProfessionalProfileScreen from './src/screens/Professionals/ProfessionalProfileScreen';
import AddProfessionalScreen from './src/screens/Professionals/AddProfessionalScreen';
import InviteProfessionalScreen from './src/screens/Professionals/InviteProfessionalScreen';
import { NavigationProvider, useNavigation } from './src/context/NavigationContext';

/**
 * Composant interne qui gère l'affichage de l'écran actuel
 * Utilise le contexte de navigation pour déterminer quel écran afficher
 */
function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const { currentScreen } = useNavigation();

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'professionals' && <ProfessionalsScreen />}
      {currentScreen === 'professional-profile' && <ProfessionalProfileScreen />}
      {currentScreen === 'add-professional' && <AddProfessionalScreen />}
      {currentScreen === 'invite-professional' && <InviteProfessionalScreen />}
    </>
  );
}

/**
 * Composant principal de l'application
 * Enveloppe l'app avec le NavigationProvider pour permettre la navigation
 */
function App() {
  return (
    <SafeAreaProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </SafeAreaProvider>
  );
}

export default App;
