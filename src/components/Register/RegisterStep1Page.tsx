import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoAudya from '../../assets/images/logo-audya.svg';
import { registerStyles as s, COLORS } from '../../screens/Register/Register.styles';
import { useNavigation } from '../../context/NavigationContext';
import { useRegister } from '../../context/RegisterContext';
import Bubbles from '../../components/Bubbles';
import { validatePassword } from '../../utils/validators';

type Errors = {
  nom?: string; prenom?: string; email?: string;
  motDePasse?: string; confirmation?: string; cgv?: string;
};

// ─── Composants extraits hors du parent pour éviter le démontage/remontage ───
// Si définis à l'intérieur, React crée un nouveau type à chaque render → perte
// de focus clavier après chaque frappe.

type FieldProps = {
  placeholder: string;
  value: string;
  error?: string;
  secure?: boolean;
  keyboard?: 'email-address';
  onChangeText: (v: string) => void;
};

const Field: React.FC<FieldProps> = ({ placeholder, value, error, secure, keyboard, onChangeText }) => (
  <>
    <TextInput
      style={[s.input, error ? s.inputError : null]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textLight}
      secureTextEntry={secure}
      keyboardType={keyboard}
      autoCapitalize={keyboard === 'email-address' ? 'none' : 'sentences'}
      value={value}
      onChangeText={onChangeText}
    />
    {error && <Text style={s.errorText}>⊙ {error}</Text>}
  </>
);

type PasswordFieldProps = {
  placeholder: string;
  value: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
  onChangeText: (v: string) => void;
};

const PasswordField: React.FC<PasswordFieldProps> = ({ placeholder, value, error, show, onToggle, onChangeText }) => (
  <>
    <View style={[s.inputRow, error ? s.inputError : null]}>
      <TextInput
        style={s.inputRowText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        secureTextEntry={!show}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onToggle}>
        <Text style={s.eyeToggleText}>{show ? 'Cacher' : 'Voir'}</Text>
      </TouchableOpacity>
    </View>
    {error && <Text style={s.errorText}>⊙ {error}</Text>}
  </>
);

// ─────────────────────────────────────────────────────────────────────────────

const RegisterStep1Page = () => {
  const { navigateTo } = useNavigation();
  const { setRegisterData } = useRegister();

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',
    motDePasse: '', confirmation: '',
    cgv: false, contact: 'non' as 'oui' | 'non',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const clearError = (field: keyof Errors) => {
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  // Validation de tous les champs obligatoires avant de passer à l'étape suivante
  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.nom.trim())            e.nom          = 'Veuillez remplir ce champ !';
    if (!form.prenom.trim())         e.prenom       = 'Veuillez remplir ce champ !';
    if (!form.email.trim())          e.email        = 'Veuillez remplir ce champ !';
    const pwdError = validatePassword(form.motDePasse);
    if (pwdError)                    e.motDePasse   = pwdError;
    if (!form.confirmation.trim())   e.confirmation = 'Veuillez remplir ce champ !';
    else if (form.confirmation !== form.motDePasse) e.confirmation = 'Les mots de passe ne correspondent pas';
    if (!form.cgv)                   e.cgv          = 'Vous devez accepter les CGV - CGU';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setRegisterData({ email: form.email, nom: form.nom, prenom: form.prenom });
      navigateTo('register-step1bis');
    }
  };

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <Bubbles />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <LogoAudya width={152} height={81} style={s.logo} />

        <View style={s.card}>
          {/* Badge étape */}
          <View style={s.stepBadgeInCard}>
            <View style={s.stepBadge}><Text style={s.stepBadgeText}>1 sur 5</Text></View>
            <Text style={s.stepLabel}>Étape</Text>
          </View>

          <Text style={s.cardTitleCompact}>Informations de création de compte</Text>
          <Text style={s.cardSubtitle}>*Champs obligatoires</Text>

          {/* Champs identité et email */}
          <Field placeholder="Nom *"    value={form.nom}    error={errors.nom}    onChangeText={v => { setForm({ ...form, nom: v });    clearError('nom'); }} />
          <Field placeholder="Prénom *" value={form.prenom} error={errors.prenom} onChangeText={v => { setForm({ ...form, prenom: v }); clearError('prenom'); }} />
          <Field placeholder="Email *"  value={form.email}  error={errors.email}  keyboard="email-address" onChangeText={v => { setForm({ ...form, email: v }); clearError('email'); }} />

          {/* Mots de passe */}
          <PasswordField placeholder="Mot de passe *"               value={form.motDePasse}   error={errors.motDePasse}   show={showPassword} onToggle={() => setShowPassword(!showPassword)} onChangeText={v => { setForm({ ...form, motDePasse: v });   clearError('motDePasse'); }} />
          <PasswordField placeholder="Confirmation du mot de passe *" value={form.confirmation} error={errors.confirmation} show={showConfirm}  onToggle={() => setShowConfirm(!showConfirm)}  onChangeText={v => { setForm({ ...form, confirmation: v }); clearError('confirmation'); }} />

          {/* Acceptation CGV */}
          <TouchableOpacity style={s.checkboxRow} onPress={() => { setForm({ ...form, cgv: !form.cgv }); clearError('cgv'); }} activeOpacity={0.7}>
            <View style={[s.radioCircle, form.cgv && s.radioCircleSelected]}>
              {form.cgv && <View style={s.radioDot} />}
            </View>
            <Text style={s.checkboxLabel}>J'accepte les CGV - CGU *</Text>
          </TouchableOpacity>
          {errors.cgv && <Text style={s.errorText}>⊙ {errors.cgv}</Text>}

          {/* Consentement contact AUDYA */}
          <Text style={s.consentLabel}>J'accepte d'être contacté par AUDYA pour des enquêtes et évaluation de l'usage</Text>
          <View style={s.radioRow}>
            {(['oui', 'non'] as const).map(val => (
              <TouchableOpacity key={val} style={s.radioOption} onPress={() => setForm({ ...form, contact: val })} activeOpacity={0.7}>
                <View style={[s.radioCircle, form.contact === val && s.radioCircleSelected]}>
                  {form.contact === val && <View style={s.radioDot} />}
                </View>
                <Text style={s.radioText}>{val.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bouton suivant */}
          <Pressable style={({ pressed }) => [s.btnPrimarySmall, pressed && s.btnPrimarySmallPressed]} onPress={handleSubmit}>
            {({ pressed }) => <Text style={[s.btnPrimaryText, pressed && s.btnPrimaryTextPressed]}>Suivant</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterStep1Page;
