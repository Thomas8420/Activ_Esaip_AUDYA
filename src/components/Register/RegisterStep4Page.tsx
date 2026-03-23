import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoAudya from '../../assets/images/logo-audya.svg';
import { registerStyles as s, COLORS } from '../../screens/Register/Register.styles';
import { useNavigation } from '../../context/NavigationContext';
import Bubbles from '../../components/Bubbles';

const OPTIONS_PROFESSION = [
  'Cadres et professions intellectuelles supérieures', 'Professions intermédiaires',
  'Employés', 'Ouvriers', 'Agriculteurs exploitants',
  "Artisans, commerçants, chefs d'entreprise", 'Retraités',
  'Sans activité professionnelle', 'Autre',
];

// Champs texte optionnels de la page
const CHAMPS_OPTIONNELS = [
  { key: 'antecedentsFamiliaux',    placeholder: 'Antécédents familiaux' },
  { key: 'antecedentsMedicaux',     placeholder: 'Antécédents médicaux' },
  { key: 'antecedentsChirurgicaux', placeholder: 'Antécédents chirurgicaux' },
  { key: 'traitementEnCours',       placeholder: 'Traitement médical en cours' },
  { key: 'allergies',               placeholder: 'Allergies connues' },
  { key: 'activitePhysique',        placeholder: "Nombre d'heures d'activité physique", numeric: true },
];

type Errors = { taille?: string; poids?: string };

const RegisterStep4Page = () => {
  const { navigateTo } = useNavigation();

  const [form, setForm] = useState({
    profession: '', fumeur: false, taille: '', poids: '',
    antecedentsFamiliaux: '', antecedentsMedicaux: '', antecedentsChirurgicaux: '',
    traitementEnCours: '', allergies: '', activitePhysique: '', remarques: '',
  });

  const [errors, setErrors]       = useState<Errors>({});
  const [showModal, setShowModal] = useState(false);

  const clearError = (field: keyof Errors) => {
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  // Validation taille et poids obligatoires
  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.taille.trim()) e.taille = 'Veuillez remplir ce champ !';
    if (!form.poids.trim())  e.poids  = 'Veuillez remplir ce champ !';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <Bubbles />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <LogoAudya width={152} height={81} style={s.logo} />

        <View style={s.card}>
          {/* Badge étape */}
          <View style={s.stepBadgeInCard}>
            <View style={s.stepBadge}><Text style={s.stepBadgeText}>4 sur 5</Text></View>
            <Text style={s.stepLabel}>Étape</Text>
          </View>

          <Text style={s.cardTitleCompact}>Informations médicales</Text>

          {/* Profession — dropdown */}
          <TouchableOpacity style={s.inputRow} onPress={() => setShowModal(true)} activeOpacity={0.7}>
            <Text style={[s.inputRowText, { color: form.profession ? COLORS.text : COLORS.textLight }]}>
              {form.profession || 'Cadres et professions intellect...'}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>▼</Text>
          </TouchableOpacity>

          {/* Fumeur — case verte centrée */}
          <TouchableOpacity style={s.checkboxRowCentered} onPress={() => setForm({ ...form, fumeur: !form.fumeur })} activeOpacity={0.7}>
            <View style={[s.checkbox, form.fumeur && s.checkboxGreen]}>
              {form.fumeur && <Text style={{ color: COLORS.white, fontSize: 12 }}>✓</Text>}
            </View>
            <Text style={[s.checkboxLabel, { flex: 0 }]}>Fumeur</Text>
          </TouchableOpacity>

          {/* Taille et poids — champs obligatoires */}
          <TextInput style={[s.input, errors.taille ? s.inputError : null]} placeholder="Votre taille (cm) *"
            placeholderTextColor={COLORS.textLight} keyboardType="numeric" value={form.taille}
            onChangeText={v => { setForm({ ...form, taille: v }); clearError('taille'); }} />
          {errors.taille && <Text style={s.errorText}>⊙ {errors.taille}</Text>}

          <TextInput style={[s.input, errors.poids ? s.inputError : null]} placeholder="Votre poids (kg) *"
            placeholderTextColor={COLORS.textLight} keyboardType="numeric" value={form.poids}
            onChangeText={v => { setForm({ ...form, poids: v }); clearError('poids'); }} />
          {errors.poids && <Text style={s.errorText}>⊙ {errors.poids}</Text>}

          {/* Champs optionnels générés dynamiquement */}
          {CHAMPS_OPTIONNELS.map(({ key, placeholder, numeric }) => (
            <TextInput key={key} style={s.input} placeholder={placeholder} placeholderTextColor={COLORS.textLight}
              keyboardType={numeric ? 'numeric' : 'default'}
              value={form[key as keyof typeof form] as string}
              onChangeText={v => setForm({ ...form, [key]: v })} />
          ))}

          {/* Remarques — champ multilignes */}
          <TextInput style={[s.input, { minHeight: 80, textAlignVertical: 'top' }]} placeholder="Remarques"
            placeholderTextColor={COLORS.textLight} multiline value={form.remarques}
            onChangeText={v => setForm({ ...form, remarques: v })} />

          {/* Bouton suivant */}
          <Pressable style={({ pressed }) => [s.btnPrimarySmall, pressed && s.btnPrimarySmallPressed]}
            onPress={() => { if (validate()) navigateTo('register-step5'); }}>
            {({ pressed }) => <Text style={[s.btnPrimaryText, pressed && s.btnPrimaryTextPressed]}>Suivant</Text>}
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal sélection profession */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={s.modalOverlay} onPress={() => setShowModal(false)} activeOpacity={1}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Catégorie socio-professionnelle</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {OPTIONS_PROFESSION.map(option => (
                <TouchableOpacity key={option} style={[s.modalItem, form.profession === option && s.modalItemSelected]}
                  onPress={() => { setForm({ ...form, profession: option }); setShowModal(false); }} activeOpacity={0.7}>
                  <Text style={[s.modalItemText, form.profession === option && s.modalItemTextSelected]}>{option}</Text>
                  {form.profession === option && <Text style={{ color: COLORS.orange }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterStep4Page;
