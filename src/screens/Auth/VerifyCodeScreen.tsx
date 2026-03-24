import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import AuthInput from '../../components/auth/Input';
import AuthButton from '../../components/auth/Button';
import {verifyCodeScreenStyles as styles} from './VerifyCodeScreen.styles';
import {useAuth} from '../../context/AuthContext';
import {loginStep2, resend2FACode} from '../../services/authService';
import {ApiError} from '../../services/api';
import {maskEmail} from '../../utils/validators';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

/**
 * Modale de vérification du code 2FA à 6 chiffres reçu par email.
 * Accessible depuis LoginScreen après soumission du formulaire.
 */
const VerifyCodeScreen: React.FC<Props> = ({visible, onClose, onSuccess}) => {
  const {pendingEmail, loginSuccess} = useAuth();

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-masque le message de succès avec cleanup (évite la fuite mémoire si composant démonté)
  useEffect(() => {
    if (!resendSuccess) {return;}
    const id = setTimeout(() => setResendSuccess(false), 3000);
    return () => clearTimeout(id);
  }, [resendSuccess]);

  const validateCode = (): boolean => {
    if (!code.trim()) {
      setCodeError('Veuillez entrer le code reçu par email.');
      return false;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setCodeError('Le code doit contenir 6 chiffres.');
      return false;
    }
    setCodeError('');
    return true;
  };

  const handleVerify = async () => {
    if (!validateCode()) return;
    setLoading(true);
    try {
      await loginStep2(code.trim());
      loginSuccess();
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setCodeError(err.message);
      } else {
        setCodeError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendSuccess(false);
    try {
      await resend2FACode();
      setResendSuccess(true);
    } catch {
      // Silencieux — l'utilisateur peut réessayer
    }
  };

  const handleClose = () => {
    setCode('');
    setCodeError('');
    setResendSuccess(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.modalContainer}>
                <Text style={styles.title}>Code de connexion</Text>
                <Text style={styles.description}>
                  Un email contenant votre code de connexion a été envoyé
                  {pendingEmail ? ` à ${maskEmail(pendingEmail)}` : ''}.{'\n'}
                  Si vous ne l'avez pas reçu, vérifiez vos spams.
                </Text>
                <Text style={styles.label}>
                  Veuillez entrer ci-dessous le code de connexion reçu :
                </Text>

                <AuthInput
                  placeholder="Ex : 123456"
                  value={code}
                  onChangeText={text => {
                    setCode(text.replaceAll(/\D/g, '').slice(0, 6));
                    if (codeError) setCodeError('');
                  }}
                  keyboardType="numeric"
                  error={codeError}
                  maxLength={6}
                />

                {resendSuccess ? (
                  <Text style={styles.successText}>
                    Code renvoyé avec succès !
                  </Text>
                ) : null}

                <View style={styles.buttonsRow}>
                  <AuthButton
                    title="Renvoyer le code"
                    onPress={handleResend}
                    variant="resend"
                  />
                  <AuthButton
                    title="Vérifier"
                    onPress={handleVerify}
                    variant="verify"
                    loading={loading}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default VerifyCodeScreen;
