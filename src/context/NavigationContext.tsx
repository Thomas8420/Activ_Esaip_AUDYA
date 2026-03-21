import React, { createContext, useState, useMemo, ReactNode } from 'react';

/**
 * Types d'écran disponibles dans l'application
 */
export type Screen = 'home' | 'health' | 'professionals' | 'professional-profile' | 'add-professional' | 'invite-professional' | 'settings' | 'my-profile' | 'messaging' | 'messaging-chat' | 'agenda' | 'agenda-day' | 'agenda-form';

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
 * Event agenda transmis au formulaire (id=null → création, id≠null → édition)
 */
export interface SelectedAgendaEvent {
  id: number | null;
  title: string;
  type: string;
  /** "YYYY-MM-DD HH:mm" */
  start: string;
  /** "YYYY-MM-DD HH:mm" */
  end: string;
  location: string;
  notes: string;
  professionalName: string;
  backgroundColor: string;
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
  selectedAgendaEvent: SelectedAgendaEvent | null;
  selectedAgendaDate: string | null;
  navigateToAgenda: () => void;
  navigateToAgendaDay: (date: string) => void;
  navigateToAgendaForm: (event?: SelectedAgendaEvent | null) => void;
  navigateToHealth: () => void;
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
  const [selectedAgendaEvent, setSelectedAgendaEvent] = useState<SelectedAgendaEvent | null>(null);
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<string | null>(null);

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

  const navigateToAgenda = () => {
    setHistory(prev => [...prev, 'agenda']);
  };

  const navigateToAgendaDay = (date: string) => {
    setSelectedAgendaDate(date);
    setHistory(prev => [...prev, 'agenda-day']);
  };

  const navigateToAgendaForm = (event?: SelectedAgendaEvent | null) => {
    setSelectedAgendaEvent(event ?? null);
    setHistory(prev => [...prev, 'agenda-form']);
  };

  const navigateToHealth = () => {
    setHistory(prev => [...prev, 'health']);
  };

  const value = useMemo(() => ({
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
    selectedAgendaEvent,
    selectedAgendaDate,
    navigateToAgenda,
    navigateToAgendaDay,
    navigateToAgendaForm,
    navigateToHealth,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [currentScreen, previousScreen, selectedProfessional, selectedConversation, selectedAgendaEvent, selectedAgendaDate]);

  return (
    <NavigationContext.Provider value={value}>
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
