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
import Icon from 'react-native-vector-icons/Ionicons';
import { styles, COLORS } from '../../screens/Professionals/ProfessionalsScreen.styles';
import AnimatedDropdown from '../common/AnimatedDropdown/AnimatedDropdown';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import { SPECIALTIES } from '../../constants';

const COUNTRIES = ['France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada'];

interface InviteProfessionalPageProps {
  onBack: () => void;
}

/**
 * Formulaire d'invitation d'un nouveau professionnel de santé.
 * Envoie une invitation par e-mail au professionnel saisi.
 */
const InviteProfessionalPage: React.FC<InviteProfessionalPageProps> = ({ onBack }) => {
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const [specialty, setSpecialty] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [address, setAddress] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('France');
  const [email, setEmail] = useState('');
  const [proPhone, setProPhone] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [note, setNote] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  const isFormValid =
    specialty.trim() !== '' &&
    lastName.trim() !== '' &&
    firstName.trim() !== '' &&
    address.trim() !== '' &&
    city.trim() !== '' &&
    country.trim() !== '' &&
    consentChecked;

  const handleSubmit = () => {
    if (!isFormValid) { return; }
    // TODO: Appel API pour inviter le professionnel
    // POST /api/patient/invite-professional ou équivalent
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
              FICHE DE VOTRE{'\n'}PROFESSIONNEL
            </Text>
            <TouchableOpacity
              style={styles.formBackButton}
              onPress={onBack}
              accessibilityLabel="Revenir à la liste"
              accessibilityRole="button"
            >
              <Text style={styles.formBackButtonText}>Revenir à la liste</Text>
            </TouchableOpacity>
          </View>

          {/* Spécialité * */}
          <TouchableOpacity
            style={styles.formDropdownButton}
            onPress={() => { setSpecialtyOpen(!specialtyOpen); setCountryOpen(false); }}
            accessibilityLabel={specialty || 'Spécialité'}
            accessibilityRole="button"
          >
            <Text style={[styles.formDropdownText, specialty ? styles.formDropdownTextSelected : null]}>
              {specialty || 'Spécialité *'}
            </Text>
            <Text style={styles.formDropdownArrow}>▼</Text>
          </TouchableOpacity>
          <AnimatedDropdown visible={specialtyOpen}>
            <View style={styles.formDropdownMenu}>
              {SPECIALTIES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={styles.formDropdownItem}
                  onPress={() => { setSpecialty(s); setSpecialtyOpen(false); }}
                  accessibilityLabel={s}
                  accessibilityRole="button"
                >
                  <Text style={styles.formDropdownItemText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </AnimatedDropdown>

          {/* Nom * */}
          <TextInput
            style={styles.formInput}
            placeholder="Nom *"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* Prénom * */}
          <TextInput
            style={styles.formInput}
            placeholder="Prénom *"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* Adresse * */}
          <TextInput
            style={styles.formInput}
            placeholder="Adresse *"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
          />

          {/* Complément d'adresse */}
          <TextInput
            style={styles.formInput}
            placeholder="Complément d'adresse"
            placeholderTextColor="#999"
            value={addressComplement}
            onChangeText={setAddressComplement}
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

          {/* Ville * */}
          <TextInput
            style={styles.formInput}
            placeholder="Ville *"
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
          />

          {/* Pays * */}
          <TouchableOpacity
            style={styles.formDropdownButton}
            onPress={() => { setCountryOpen(!countryOpen); setSpecialtyOpen(false); }}
            accessibilityLabel={country || 'Pays'}
            accessibilityRole="button"
          >
            <Text style={[styles.formDropdownText, country ? styles.formDropdownTextSelected : null]}>
              {country || 'Pays *'}
            </Text>
            <Text style={styles.formDropdownArrow}>▼</Text>
          </TouchableOpacity>
          <AnimatedDropdown visible={countryOpen}>
            <View style={styles.formDropdownMenu}>
              {COUNTRIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={styles.formDropdownItem}
                  onPress={() => { setCountry(c); setCountryOpen(false); }}
                  accessibilityLabel={c}
                  accessibilityRole="button"
                >
                  <Text style={styles.formDropdownItemText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </AnimatedDropdown>

          {/* E-mail */}
          <TextInput
            style={styles.formInput}
            placeholder="E-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Téléphone professionnel */}
          <TextInput
            style={styles.formInput}
            placeholder="Téléphone professionnel"
            placeholderTextColor="#999"
            value={proPhone}
            onChangeText={setProPhone}
            keyboardType="phone-pad"
          />

          {/* Téléphone mobile */}
          <TextInput
            style={styles.formInput}
            placeholder="Téléphone mobile"
            placeholderTextColor="#999"
            value={mobilePhone}
            onChangeText={setMobilePhone}
            keyboardType="phone-pad"
          />

          {/* Note personnalisée */}
          <Text style={styles.formNoteLabel}>
            Souhaitez-vous personnaliser cette invitation en y ajoutant une note ?
          </Text>
          <TextInput
            style={styles.formNoteInput}
            placeholder="Votre note (optionnel)"
            placeholderTextColor="#999"
            value={note}
            onChangeText={setNote}
            multiline
          />

          {/* Checkbox consentement */}
          <TouchableOpacity
            style={styles.formCheckboxRow}
            onPress={() => setConsentChecked(!consentChecked)}
            activeOpacity={0.8}
            accessibilityLabel="J'accepte les conditions de partage de données médicales"
            accessibilityRole="checkbox"
          >
            <View style={[styles.formCheckbox, consentChecked && styles.formCheckboxChecked]}>
              {consentChecked && <Icon name="checkmark" size={14} color={COLORS.white} />}
            </View>
            <Text style={styles.formCheckboxLabel}>
              Attention, l'ajout d'un professionnel donne accès à vos données médicales.
              Veuillez vous assurer que l'adresse e-mail saisie soit correcte.
            </Text>
          </TouchableOpacity>

          {/* Bouton envoyer */}
          <TouchableOpacity
            style={[styles.formSubmitButton, !isFormValid && styles.formSubmitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid}
            accessibilityLabel="Envoyer l'invitation"
            accessibilityRole="button"
          >
            <Text style={styles.formSubmitButtonText}>Envoyer l'invitation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

export default InviteProfessionalPage;
