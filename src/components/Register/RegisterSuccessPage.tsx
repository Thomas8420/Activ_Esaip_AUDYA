import React from 'react';
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

/**
 * Écran de félicitations après l'inscription complète
 */
const RegisterSuccessPage = () => {
  const { goHome } = useNavigation();
  const { registerData } = useRegister();

  const nomComplet = registerData.nom && registerData.prenom
    ? `${registerData.prenom} ${registerData.nom.toUpperCase()}`
    : 'Patient AUDYA';

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <Bubbles />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Logo en haut comme les autres pages */}
        <LogoAudya width={152} height={81} style={s.logo} />

        {/* Carte large */}
        <View style={s.cardSuccess}>

          <Text style={s.successTitle}>Félicitations{'\n'}{nomComplet}</Text>

          <Text style={s.successDescription}>
            Votre compte patient est créé, vous pouvez désormais accéder à votre tableau de bord en cliquant sur le lien ci-dessous.
          </Text>

          <Pressable
            style={({ pressed }) => [s.btnPrimarySmall, pressed && s.btnPrimarySmallPressed]}
            onPress={goHome}
          >
            {({ pressed }) => (
              <Text style={[s.btnPrimaryText, pressed && s.btnPrimaryTextPressed]}>Accéder à Audya</Text>
            )}
          </Pressable>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterSuccessPage;