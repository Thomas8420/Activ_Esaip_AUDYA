import React from 'react';
import {View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import LogoAudya from '../../assets/images/logo-audya.svg';
import {authContainerStyles as styles} from './styles/AuthContainerStyles';

type Props = {
  children: React.ReactNode;
};

/**
 * Conteneur partagé par tous les écrans d'authentification.
 * Gère le clavier, le scroll et affiche le logo en haut.
 */
const AuthContainer: React.FC<Props> = ({children}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <LogoAudya width={200} height={80} />
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthContainer;
