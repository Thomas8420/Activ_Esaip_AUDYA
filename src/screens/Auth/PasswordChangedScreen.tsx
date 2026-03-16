import React from 'react';
import {View, Text} from 'react-native';
import AuthContainer from '../../components/auth/AuthContainer';
import AuthButton from '../../components/auth/Button';
import {passwordChangedScreenStyles as styles} from './PasswordChangedScreen.styles';

type Props = {
  onLogin: () => void;
};

/**
 * Écran de confirmation après la réinitialisation du mot de passe.
 */
const PasswordChangedScreen: React.FC<Props> = ({onLogin}) => {
  return (
    <AuthContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Mot de passe modifié</Text>
        <Text style={styles.description}>
          Nous avons enregistré votre nouveau mot de passe, vous pouvez
          désormais vous connecter à votre compte à l'aide de celui-ci.
        </Text>
        <AuthButton
          title="Se connecter"
          onPress={onLogin}
          variant="primary"
          style={styles.loginButton}
        />
      </View>
    </AuthContainer>
  );
};

export default PasswordChangedScreen;
