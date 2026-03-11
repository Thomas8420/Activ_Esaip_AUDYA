import React from 'react';
import ProfessionalsPage from '../../components/Professionals/ProfessionalsPage';

/**
 * Le composant "ProfessionalsScreen" est le point d'entrée de l'écran des professionnels.
 * Son seul rôle est d'afficher le composant "ProfessionalsPage", qui contient toute la logique d'affichage.
 * Cette structure permet de séparer le "conteneur" (l'écran) du "contenu" (la page).
 */
const ProfessionalsScreen = () => {
  return <ProfessionalsPage />;
};

export default ProfessionalsScreen;
