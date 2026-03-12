import React, { createContext, useState, ReactNode } from 'react';

/**
 * Types d'écran disponibles dans l'application
 */
export type Screen = 'home' | 'professionals' | 'professional-profile' | 'add-professional' | 'invite-professional' | 'settings' | 'my-profile' | 'messaging' | 'messaging-chat';

/**
 * Données transmises à l'écran de conversation
 */
export interface SelectedConversation {
  /** ID de la conversation — null si nouvelle conversation (depuis fiche pro) */
  id: number | null;
  subject: string;
  correspondentId: string;
  correspondentName: string;
  correspondentPhone: string;
  correspondentEmail: string;
  correspondentCity: string;
  correspondentZip: string;
  status: 'pending' | 'blocked' | 'finished';
  isOnline?: boolean;
}

/**
 * Données minimales du professionnel transmises à l'écran de fiche
 */
export interface SelectedProfessional {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  company: string;
  zipCode: string;
  city: string;
}

/**
 * Interface du contexte de navigation
 */
interface NavigationContextType {
  currentScreen: Screen;
  previousScreen: Screen;
  navigateTo: (screen: Screen) => void;
  goHome: () => void;
  goBack: () => void;
  selectedProfessional: SelectedProfessional | null;
  navigateToProfile: (professional: SelectedProfessional) => void;
  navigateToAdd: () => void;
  navigateToInvite: () => void;
  navigateToSettings: () => void;
  navigateToMyProfile: () => void;
  selectedConversation: SelectedConversation | null;
  navigateToMessaging: () => void;
  navigateToMessagingChat: (conversation: SelectedConversation) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * Provider de navigation utilisant une pile d'historique.
 *
 * Pourquoi une pile plutôt que `previousScreen` en state ?
 * `goBack` utilise une mise à jour fonctionnelle (prev => ...) ce qui garantit
 * que React lit toujours la dernière valeur de l'historique, sans problème
 * de closure périmée (stale closure).
 */
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<Screen[]>(['home']);
  const [selectedProfessional, setSelectedProfessional] = useState<SelectedProfessional | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<SelectedConversation | null>(null);

  const currentScreen = history[history.length - 1];
  const previousScreen = history.length > 1 ? history[history.length - 2] : 'home';

  const navigateTo = (screen: Screen) => {
    setHistory(prev => [...prev, screen]);
  };

  const goHome = () => {
    setHistory(['home']);
  };

  /** Dépile le dernier écran — toujours fiable grâce à la mise à jour fonctionnelle */
  const goBack = () => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const navigateToProfile = (professional: SelectedProfessional) => {
    setSelectedProfessional(professional);
    setHistory(prev => [...prev, 'professional-profile']);
  };

  const navigateToAdd = () => {
    setHistory(prev => [...prev, 'add-professional']);
  };

  const navigateToInvite = () => {
    setHistory(prev => [...prev, 'invite-professional']);
  };

  const navigateToSettings = () => {
    setHistory(prev => [...prev, 'settings']);
  };

  const navigateToMyProfile = () => {
    setHistory(prev => [...prev, 'my-profile']);
  };

  const navigateToMessaging = () => {
    setHistory(prev => [...prev, 'messaging']);
  };

  const navigateToMessagingChat = (conversation: SelectedConversation) => {
    setSelectedConversation(conversation);
    setHistory(prev => [...prev, 'messaging-chat']);
  };

  return (
    <NavigationContext.Provider value={{
      currentScreen,
      previousScreen,
      navigateTo,
      goHome,
      goBack,
      selectedProfessional,
      navigateToProfile,
      navigateToAdd,
      navigateToInvite,
      navigateToSettings,
      navigateToMyProfile,
      selectedConversation,
      navigateToMessaging,
      navigateToMessagingChat,
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Hook custom pour utiliser le contexte de navigation
 */
export const useNavigation = () => {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation doit être utilisé à l'intérieur de NavigationProvider");
  }
  return context;
};
