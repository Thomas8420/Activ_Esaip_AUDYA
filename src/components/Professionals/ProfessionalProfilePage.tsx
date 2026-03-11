import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../screens/Professionals/ProfessionalsScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import { SelectedProfessional } from '../../context/NavigationContext';

interface ProfileField {
  label: string;
  value: string;
  isFirst?: boolean;
}

interface ProfessionalProfilePageProps {
  professional: SelectedProfessional;
  onBack: () => void;
}

/**
 * Composant affichant la fiche détaillée d'un professionnel.
 * Design : avatar teal, champs IDENTITÉ / ADRESSE / EMAIL / TÉLÉPHONE avec séparateurs.
 */
const ProfessionalProfilePage: React.FC<ProfessionalProfilePageProps> = ({
  professional,
  onBack,
}) => {
  const address = [professional.zipCode, professional.city].filter(Boolean).join(' ');

  const fields: ProfileField[] = [
    {
      label: 'IDENTITÉ :',
      value: `${professional.firstName} ${professional.lastName}`,
      isFirst: true,
    },
    { label: 'ADRESSE :', value: address },
    { label: 'EMAIL :', value: professional.email },
    { label: 'TÉLÉPHONE FIXE :', value: '' },
    { label: 'TÉLÉPHONE PORTABLE :', value: professional.phone },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />
      <ScrollView
        contentContainerStyle={styles.profileScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          {/* En-tête : titre + bouton Retour */}
          <View style={styles.profileCardHeader}>
            <Text style={styles.profileCardTitle}>MON PROFESSIONNEL</Text>
            <TouchableOpacity style={styles.profileBackButton} onPress={onBack}>
              <Text style={styles.profileBackButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.profileAvatar} />

          {/* Champs */}
          {fields.map((field, index) => (
            <View key={index} style={styles.profileField}>
              <Text style={styles.profileFieldLabel}>
                {field.label}{' '}
                <Text style={styles.profileFieldValue}>{field.value}</Text>
              </Text>
              <View
                style={
                  field.isFirst
                    ? styles.profileFieldSeparatorFirst
                    : styles.profileFieldSeparator
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

export default ProfessionalProfilePage;
