import React from 'react';
import HealthIcon from '../assets/images/patient.svg';
import HearingIcon from '../assets/images/son-doreille.svg';
import NotebookIcon from '../assets/images/dossier-patient.svg';
import ProfessionalsIcon from '../assets/images/medecin-de-lutilisateur.svg';
import AgendaIcon from '../assets/images/calendrier.svg';
import MessageIcon from '../assets/images/discussion-sur-les-bulles.svg';
import QuestionnaireIcon from '../assets/images/barre-de-satisfaction.svg';
import NewsIcon from '../assets/images/journal.svg';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ width?: number; height?: number; fill?: string }>;
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'health',         label: 'Ma santé',              icon: HealthIcon },
  { id: 'hearing',        label: 'Mon appareillage',       icon: HearingIcon },
  { id: 'notebook',       label: 'Mon carnet audition',    icon: NotebookIcon },
  { id: 'professionals',  label: 'Mes professionnels',     icon: ProfessionalsIcon },
  { id: 'agenda',         label: 'Mon agenda',             icon: AgendaIcon },
  { id: 'message',        label: 'Ma messagerie',          icon: MessageIcon },
  { id: 'questionnaire',  label: 'Mes questionnaires',     icon: QuestionnaireIcon },
  { id: 'news',           label: 'Mes actualités',         icon: NewsIcon },
];

export const SPECIALTIES: string[] = [
  'Audioprothésiste',
  'ORL',
  'Cardiologie',
  'Généraliste',
  'Dentiste',
  'Ophtalmo',
];
