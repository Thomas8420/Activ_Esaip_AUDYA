import React, { useEffect } from 'react';
import { NavigationProvider, useNavigation } from '../../context/NavigationContext';
import { RegisterProvider } from '../../context/RegisterContext';
import RegisterStep1Screen from '../../screens/Register/RegisterStep1Screen';
import RegisterStep1BisScreen from '../../screens/Register/RegisterStep1BisScreen';
import RegisterStep2Screen from '../../screens/Register/RegisterStep2Screen';
import RegisterStep3Screen from '../../screens/Register/RegisterStep3Screen';
import RegisterStep4Screen from '../../screens/Register/RegisterStep4Screen';
import RegisterStep5Screen from '../../screens/Register/RegisterStep5Screen';
import RegisterSuccessScreen from '../../screens/Register/RegisterSuccessScreen';

interface Props {
  readonly onComplete: () => void;
}

/**
 * Routeur interne du flux d'inscription.
 * Détecte le retour à 'home' (déclenché par RegisterSuccessPage.goHome)
 * pour signaler la fin de l'inscription à AuthFlow.
 */
function RegisterScreenRouter({ onComplete }: Props) {
  const { currentScreen } = useNavigation();

  useEffect(() => {
    if (currentScreen === 'home') {
      onComplete();
    }
  }, [currentScreen, onComplete]);

  return (
    <>
      {currentScreen === 'register-step1' && <RegisterStep1Screen />}
      {currentScreen === 'register-step1bis' && <RegisterStep1BisScreen />}
      {currentScreen === 'register-step2' && <RegisterStep2Screen />}
      {currentScreen === 'register-step3' && <RegisterStep3Screen />}
      {currentScreen === 'register-step4' && <RegisterStep4Screen />}
      {currentScreen === 'register-step5' && <RegisterStep5Screen />}
      {currentScreen === 'register-success' && <RegisterSuccessScreen />}
    </>
  );
}

/**
 * RegisterFlow — wraps le flux d'inscription avec NavigationProvider
 * (initialisé à register-step1) et RegisterProvider.
 * Appelle onComplete() quand l'utilisateur termine l'inscription.
 */
export default function RegisterFlow({ onComplete }: Props) {
  return (
    <NavigationProvider initialScreen="register-step1">
      <RegisterProvider>
        <RegisterScreenRouter onComplete={onComplete} />
      </RegisterProvider>
    </NavigationProvider>
  );
}
