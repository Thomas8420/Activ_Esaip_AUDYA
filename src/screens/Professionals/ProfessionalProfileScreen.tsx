import React from 'react';
import ProfessionalProfilePage from '../../components/Professionals/ProfessionalProfilePage';
import { useNavigation } from '../../context/NavigationContext';

/**
 * Écran de fiche d'un professionnel.
 * Récupère le professionnel sélectionné depuis le contexte de navigation.
 */
const ProfessionalProfileScreen = () => {
  const { selectedProfessional, goBack } = useNavigation();

  if (!selectedProfessional) {
    return null;
  }

  return (
    <ProfessionalProfilePage
      professional={selectedProfessional}
      onBack={goBack}
    />
  );
};

export default ProfessionalProfileScreen;
