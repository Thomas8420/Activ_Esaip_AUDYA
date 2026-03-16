import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AuthContainer from '../../components/auth/AuthContainer';
import AuthInput from '../../components/auth/Input';
import AuthButton from '../../components/auth/Button';
import {forgotPasswordScreenStyles as styles} from './ForgotPasswordScreen.styles';
import {isValidEmail, ERROR_MESSAGES} from '../../utils/validators';
import {forgotPassword} from '../../services/authService';
import {ApiError} from '../../services/api';

type Props = {
  onSubmit: () => void;
  onRegister: () => void;
  onBack: () => void;
};

/**
 * Écran "Mot de passe perdu ?".
 * Saisie de l'email → appel API → redirection vers EmailVerification.
 */
const ForgotPasswordScreen: React.FC<Props> = ({onSubmit, onRegister}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setEmailError(ERROR_MESSAGES.EMAIL_REQUIRED);
      return false;
    }
    if (!isValidEmail(email.trim())) {
      setEmailError(ERROR_MESSAGES.EMAIL_INVALID);
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setServerError('');
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      onSubmit();
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
        <Text style={styles.title}>Mot de passe perdu ?</Text>
        <Text style={styles.subtitle}>Redéfinir le mot de passe</Text>
        <Text style={styles.description}>
          Veuillez saisir votre adresse email ci-dessous, un lien va être
          envoyé afin de réinitialiser votre mot de passe.
        </Text>

        <AuthInput
          placeholder="contact@gmail.com"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (emailError) setEmailError('');
            if (serverError) setServerError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
        />

        {serverError ? (
          <Text style={styles.serverError}>{serverError}</Text>
        ) : null}

        <AuthButton
          title="Valider"
          onPress={handleSubmit}
          variant="primary"
          loading={loading}
          style={styles.submitButton}
        />

        <View style={styles.divider} />

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>
            Vous n'avez pas encore de compte,{' '}
          </Text>
          <TouchableOpacity onPress={onRegister} activeOpacity={0.7}>
            <Text style={styles.registerLink}>cliquez-ici</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthContainer>
  );
};

export default ForgotPasswordScreen;
