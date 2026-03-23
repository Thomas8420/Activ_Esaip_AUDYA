import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoAudya from '../../assets/images/logo-audya.svg';
import { registerStyles as s, COLORS } from '../../screens/Register/Register.styles';
import { useNavigation } from '../../context/NavigationContext';
import { useRegister } from '../../context/RegisterContext';
import Bubbles from '../../components/Bubbles';
import { maskEmail } from '../../utils/validators';
import { resendVerificationEmail } from '../../services/registerService';

/**
 * Étape 1 bis : E-mail de vérification
 * Attend que l'utilisateur clique sur le lien reçu par email avant de progresser.
 * "Renvoyer l'email" appelle uniquement l'API — ne navigue plus automatiquement.
 * "J'ai vérifié mon email" est le seul chemin vers l'étape suivante.
 */
const RegisterStep1BisPage = () => {
  const { navigateTo } = useNavigation();
  const { registerData } = useRegister();
  const [resendFeedback, setResendFeedback] = useState('');

  const handleResend = async () => {
    setResendFeedback('');
    try {
      await resendVerificationEmail(registerData.email);
      setResendFeedback('Email renvoyé ! Pensez à vérifier vos spams.');
    } catch {
      setResendFeedback('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleContinue = () => {
    navigateTo('register-step2');
  };

  const maskedEmail = maskEmail(registerData.email);

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <Bubbles />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <LogoAudya width={152} height={81} style={s.logo} />

        {/* Carte */}
        <View style={s.card}>

          {/* Icône @ */}
          <View style={s.atContainer}>
            <Text style={s.atIcon}>@</Text>
          </View>

          <Text style={s.cardTitle}>E-mail de vérification</Text>

          <Text style={s.emailDescription}>
            Un e-mail de vérification a été envoyé
            {maskedEmail ? ` à ${maskedEmail}` : ''}.
            {'\n'}Cliquez sur le lien dans cet e-mail pour confirmer votre adresse, puis appuyez sur le bouton ci-dessous.
            {'\n\n'}Si vous n'avez pas reçu l'e-mail, vérifiez vos spams.
          </Text>

          {resendFeedback ? (
            <Text style={[s.errorText, { color: resendFeedback.startsWith('Email') ? COLORS.orange : '#E53935', textAlign: 'center', marginBottom: 8 }]}>
              {resendFeedback}
            </Text>
          ) : null}

          {/* Bouton renvoyer — uniquement API, sans navigation */}
          <Pressable
            style={({ pressed }) => [s.btnOutline, pressed && s.btnOutlinePressed]}
            onPress={handleResend}
          >
            {({ pressed }) => (
              <Text style={[s.btnOutlineText, pressed && s.btnOutlineTextPressed]}>Renvoyer l'email</Text>
            )}
          </Pressable>

          {/* Bouton continuer — seul chemin vers l'étape 2 */}
          <Pressable
            style={({ pressed }) => [s.btnPrimarySmall, pressed && s.btnPrimarySmallPressed, { marginTop: 12 }]}
            onPress={handleContinue}
          >
            {({ pressed }) => (
              <Text style={[s.btnPrimaryText, pressed && s.btnPrimaryTextPressed]}>J'ai vérifié mon email</Text>
            )}
          </Pressable>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterStep1BisPage;

