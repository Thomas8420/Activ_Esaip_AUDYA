import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import AgendaDayViewPage from '../../components/Agenda/AgendaDayViewPage';

/** Écran Vue Jour — conteneur mince. */
const AgendaDayViewScreen = () => {
  const { selectedAgendaDate } = useNavigation();
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return <AgendaDayViewPage date={selectedAgendaDate ?? todayISO} />;
};

export default AgendaDayViewScreen;
