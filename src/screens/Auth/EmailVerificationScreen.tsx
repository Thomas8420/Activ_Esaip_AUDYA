import React from 'react';
import {View, Text} from 'react-native';
import AuthContainer from '../../components/auth/AuthContainer';
import AuthButton from '../../components/auth/Button';
import {emailVerificationScreenStyles as styles} from './EmailVerificationScreen.styles';

type Props = {
  onNewEmail: () => void;
};

/**
 * Écran affiché après la demande de réinitialisation de mot de passe.
 * Informe l'utilisateur qu'un email lui a été envoyé.
 */
const EmailVerificationScreen: React.FC<Props> = ({onNewEmail}) => {
  return (
    <AuthContainer>
      <View style={styles.card}>
        {/* Icône "@" via code ASCII pour éviter les problèmes d'encodage */}
        <Text style={styles.atIcon}>{String.fromCodePoint(64)}</Text>

        <Text style={styles.title}>E-mail de vérification</Text>

        <Text style={styles.description}>
          Vous allez recevoir un e-mail de vérification afin de redéfinir
          votre mot de passe. Si vous n'avez pas reçu votre e-mail, merci de
          vérifier dans vos spams.
        </Text>

        <AuthButton
          title="Recevoir un nouvel email"
          onPress={onNewEmail}
          variant="newEmail"
          style={styles.button}
        />
      </View>
    </AuthContainer>
  );
};

export default EmailVerificationScreen;
