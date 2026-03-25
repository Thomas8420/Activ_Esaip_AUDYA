import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../screens/Professionals/ProfessionalsScreen.styles';
import AnimatedDropdown from '../common/AnimatedDropdown/AnimatedDropdown';
import DropdownIcon from '../../assets/images/dropdown.svg';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import { SPECIALTIES } from '../../constants';

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
            <TouchableOpacity style={styles.formBackButton} onPress={onBack}>
              <Text style={styles.formBackButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>

          {/* Titre section */}
          <Text style={styles.formSectionTitle}>Recherche</Text>

          {/* Spécialité (dropdown) */}
          <View style={styles.formDropdownWrapper}>
            <TouchableOpacity
              style={styles.formDropdownButton}
              onPress={() => setSpecialtyOpen(!specialtyOpen)}
            >
              <Text
                style={[
                  styles.formDropdownText,
                  specialty ? styles.formDropdownTextSelected : null,
                ]}
              >
                {specialty || 'Spécialité'}
              </Text>
              <View style={styles.dropdownArrowBg}>
                <DropdownIcon width={10} height={10} fill="white" />
              </View>
            </TouchableOpacity>
            <AnimatedDropdown visible={specialtyOpen}>
              <View style={styles.formDropdownMenu}>
                <TouchableOpacity
                  style={styles.formDropdownItem}
                  onPress={() => { setSpecialty(''); setSpecialtyOpen(false); }}
                >
                  <Text style={styles.formDropdownItemText}>Toutes</Text>
                </TouchableOpacity>
                {SPECIALTIES.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={styles.formDropdownItem}
                    onPress={() => { setSpecialty(s); setSpecialtyOpen(false); }}
                  >
                    <Text style={styles.formDropdownItemText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </AnimatedDropdown>
          </View>

          {/* Nom */}
          <TextInput
            style={styles.formInput}
            placeholder="Nom"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* Prénom */}
          <TextInput
            style={styles.formInput}
            placeholder="Prénom"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* Code postal */}
          <TextInput
            style={styles.formInput}
            placeholder="Code postal"
            placeholderTextColor="#999"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="number-pad"
          />

          {/* Ville */}
          <TextInput
            style={styles.formInput}
            placeholder="Ville"
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
          />

          {/* Bouton Rechercher */}
          <TouchableOpacity style={styles.formSearchButton} onPress={handleSearch}>
            <Text style={styles.formSearchButtonText}>Rechercher</Text>
          </TouchableOpacity>

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
                      <TouchableOpacity style={styles.formSearchResultAddButton}>
                        <Text style={styles.formSearchResultAddButtonText}>Ajouter</Text>
                      </TouchableOpacity>
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
