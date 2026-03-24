import React, {useState, useEffect} from 'react';
import {View, StyleSheet, StatusBar, Linking} from 'react-native';
import Bubbles from './Bubbles';
import LoginScreen from '../../screens/Auth/LoginScreen';
import VerifyCodeScreen from '../../screens/Auth/VerifyCodeScreen';
import ForgotPasswordScreen from '../../screens/Auth/ForgotPasswordScreen';
import EmailVerificationScreen from '../../screens/Auth/EmailVerificationScreen';
import NewPasswordScreen from '../../screens/Auth/NewPasswordScreen';
import PasswordChangedScreen from '../../screens/Auth/PasswordChangedScreen';
import RegisterFlow from '../Register/RegisterFlow';

type AuthScreen =
  | 'login'
  | 'verify-code'
  | 'forgot-password'
  | 'email-verification'
  | 'new-password'
  | 'password-changed'
  | 'register';

/**
 * Gère la navigation entre les écrans d'authentification.
 * Utilise un état local au lieu de React Navigation (cohérent avec le
 * système de navigation custom du projet).
 */
/** Extrait le token de réinitialisation depuis une URL deep link. */
function parseResetToken(url: string | null): string {
  if (!url) return '';
  try {
    const match = /[?&]token=([^&]+)/.exec(url);
    return match ? decodeURIComponent(match[1]) : '';
  } catch {
    return '';
  }
}

const AuthFlow: React.FC = () => {
  const [screen, setScreen] = useState<AuthScreen>('login');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // Capture le token de réinitialisation depuis le deep link (audya://reset-password?token=xxx)
  useEffect(() => {
    Linking.getInitialURL().then(url => {
      const token = parseResetToken(url);
      if (token) {
        setResetToken(token);
        setScreen('new-password');
      }
    });

    const subscription = Linking.addEventListener('url', ({url}) => {
      const token = parseResetToken(url);
      if (token) {
        setResetToken(token);
        setScreen('new-password');
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3EF" />

      {/* ── Flux d'inscription ───────────────────────────────────────── */}
      {screen === 'register' && (
        <RegisterFlow onComplete={() => setScreen('login')} />
      )}

      {/* Bulles décoratives en arrière-plan (hors flux inscription) */}
      {screen !== 'register' && <Bubbles />}

      {/* ── Écran Login ─────────────────────────────────────────────── */}
      {screen === 'login' && (
        <>
          <LoginScreen
            onForgotPassword={() => setScreen('forgot-password')}
            onRegister={() => setScreen('register')}
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
          onRegister={() => setScreen('register')}
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
        <NewPasswordScreen
          token={resetToken}
          onSuccess={() => setScreen('password-changed')}
        />
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
