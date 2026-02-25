import React from 'react';
import MainPage from '../../components/MainPage/MainPage';

/**
 * Le composant "HomeScreen" est le point d'entrée de l'écran d'accueil.
 * Son seul rôle est d'afficher le composant "MainPage", qui contient toute la logique d'affichage.
 * Cette structure permet de séparer le "conteneur" (l'écran) du "contenu" (la page).
 */
const HomeScreen = () => {
  return <MainPage />;
};

export default HomeScreen;
