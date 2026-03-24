import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthContainer from '../../components/auth/AuthContainer';
import AuthButton from '../../components/auth/Button';
import {loginScreenStyles as styles} from './LoginScreen.styles';
import {isValidEmail, ERROR_MESSAGES} from '../../utils/validators';
import {useAuth} from '../../context/AuthContext';
import {ApiError} from '../../services/api';
import {DEV_SKIP_2FA} from '../../services/authService';

type Props = {
  onForgotPassword: () => void;
  onRegister: () => void;
  onVerifyCode: () => void;
};

const inputColors = (hasError: boolean) => ({
  backgroundColor: hasError ? '#FADBD8' : '#EFF6FF',
  borderColor: hasError ? '#E74C3C' : '#D1D5DB',
});

/**
 * Écran de connexion.
 * Étape 1 : email + mot de passe → déclenche l'envoi du code 2FA.
 * Étape 2 : renvoie vers l'écran VerifyCode via `onVerifyCode`.
 */
const LoginScreen: React.FC<Props> = ({onForgotPassword, onRegister, onVerifyCode}) => {
  const {loginFirstFactor} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setServerError('');

    let hasError = false;

    if (!email.trim()) {
      setEmailError(ERROR_MESSAGES.EMAIL_REQUIRED);
      hasError = true;
    } else if (!isValidEmail(email.trim())) {
      setEmailError(ERROR_MESSAGES.EMAIL_INVALID);
      hasError = true;
    }

    if (!password) {
      setPasswordError(ERROR_MESSAGES.PASSWORD_REQUIRED);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      await loginFirstFactor(email.trim(), password);
      // DEV_SKIP_2FA = true → déjà authentifié dans AuthContext, pas besoin de modale
      if (!DEV_SKIP_2FA) {
        onVerifyCode();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <View style={styles.card}>
        <Text style={styles.title}>S'identifier</Text>

        <View style={styles.formSection}>
          {/* Champ Email */}
          <View style={styles.fieldSpacingLg}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={[styles.inputBase, inputColors(!!emailError)]}
              placeholder="contact@gmail.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={t => {
                setEmail(t);
                setEmailError('');
                setServerError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          {/* Champ Mot de passe */}
          <View style={styles.fieldSpacingMd}>
            <Text style={styles.fieldLabel}>Mot de passe</Text>
            <View style={[styles.passwordRow, inputColors(!!passwordError)]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="********"
                placeholderTextColor="#999"
                value={password}
                onChangeText={t => {
                  setPassword(t);
                  setPasswordError('');
                  setServerError('');
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(v => !v)}
                style={styles.eyeButton}
                accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                accessibilityRole="button"
              >
                <Icon
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Erreur serveur */}
          {serverError ? (
            <Text style={styles.serverErrorText}>
              {serverError}
            </Text>
          ) : null}

          {/* Mot de passe oublié */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={onForgotPassword}
            accessibilityLabel="Mot de passe oublié"
            accessibilityRole="button"
          >
            <Text style={styles.forgotPasswordText}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>
        </View>

        <AuthButton
          title={loading ? 'Connexion...' : 'Se connecter'}
          onPress={handleLogin}
          variant="primary"
          loading={loading}
        />

        <View style={styles.divider} />

        <Text style={styles.title}>Créer un compte</Text>

        <AuthButton
          title="S'inscrire"
          onPress={onRegister}
          variant="register"
        />
      </View>
    </AuthContainer>
  );
};

export default LoginScreen;
