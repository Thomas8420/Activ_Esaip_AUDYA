import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import LogoAudya from '../../assets/images/logo-audya.svg';
import { registerStyles as s, COLORS } from '../../screens/Register/Register.styles';
import { useNavigation } from '../../context/NavigationContext';
import { useRegister } from '../../context/RegisterContext';
import Bubbles from '../../components/Bubbles';

const MAX_PHOTO_SIZE_MB = 3;

const PAYS = [
  'France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada',
  'Maroc', 'Algérie', 'Tunisie', 'Sénégal', "Côte d'Ivoire",
  'Allemagne', 'Espagne', 'Italie', 'Portugal', 'Royaume-Uni',
  'Pays-Bas', 'États-Unis', 'Autre',
];

type Errors = {
  dateNaissance?: string; nom?: string; prenom?: string;
  numeroSecu?: string; adresse?: string; ville?: string;
  pays?: string; telephoneMobile?: string; profession?: string;
};

// Champ texte avec erreur — défini EN DEHORS du composant pour éviter la perte de focus
type FieldProps = {
  placeholder: string; value: string;
  error?: string; keyboard?: 'numeric' | 'phone-pad'; maxLen?: number;
  secure?: boolean;
  onChange: (v: string) => void;
};
const Field = ({ placeholder, value, error, keyboard, maxLen, secure, onChange }: FieldProps) => (
  <>
    <TextInput
      style={[s.input, error ? s.inputError : null]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textLight}
      keyboardType={keyboard}
      maxLength={maxLen}
      secureTextEntry={secure}
      value={value}
      onChangeText={onChange}
    />
    {error && <Text style={s.errorText}>⊙ {error}</Text>}
  </>
);

// Item de modal — défini EN DEHORS du composant
type ModalItemProps = { value: string; selected: boolean; onPress: () => void };
const ModalItem = ({ value, selected, onPress }: ModalItemProps) => (
  <TouchableOpacity style={[s.modalItem, selected && s.modalItemSelected]} onPress={onPress} activeOpacity={0.7}>
    <Text style={[s.modalItemText, selected && s.modalItemTextSelected]}>{value}</Text>
    {selected && <Text style={{ color: COLORS.orange }}>✓</Text>}
  </TouchableOpacity>
);

const RegisterStep2Page = () => {
  const { navigateTo } = useNavigation();
  const { registerData } = useRegister();

  const [form, setForm] = useState({
    genre: 'homme' as 'homme' | 'femme',
    dateNaissance: '', nom: '', prenom: '', numeroSecu: '',
    adresse: '', complement: '', codePostal: '', ville: '',
    pays: '', telephoneFixe: '', telephoneMobile: '',
    email: registerData.email,
    profession: '',
  });

  const [errors, setErrors]              = useState<Errors>({});
  const [paysModal, setPaysModal] = useState(false);
  const [photoUri, setPhotoUri]   = useState<string | null>(null);
  const [photoModal, setPhotoModal] = useState(false);

  const clearError = (field: keyof Errors) => {
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.dateNaissance.trim())   e.dateNaissance   = 'Veuillez remplir ce champ !';
    if (!form.nom.trim())             e.nom             = 'Veuillez remplir ce champ !';
    if (!form.prenom.trim())          e.prenom          = 'Veuillez remplir ce champ !';
    if (!form.adresse.trim())         e.adresse         = 'Veuillez remplir ce champ !';
    if (!form.ville.trim())           e.ville           = 'Veuillez remplir ce champ !';
    if (!form.pays)                   e.pays            = 'Veuillez remplir ce champ !';
    if (!form.telephoneMobile.trim()) e.telephoneMobile = 'Veuillez remplir ce champ !';
    if (!form.profession.trim())      e.profession      = 'Veuillez remplir ce champ !';
    if (!form.numeroSecu.trim())      e.numeroSecu      = 'Veuillez remplir ce champ !';
    else if (!/^\d{13}$/.test(form.numeroSecu.trim())) e.numeroSecu = 'Le numéro doit être composé de 13 chiffres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    setPhotoModal(false);
    if (response.didCancel || response.errorCode) return;
    const asset = response.assets?.[0];
    if (!asset?.uri) return;
    const sizeMB = (asset.fileSize ?? 0) / (1024 * 1024);
    if (sizeMB > MAX_PHOTO_SIZE_MB) {
      Alert.alert('Fichier trop lourd', `La photo ne doit pas dépasser ${MAX_PHOTO_SIZE_MB} Mo.`);
      return;
    }
    setPhotoUri(asset.uri);
  };

  const handlePickFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 }, handleImagePickerResponse);
  };

  const handlePickFromCamera = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8, saveToPhotos: false }, handleImagePickerResponse);
  };

  const handleSubmit = () => { if (validate()) navigateTo('register-step3'); };

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <Bubbles />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <LogoAudya width={152} height={81} style={s.logo} />

        <View style={s.card}>
          {/* Badge étape */}
          <View style={s.stepBadgeInCard}>
            <View style={s.stepBadge}><Text style={s.stepBadgeText}>2 sur 5</Text></View>
            <Text style={s.stepLabel}>Étape</Text>
          </View>

          <Text style={s.cardTitleCompact}>Informations personnelles</Text>
          <Text style={s.cardSubtitle}>*Champs obligatoires</Text>

          {/* Genre */}
          <View style={s.radioRow}>
            <Text style={s.radioLabel}>Vous êtes *</Text>
            {(['homme', 'femme'] as const).map(g => (
              <TouchableOpacity key={g} style={s.radioOption} onPress={() => setForm({ ...form, genre: g })} activeOpacity={0.7}>
                <View style={[s.radioCircle, form.genre === g && s.radioCircleSelected]}>
                  {form.genre === g && <View style={s.radioDot} />}
                </View>
                <Text style={s.radioText}>{g.charAt(0).toUpperCase() + g.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date de naissance */}
          <View style={[s.inputRow, errors.dateNaissance ? s.inputError : null]}>
            <TextInput style={s.inputRowText} placeholder="Date de naissance *" placeholderTextColor={COLORS.textLight}
              value={form.dateNaissance} onChangeText={v => { setForm({ ...form, dateNaissance: v }); clearError('dateNaissance'); }} />
            <Text style={{ fontSize: 16, color: COLORS.textLight }}>📅</Text>
          </View>
          {errors.dateNaissance && <Text style={s.errorText}>⊙ {errors.dateNaissance}</Text>}

          {/* Champs identité */}
          <Field        placeholder="Nom *"                          value={form.nom}        error={errors.nom}        onChange={v => { setForm({ ...form, nom: v });        clearError('nom'); }} />
          <Field     placeholder="Prénom *"                       value={form.prenom}     error={errors.prenom}     onChange={v => { setForm({ ...form, prenom: v });     clearError('prenom'); }} />
          <Field placeholder="Numéro de sécurité sociale *"   value={form.numeroSecu} error={errors.numeroSecu} keyboard="numeric" maxLen={13} secure onChange={v => { setForm({ ...form, numeroSecu: v }); clearError('numeroSecu'); }} />
          <Field    placeholder="Adresse *"                      value={form.adresse}    error={errors.adresse}    onChange={v => { setForm({ ...form, adresse: v });    clearError('adresse'); }} />

          {/* Champs optionnels */}
          <TextInput style={s.input} placeholder="Complément d'adresse" placeholderTextColor={COLORS.textLight} value={form.complement}  onChangeText={v => setForm({ ...form, complement: v })} />
          <TextInput style={s.input} placeholder="Code postal"          placeholderTextColor={COLORS.textLight} keyboardType="numeric" value={form.codePostal}  onChangeText={v => setForm({ ...form, codePostal: v })} />

          <Field placeholder="Ville *" value={form.ville} error={errors.ville} onChange={v => { setForm({ ...form, ville: v }); clearError('ville'); }} />

          {/* Pays — dropdown */}
          <TouchableOpacity style={[s.inputRow, errors.pays ? s.inputError : null]} onPress={() => { setPaysModal(true); clearError('pays'); }} activeOpacity={0.7}>
            <Text style={[s.inputRowText, { color: form.pays ? COLORS.text : COLORS.textLight }]}>{form.pays || 'Pays *'}</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>▼</Text>
          </TouchableOpacity>
          {errors.pays && <Text style={s.errorText}>⊙ {errors.pays}</Text>}

          {/* Téléphones */}
          <TextInput style={s.input} placeholder="Téléphone fixe" placeholderTextColor={COLORS.textLight} keyboardType="phone-pad" value={form.telephoneFixe} onChangeText={v => setForm({ ...form, telephoneFixe: v })} />
          <Field placeholder="Téléphone mobile *" value={form.telephoneMobile} error={errors.telephoneMobile} keyboard="phone-pad" onChange={v => { setForm({ ...form, telephoneMobile: v }); clearError('telephoneMobile'); }} />

          {/* Email pré-rempli depuis l'étape 1 */}
          <TextInput style={s.inputPrefilled} value={form.email} editable={false} />

          <Field placeholder="Profession *" value={form.profession} error={errors.profession} onChange={v => { setForm({ ...form, profession: v }); clearError('profession'); }} />

          {/* Photo de profil */}
          <TouchableOpacity style={s.photoField} onPress={() => setPhotoModal(true)} activeOpacity={0.7}>
            {photoUri && <Image source={{ uri: photoUri }} style={s.photoPreview} />}
            <Text style={s.photoFieldLabel}>{photoUri ? 'Changer la photo' : 'Ajouter une photo de profil'}</Text>
            <View style={s.photoIconBtn}><Text style={s.photoIconText}>⬇️</Text></View>
          </TouchableOpacity>
          {photoUri && (
            <TouchableOpacity onPress={() => setPhotoUri(null)} style={s.removePhotoBtn}>
              <Text style={s.removePhotoText}>🗑️ Supprimer la photo</Text>
            </TouchableOpacity>
          )}

          {/* Bouton suivant */}
          <Pressable style={({ pressed }) => [s.btnPrimarySmall, pressed && s.btnPrimarySmallPressed]} onPress={handleSubmit}>
            {({ pressed }) => <Text style={[s.btnPrimaryText, pressed && s.btnPrimaryTextPressed]}>Suivant</Text>}
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal sélection pays */}
      <Modal visible={paysModal} transparent animationType="slide" onRequestClose={() => setPaysModal(false)}>
        <TouchableOpacity style={s.modalOverlay} onPress={() => setPaysModal(false)} activeOpacity={1}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Choisir un pays</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {PAYS.map(p => <ModalItem key={p} value={p} selected={form.pays === p} onPress={() => { setForm({ ...form, pays: p }); setPaysModal(false); }} />)}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal source photo */}
      <Modal visible={photoModal} transparent animationType="fade" onRequestClose={() => setPhotoModal(false)}>
        <TouchableOpacity style={s.modalOverlay} onPress={() => setPhotoModal(false)} activeOpacity={1}>
          <View style={s.photoModalSheet}>
            <Text style={s.modalTitle}>Ajouter une photo</Text>
            <TouchableOpacity style={s.photoModalBtn} onPress={handlePickFromGallery} activeOpacity={0.7}>
              <Text style={s.photoModalBtnText}>📷  Choisir depuis la galerie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.photoModalBtn} onPress={handlePickFromCamera} activeOpacity={0.7}>
              <Text style={s.photoModalBtnText}>📸  Prendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.photoModalBtn, s.photoModalCancel]} onPress={() => setPhotoModal(false)} activeOpacity={0.7}>
              <Text style={[s.photoModalBtnText, { color: COLORS.textLight }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterStep2Page;
