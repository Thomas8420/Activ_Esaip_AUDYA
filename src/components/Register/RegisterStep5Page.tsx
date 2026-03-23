import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoAudya from '../../assets/images/logo-audya.svg';
import { registerStyles as s, COLORS } from '../../screens/Register/Register.styles';
import { useNavigation } from '../../context/NavigationContext';
import Bubbles from '../../components/Bubbles';

const OPTIONS_SPECIALITE = [
  'Médecin généraliste', 'ORL (Oto-Rhino-Laryngologiste)', 'Audioprothésiste',
  'Audiologiste', 'Orthophoniste', 'Neurologue', 'Gériatre', 'Pédiatre', 'Autre spécialiste',
];

type Errors = { ville?: string };

const RegisterStep5Page = () => {
  const { navigateTo } = useNavigation();

  const [form, setForm] = useState({ specialite: '', nom: '', prenom: '', codePostal: '', ville: '' });
  const [errors, setErrors]     = useState<Errors>({});
  const [showModal, setShowModal] = useState(false);

  const clearError = (field: keyof Errors) => {
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  // Ville obligatoire avant toute action
  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.ville.trim()) e.ville = 'Veuillez remplir ce champ !';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSearch   = () => { if (validate()) { /* TODO: appel API */ } };
  const handleSkip     = () => { if (validate()) navigateTo('register-success'); };
  const handleValidate = () => { if (validate()) navigateTo('register-success'); };

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <Bubbles />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <LogoAudya width={152} height={81} style={s.logo} />

        <View style={s.card}>
          {/* Badge étape */}
          <View style={s.stepBadgeInCard}>
            <View style={s.stepBadge}><Text style={s.stepBadgeText}>5 sur 5</Text></View>
            <Text style={s.stepLabel}>Étape</Text>
          </View>

          <Text style={s.cardTitleCompact}>Ajouter un professionnel de santé</Text>
          <Text style={s.cardSubtitle}>*Champs obligatoires</Text>

          {/* Spécialité — dropdown */}
          <TouchableOpacity style={s.inputRow} onPress={() => setShowModal(true)} activeOpacity={0.7}>
            <Text style={[s.inputRowText, { color: form.specialite ? COLORS.text : COLORS.textLight }]}>
              {form.specialite || 'Spécialité'}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>▼</Text>
          </TouchableOpacity>

          {/* Champs optionnels */}
          <TextInput style={s.input} placeholder="Nom" placeholderTextColor={COLORS.textLight} value={form.nom} onChangeText={v => setForm({ ...form, nom: v })} />
          <TextInput style={s.input} placeholder="Prénom" placeholderTextColor={COLORS.textLight} value={form.prenom} onChangeText={v => setForm({ ...form, prenom: v })} />
          <TextInput style={s.input} placeholder="Code postal" placeholderTextColor={COLORS.textLight} keyboardType="numeric" value={form.codePostal} onChangeText={v => setForm({ ...form, codePostal: v })} />

          {/* Ville — obligatoire */}
          <TextInput
            style={[s.input, errors.ville ? s.inputError : null]}
            placeholder="Ville *" placeholderTextColor={COLORS.textLight}
            value={form.ville}
            onChangeText={v => { setForm({ ...form, ville: v }); clearError('ville'); }}
          />
          {errors.ville && <Text style={s.errorText}>⊙ {errors.ville}</Text>}

          {/* Bouton rechercher */}
          <Pressable style={({ pressed }) => [s.btnPrimarySmall, pressed && s.btnPrimarySmallPressed]} onPress={handleSearch}>
            {({ pressed }) => <Text style={[s.btnPrimaryText, pressed && s.btnPrimaryTextPressed]}>Rechercher</Text>}
          </Pressable>

          {/* Boutons bas — même taille sur la même ligne */}
          <View style={s.btnRow}>
            <Pressable style={({ pressed }) => [s.btnStep5Skip, pressed && s.btnStep5SkipPressed]} onPress={handleSkip}>
              {({ pressed }) => <Text style={[s.btnStep5SkipText, pressed && s.btnStep5SkipTextPressed]}>Je ne trouve pas mon professionnel de santé</Text>}
            </Pressable>
            <Pressable style={({ pressed }) => [s.btnStep5Validate, pressed && s.btnStep5ValidatePressed]} onPress={handleValidate}>
              {({ pressed }) => <Text style={[s.btnStep5ValidateText, pressed && s.btnStep5ValidateTextPressed]}>Je valide et je passe à l'étape suivante</Text>}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Modal sélection spécialité */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={s.modalOverlay} onPress={() => setShowModal(false)} activeOpacity={1}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Choisir une spécialité</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {OPTIONS_SPECIALITE.map(option => (
                <TouchableOpacity key={option} style={[s.modalItem, form.specialite === option && s.modalItemSelected]}
                  onPress={() => { setForm({ ...form, specialite: option }); setShowModal(false); }} activeOpacity={0.7}>
                  <Text style={[s.modalItemText, form.specialite === option && s.modalItemTextSelected]}>{option}</Text>
                  {form.specialite === option && <Text style={{ color: COLORS.orange }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterStep5Page;
