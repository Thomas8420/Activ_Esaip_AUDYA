import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropdownIcon from '../../assets/images/dropdown.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../screens/Professionals/ProfessionalsScreen.styles';
import SelectModal from '../common/SelectModal/SelectModal';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import CTA1 from '../common/Button/CTA1';
import { SPECIALTIES } from '../../constants';
import { sanitizeName, sanitizeZipCode } from '../../utils/validators';
import { addProfessional } from '../../services/professionalsService';

interface SearchResult {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
}

interface AddProfessionalPageProps {
  onBack: () => void;
  onInvite: () => void;
}

/**
 * Écran de recherche pour ajouter un professionnel existant sur Audya.
 * Permet aussi d'accéder au formulaire d'invitation si le professionnel n'est pas trouvé.
 */
const AddProfessionalPage: React.FC<AddProfessionalPageProps> = ({
  onBack,
  onInvite,
}) => {
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  /**
   * Confirmation explicite avant le partage du dossier médical avec un pro
   * existant. RGPD Art. 9(2)(a) — consentement spécifique requis pour les
   * données de santé. Sans cette étape, sélectionner un pro depuis les
   * résultats déclencherait silencieusement un partage complet.
   */
  const handleAddWithConsent = (result: SearchResult) => {
    Alert.alert(
      'Partage de votre dossier médical',
      `Vous vous apprêtez à partager votre dossier (antécédents, traitements, allergies, audiométries) avec ${result.firstName} ${result.lastName}. Confirmez-vous ce partage ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'default',
          onPress: async () => {
            try {
              await addProfessional(result.id);
              Alert.alert('Professionnel ajouté', `${result.firstName} ${result.lastName} a été ajouté à votre équipe de soins.`);
              onBack();
            } catch {
              Alert.alert('Erreur', "L'ajout a échoué. Veuillez réessayer.");
            }
          },
        },
      ],
    );
  };

  const handleSearch = () => {
    // TODO: Appel API GET /api/professionals/search?specialty=...&last_name=...
    // Données mock en attendant l'endpoint
    setSearchResults([]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />
      <ScrollView
        contentContainerStyle={styles.formScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          {/* En-tête */}
          <View style={styles.formCardHeader}>
            <Text style={styles.formCardTitle}>
              AJOUTER UN PROFESSIONNEL{'\n'}DE SANTÉ
            </Text>
            <CTA1
              label="Retour"
              onPress={onBack}
              style={{ paddingVertical: 8, paddingHorizontal: 16, minWidth: 0 }}
              textStyle={{ fontSize: 13 }}
            />
          </View>

          {/* Titre section */}
          <Text style={styles.formSectionTitle}>Recherche</Text>

          {/* Spécialité (dropdown) */}
          <TouchableOpacity
            style={styles.formDropdownButton}
            onPress={() => setSpecialtyOpen(true)}
          >
            <Text style={[styles.formDropdownText, specialty ? styles.formDropdownTextSelected : null]}>
              {specialty || 'Spécialité'}
            </Text>
            <View style={styles.dropdownArrowBg}>
              <DropdownIcon width={10} height={10} fill="white" />
            </View>
          </TouchableOpacity>
          <SelectModal
            visible={specialtyOpen}
            onClose={() => setSpecialtyOpen(false)}
            title="Spécialité"
            options={['Toutes', ...SPECIALTIES]}
            value={specialty || 'Toutes'}
            onSelect={v => setSpecialty(v === 'Toutes' ? '' : v)}
          />

          {/* Nom */}
          <TextInput
            style={styles.formInput}
            placeholder="Nom"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={v => setLastName(sanitizeName(v))}
            maxLength={100}
          />

          {/* Prénom */}
          <TextInput
            style={styles.formInput}
            placeholder="Prénom"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={v => setFirstName(sanitizeName(v))}
            maxLength={100}
          />

          {/* Code postal */}
          <TextInput
            style={styles.formInput}
            placeholder="Code postal"
            placeholderTextColor="#999"
            value={zipCode}
            onChangeText={v => setZipCode(sanitizeZipCode(v))}
            keyboardType="number-pad"
            maxLength={10}
          />

          {/* Ville */}
          <TextInput
            style={styles.formInput}
            placeholder="Ville"
            placeholderTextColor="#999"
            value={city}
            onChangeText={v => setCity(sanitizeName(v))}
            maxLength={100}
          />

          {/* Bouton Rechercher */}
          <CTA1
            label="Rechercher"
            onPress={handleSearch}
            style={{ paddingVertical: 14, marginTop: 4, marginBottom: 20, minWidth: 0 }}
            textStyle={{ fontSize: 14 }}
          />

          {/* Résultats de recherche */}
          {searchResults !== null && (
            <View style={styles.formSearchResults}>
              {searchResults.length > 0 ? (
                <>
                  <Text style={styles.formSearchResultTitle}>
                    {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                  </Text>
                  {searchResults.map(result => (
                    <View key={result.id} style={styles.formSearchResultItem}>
                      <View style={styles.formSearchResultInfo}>
                        <Text style={styles.formSearchResultName}>
                          {result.firstName} {result.lastName}
                        </Text>
                        <Text style={styles.formSearchResultSpecialty}>
                          {result.specialty}
                        </Text>
                      </View>
                      <CTA1
                        label="Ajouter"
                        onPress={() => handleAddWithConsent(result)}
                        style={{ paddingVertical: 6, paddingHorizontal: 14, borderRadius: 14, minWidth: 0 }}
                        textStyle={{ fontSize: 12 }}
                      />
                    </View>
                  ))}
                </>
              ) : (
                <Text style={[styles.formSectionTitle, { fontSize: 13, color: '#999', marginBottom: 0 }]}>
                  Aucun résultat trouvé
                </Text>
              )}
            </View>
          )}

          {/* Séparateur */}
          <View style={{ height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 }} />

          {/* Bouton inviter */}
          <TouchableOpacity style={styles.formInviteButton} onPress={onInvite}>
            <Text style={styles.formInviteButtonText}>
              Inviter un professionnel à rejoindre Audya
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

export default AddProfessionalPage;
