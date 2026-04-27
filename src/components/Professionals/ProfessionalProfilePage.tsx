import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import CTA1 from '../common/Button/CTA1';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../screens/Professionals/ProfessionalsScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import { SelectedConversation, SelectedProfessional, useNavigation } from '../../context/NavigationContext';

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
  const { navigateToMessagingChat } = useNavigation();
  const address = [professional.zipCode, professional.city].filter(Boolean).join(' ');

  const handleSendMessage = () => {
    const conversation: SelectedConversation = {
      id: null,
      subject: `Message à ${professional.firstName} ${professional.lastName}`,
      correspondentId: professional.id,
      correspondentName: `${professional.firstName} ${professional.lastName}`,
      correspondentPhone: professional.phone,
      correspondentEmail: professional.email,
      correspondentCity: professional.city,
      correspondentZip: professional.zipCode,
      status: 'pending',
    };
    navigateToMessagingChat(conversation);
  };

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
            <CTA1
              label="Retour"
              onPress={onBack}
              style={{ paddingVertical: 8, paddingHorizontal: 20, minWidth: 0 }}
              textStyle={{ fontSize: 14 }}
            />
          </View>

          {/* Avatar */}
          <View style={styles.profileAvatar} />

          {/* Champs */}
          {fields.map(field => (
            <View key={field.label} style={styles.profileField}>
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

          {/* Bouton messagerie */}
          <CTA1
            label="Envoyer un message"
            onPress={handleSendMessage}
            style={{ paddingVertical: 12, paddingHorizontal: 24, marginTop: 24, minWidth: 0 }}
            textStyle={{ fontSize: 15 }}
          />
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

export default ProfessionalProfilePage;
