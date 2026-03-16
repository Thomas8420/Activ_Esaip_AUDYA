import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import AgendaFormPage from '../../components/Agenda/AgendaFormPage';

/** Écran Formulaire RDV — conteneur mince. */
const AgendaFormScreen = () => {
  const { selectedAgendaEvent } = useNavigation();
  return <AgendaFormPage event={selectedAgendaEvent} />;
};

export default AgendaFormScreen;
