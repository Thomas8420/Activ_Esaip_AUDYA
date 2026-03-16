import React, {useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import Bubbles from './Bubbles';
import LoginScreen from '../../screens/Auth/LoginScreen';
import VerifyCodeScreen from '../../screens/Auth/VerifyCodeScreen';
import ForgotPasswordScreen from '../../screens/Auth/ForgotPasswordScreen';
import EmailVerificationScreen from '../../screens/Auth/EmailVerificationScreen';
import NewPasswordScreen from '../../screens/Auth/NewPasswordScreen';
import PasswordChangedScreen from '../../screens/Auth/PasswordChangedScreen';

type AuthScreen =
  | 'login'
  | 'verify-code'
  | 'forgot-password'
  | 'email-verification'
  | 'new-password'
  | 'password-changed';

/**
 * Gère la navigation entre les écrans d'authentification.
 * Utilise un état local au lieu de React Navigation (cohérent avec le
 * système de navigation custom du projet).
 */
const AuthFlow: React.FC = () => {
  const [screen, setScreen] = useState<AuthScreen>('login');
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3EF" />

      {/* Bulles décoratives en arrière-plan */}
      <Bubbles />

      {/* ── Écran Login ─────────────────────────────────────────────── */}
      {screen === 'login' && (
        <>
          <LoginScreen
            onForgotPassword={() => setScreen('forgot-password')}
            onRegister={() => {
              // TODO : naviguer vers l'inscription quand elle sera implémentée
            }}
            onVerifyCode={() => setShowVerifyModal(true)}
          />
          <VerifyCodeScreen
            visible={showVerifyModal}
            onClose={() => setShowVerifyModal(false)}
            onSuccess={() => {
              setShowVerifyModal(false);
              // loginSuccess() est appelé dans VerifyCodeScreen
              // AuthContext.isAuthenticated passe à true → App.tsx rend l'app
            }}
          />
        </>
      )}

      {/* ── Mot de passe oublié ──────────────────────────────────────── */}
      {screen === 'forgot-password' && (
        <ForgotPasswordScreen
          onSubmit={() => setScreen('email-verification')}
          onRegister={() => {
            // TODO : naviguer vers l'inscription
          }}
          onBack={() => setScreen('login')}
        />
      )}

      {/* ── Vérification email ───────────────────────────────────────── */}
      {screen === 'email-verification' && (
        <EmailVerificationScreen
          onNewEmail={() => setScreen('new-password')}
        />
      )}

      {/* ── Nouveau mot de passe ─────────────────────────────────────── */}
      {screen === 'new-password' && (
        <NewPasswordScreen onSuccess={() => setScreen('password-changed')} />
      )}

      {/* ── Confirmation mot de passe modifié ───────────────────────── */}
      {screen === 'password-changed' && (
        <PasswordChangedScreen onLogin={() => setScreen('login')} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EF',
  },
});

export default AuthFlow;
