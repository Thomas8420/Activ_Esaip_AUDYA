import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { styles, COLORS } from '../../screens/Profile/ProfileScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import {
  PatientProfile,
  fetchPatientProfile,
  updatePatientProfile,
  uploadProfilePhoto,
} from '../../services/profileService';

// ─── Mock Data (remove once API is ready) ────────────────────────────────────
const MOCK_PROFILE: PatientProfile = {
  id: '1',
  gender: 'homme',
  birthDate: '06/09/1954',
  lastName: 'Duroc',
  firstName: 'Roger',
  phone: '0323232323',
  address: '76 cours gambetta',
  addressComplement: '',
  zipCode: '69007',
  city: 'Lyon',
  country: 'France',
  phoneFax: '',
  email: 'patient.audya-48@gmail.com',
  profilePictureUrl: null,
};

/** Passer à true dès que GET/PATCH /api/patient/profile est disponible */
const USE_API = false;

/** Taille max autorisée pour la photo (3 Mo) */
const MAX_PHOTO_SIZE_MB = 3;

// ─── QR Code placeholder ─────────────────────────────────────────────────────
/**
 * Représentation visuelle d'un QR code.
 * À remplacer par react-native-qrcode-svg lorsque l'API fournira l'URL de partage.
 */
const QRCodePlaceholder = () => (
  <Svg width={64} height={64} viewBox="0 0 9 9">
    {/* Finder top-left */}
    <Rect x="0" y="0" width="3" height="3" fill="#2D2D2D" />
    <Rect x="0.5" y="0.5" width="2" height="2" fill="#fff" />
    <Rect x="1" y="1" width="1" height="1" fill="#2D2D2D" />
    {/* Finder top-right */}
    <Rect x="6" y="0" width="3" height="3" fill="#2D2D2D" />
    <Rect x="6.5" y="0.5" width="2" height="2" fill="#fff" />
    <Rect x="7" y="1" width="1" height="1" fill="#2D2D2D" />
    {/* Finder bottom-left */}
    <Rect x="0" y="6" width="3" height="3" fill="#2D2D2D" />
    <Rect x="0.5" y="6.5" width="2" height="2" fill="#fff" />
    <Rect x="1" y="7" width="1" height="1" fill="#2D2D2D" />
    {/* Data dots */}
    <Rect x="4" y="0" width="1" height="1" fill="#2D2D2D" />
    <Rect x="3" y="3" width="1" height="1" fill="#2D2D2D" />
    <Rect x="5" y="3" width="1" height="1" fill="#2D2D2D" />
    <Rect x="4" y="4" width="1" height="1" fill="#2D2D2D" />
    <Rect x="3" y="5" width="1" height="1" fill="#2D2D2D" />
    <Rect x="6" y="4" width="1" height="1" fill="#2D2D2D" />
    <Rect x="8" y="3" width="1" height="1" fill="#2D2D2D" />
    <Rect x="4" y="6" width="1" height="1" fill="#2D2D2D" />
    <Rect x="6" y="6" width="1" height="1" fill="#2D2D2D" />
    <Rect x="8" y="6" width="1" height="1" fill="#2D2D2D" />
    <Rect x="5" y="7" width="1" height="1" fill="#2D2D2D" />
    <Rect x="7" y="8" width="1" height="1" fill="#2D2D2D" />
    <Rect x="4" y="8" width="1" height="1" fill="#2D2D2D" />
  </Svg>
);

/** Icône silhouette utilisateur pour la photo de profil (placeholder) */
const PersonIcon = () => (
  <Svg width={44} height={44} viewBox="0 0 24 24">
    <Path
      d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
      fill={COLORS.textLighter}
    />
  </Svg>
);

/** Icône crayon pour le badge "modifier" */
const EditIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      fill={COLORS.white}
    />
  </Svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Page Mon Profil : informations personnelles du patient.
 * Affiche le QR code de partage, la photo de profil (modifiable) et les champs éditables.
 *
 * Suit le pattern USE_API défini dans CLAUDE.md.
 */
const ProfilePage = () => {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ── Photo state ──────────────────────────────────────────────────────────────
  /** URI locale de la photo sélectionnée (non encore uploadée) */
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);

  // ── Load on mount ────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (USE_API) {
          const data = await fetchPatientProfile();
          setProfile(data);
        } else {
          setProfile({ ...MOCK_PROFILE });
        }
      } catch {
        Alert.alert('Erreur', 'Impossible de charger le profil.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Photo handler ────────────────────────────────────────────────────────────

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorCode) {
      return;
    }
    const asset = response.assets?.[0];
    if (!asset?.uri) {
      return;
    }
    const sizeMB = (asset.fileSize ?? 0) / (1024 * 1024);
    if (sizeMB > MAX_PHOTO_SIZE_MB) {
      Alert.alert(
        'Fichier trop lourd',
        `La photo ne doit pas dépasser ${MAX_PHOTO_SIZE_MB} Mo.`,
      );
      return;
    }
    setLocalPhotoUri(asset.uri);
  };

  const handlePickPhoto = () => {
    Alert.alert(
      'Photo de profil',
      'Choisir une source',
      [
        {
          text: 'Prendre une photo',
          onPress: () =>
            launchCamera(
              { mediaType: 'photo', quality: 0.8, saveToPhotos: false },
              handleImagePickerResponse,
            ),
        },
        {
          text: 'Choisir dans la galerie',
          onPress: () =>
            launchImageLibrary(
              { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
              handleImagePickerResponse,
            ),
        },
        { text: 'Annuler', style: 'cancel' },
      ],
    );
  };

  // ── Field updater ────────────────────────────────────────────────────────────
  const updateField = <K extends keyof PatientProfile>(
    key: K,
    value: PatientProfile[K],
  ) => {
    if (!profile) {
      return;
    }
    setProfile({ ...profile, [key]: value });
  };

  // ── Save handler ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!profile) {
      return;
    }
    setIsSaving(true);
    try {
      if (USE_API) {
        // Upload la nouvelle photo si elle a été modifiée
        if (localPhotoUri) {
          const filename = localPhotoUri.split('/').pop() ?? 'photo.jpg';
          const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
          const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
          const newUrl = await uploadProfilePhoto(localPhotoUri, mimeType, filename);
          setProfile(prev => prev ? { ...prev, profilePictureUrl: newUrl } : prev);
          setLocalPhotoUri(null);
        }
        await updatePatientProfile(profile);
      }
      // TODO: afficher un toast de confirmation
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder le profil.');
    } finally {
      setIsSaving(false);
    }
  };

  // Détermine l'URI de l'image à afficher : locale > serveur > null
  const displayPhotoUri = localPhotoUri ?? profile?.profilePictureUrl ?? null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Titre ── */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>MON PROFIL</Text>
        </View>

        {isLoading || !profile ? (
          <ActivityIndicator
            size="large"
            color={COLORS.orange}
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            {/* ── QR Code ── */}
            <View style={styles.qrSection} testID="qrSection">
              <View style={styles.qrBox}>
                <QRCodePlaceholder />
              </View>
              <Text style={styles.qrText}>
                Ce QR code vous permet de partager votre profil avec un professionnel
              </Text>
            </View>

            {/* ── Photo de profil ── */}
            <View style={styles.photoSection}>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handlePickPhoto}
                activeOpacity={0.8}
                accessibilityLabel="Modifier la photo de profil"
                testID="photoButton"
              >
                {displayPhotoUri ? (
                  <Image
                    source={{ uri: displayPhotoUri }}
                    style={styles.photoImage}
                    testID="profileImage"
                  />
                ) : (
                  <PersonIcon />
                )}
                {/* Badge crayon */}
                <View style={styles.photoEditBadge}>
                  <EditIcon />
                </View>
              </TouchableOpacity>
              <Text style={styles.photoLabel}>Photo de votre profil</Text>
              <Text style={styles.photoHint}>(3 Mo max)</Text>
            </View>

            {/* ── Informations personnelles ── */}
            <View style={styles.sectionCard}>

              {/* Genre */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>Vous êtes *</Text>
                <View style={styles.genderRow}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      profile.gender === 'homme' && styles.genderButtonActive,
                    ]}
                    onPress={() => updateField('gender', 'homme')}
                    activeOpacity={0.7}
                    testID="genderHomme"
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        profile.gender === 'homme' && styles.genderButtonTextActive,
                      ]}
                    >
                      Homme
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      profile.gender === 'femme' && styles.genderButtonActive,
                    ]}
                    onPress={() => updateField('gender', 'femme')}
                    activeOpacity={0.7}
                    testID="genderFemme"
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        profile.gender === 'femme' && styles.genderButtonTextActive,
                      ]}
                    >
                      Femme
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date de naissance */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>Date de naissance</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.birthDate}
                  onChangeText={v => updateField('birthDate', v)}
                  placeholder="JJ/MM/AAAA"
                  placeholderTextColor={COLORS.textLighter}
                  keyboardType="numeric"
                  testID="birthDateInput"
                />
              </View>

              {/* Nom + Prénom */}
              <View style={styles.twoColRow}>
                <View style={styles.twoColField}>
                  <Text style={styles.fieldLabel}>Nom</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={profile.lastName}
                    onChangeText={v => updateField('lastName', v)}
                    placeholder="Nom"
                    placeholderTextColor={COLORS.textLighter}
                    autoCapitalize="words"
                    testID="lastNameInput"
                  />
                </View>
                <View style={styles.twoColField}>
                  <Text style={styles.fieldLabel}>Prénom</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={profile.firstName}
                    onChangeText={v => updateField('firstName', v)}
                    placeholder="Prénom"
                    placeholderTextColor={COLORS.textLighter}
                    autoCapitalize="words"
                    testID="firstNameInput"
                  />
                </View>
              </View>

              {/* Téléphone */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>Téléphone</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.phone}
                  onChangeText={v => updateField('phone', v)}
                  placeholder="Téléphone"
                  placeholderTextColor={COLORS.textLighter}
                  keyboardType="phone-pad"
                  testID="phoneInput"
                />
              </View>

              {/* Adresse */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>Adresse</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.address}
                  onChangeText={v => updateField('address', v)}
                  placeholder="Adresse"
                  placeholderTextColor={COLORS.textLighter}
                  autoCapitalize="words"
                  testID="addressInput"
                />
              </View>

              {/* Complément d'adresse */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>{"Complément d'adresse"}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.addressComplement}
                  onChangeText={v => updateField('addressComplement', v)}
                  placeholder="Bâtiment, appartement…"
                  placeholderTextColor={COLORS.textLighter}
                  autoCapitalize="words"
                  testID="addressComplementInput"
                />
              </View>

              {/* Code postal + Ville */}
              <View style={styles.twoColRow}>
                <View style={styles.twoColField}>
                  <Text style={styles.fieldLabel}>Code postal</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={profile.zipCode}
                    onChangeText={v => updateField('zipCode', v)}
                    placeholder="00000"
                    placeholderTextColor={COLORS.textLighter}
                    keyboardType="numeric"
                    testID="zipCodeInput"
                  />
                </View>
                <View style={styles.twoColField}>
                  <Text style={styles.fieldLabel}>Ville</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={profile.city}
                    onChangeText={v => updateField('city', v)}
                    placeholder="Ville"
                    placeholderTextColor={COLORS.textLighter}
                    autoCapitalize="words"
                    testID="cityInput"
                  />
                </View>
              </View>

              {/* Pays */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>Pays</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.country}
                  onChangeText={v => updateField('country', v)}
                  placeholder="Pays"
                  placeholderTextColor={COLORS.textLighter}
                  autoCapitalize="words"
                  testID="countryInput"
                />
              </View>

              {/* Téléphone fax */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>Téléphone fax</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.phoneFax}
                  onChangeText={v => updateField('phoneFax', v)}
                  placeholder="Fax"
                  placeholderTextColor={COLORS.textLighter}
                  keyboardType="phone-pad"
                  testID="phoneFaxInput"
                />
              </View>

              {/* Email */}
              <View style={[styles.fieldWrapper, { marginBottom: 0 }]}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={profile.email}
                  onChangeText={v => updateField('email', v)}
                  placeholder="email@exemple.com"
                  placeholderTextColor={COLORS.textLighter}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  testID="emailInput"
                />
              </View>
            </View>

            {/* ── Enregistrer ── */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
              testID="saveProfileButton"
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Enregistrement…' : 'Enregistrer les modifications'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
};

export default ProfilePage;
