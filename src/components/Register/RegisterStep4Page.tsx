import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LogoAudya from '../../assets/images/logo-audya.svg';
import { registerStyles as s, COLORS } from '../../screens/Register/Register.styles';
import { useNavigation } from '../../context/NavigationContext';
import Bubbles from '../../components/Bubbles';
import { sanitizeText, sanitizeNumeric, MAX_LENGTHS } from '../../utils/validators';

const OPTIONS_PROFESSION = [
  'Cadres et professions intellectuelles supérieures', 'Professions intermédiaires',
  'Employés', 'Ouvriers', 'Agriculteurs exploitants',
  "Artisans, commerçants, chefs d'entreprise", 'Retraités',
  'Sans activité professionnelle', 'Autre',
];

// Champs texte optionnels de la page
const CHAMPS_OPTIONNELS: Array<{
  key: string;
  placeholder: string;
  numeric?: boolean;
  maxLen: number;
}> = [
  { key: 'antecedentsFamiliaux',    placeholder: 'Antécédents familiaux',                  maxLen: MAX_LENGTHS.text },
  { key: 'antecedentsMedicaux',     placeholder: 'Antécédents médicaux',                   maxLen: MAX_LENGTHS.text },
  { key: 'antecedentsChirurgicaux', placeholder: 'Antécédents chirurgicaux',               maxLen: MAX_LENGTHS.text },
  { key: 'traitementEnCours',       placeholder: 'Traitement médical en cours',            maxLen: MAX_LENGTHS.text },
  { key: 'allergies',               placeholder: 'Allergies connues',                      maxLen: MAX_LENGTHS.text },
  { key: 'activitePhysique',        placeholder: "Nombre d'heures d'activité physique",   maxLen: 3, numeric: true },
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
            <Text style={[s.inputRowText, { color: Boolean(form.profession) ? COLORS.text : COLORS.textLight }]}>
              {form.profession || 'Cadres et professions intellect...'}
            </Text>
            <Icon name="chevron-down" size={16} color={COLORS.textLight} />
          </TouchableOpacity>

          {/* Fumeur — case verte centrée */}
          <Pressable style={s.checkboxRowCentered} onPress={() => setForm({ ...form, fumeur: !form.fumeur })}>
            <View style={[s.checkbox, form.fumeur && s.checkboxGreen]}>
              {form.fumeur && <Text style={{ color: COLORS.white, fontSize: 12 }}>✓</Text>}
            </View>
            <Text style={[s.checkboxLabel, { flex: 0 }]}>Fumeur</Text>
          </Pressable>

          {/* Taille et poids — champs obligatoires */}
          <TextInput style={[s.input, errors.taille ? s.inputError : null]} placeholder="Votre taille (cm) *"
            placeholderTextColor={COLORS.textLight} keyboardType="numeric" maxLength={3} value={form.taille}
            onChangeText={v => { setForm({ ...form, taille: sanitizeNumeric(v) }); clearError('taille'); }} />
          {errors.taille && <Text style={s.errorText}>⊙ {errors.taille}</Text>}

          <TextInput style={[s.input, errors.poids ? s.inputError : null]} placeholder="Votre poids (kg) *"
            placeholderTextColor={COLORS.textLight} keyboardType="numeric" maxLength={3} value={form.poids}
            onChangeText={v => { setForm({ ...form, poids: sanitizeNumeric(v) }); clearError('poids'); }} />
          {errors.poids && <Text style={s.errorText}>⊙ {errors.poids}</Text>}

          {/* Champs optionnels générés dynamiquement */}
          {CHAMPS_OPTIONNELS.map(({ key, placeholder, numeric, maxLen }) => (
            <TextInput key={key} style={s.input} placeholder={placeholder} placeholderTextColor={COLORS.textLight}
              keyboardType={numeric ? 'numeric' : 'default'}
              maxLength={maxLen}
              value={form[key as keyof typeof form] as string}
              onChangeText={v => setForm({ ...form, [key]: numeric ? sanitizeNumeric(v) : sanitizeText(v) })} />
          ))}

          {/* Remarques — champ multilignes */}
          <TextInput style={[s.input, { minHeight: 80, textAlignVertical: 'top' }]} placeholder="Remarques"
            placeholderTextColor={COLORS.textLight} multiline maxLength={MAX_LENGTHS.text} value={form.remarques}
            onChangeText={v => setForm({ ...form, remarques: sanitizeText(v) })} />

          {/* Bouton suivant */}
          <Pressable style={({ pressed }) => [s.btnPrimarySmall, pressed && s.btnPrimarySmallPressed]}
            onPress={() => { if (validate()) navigateTo('register-step5'); }}>
            {({ pressed }) => <Text style={[s.btnPrimaryText, pressed && s.btnPrimaryTextPressed]}>Suivant</Text>}
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal sélection profession */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)} accessibilityViewIsModal={true}>
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
