import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LogoAudya from '../../assets/images/logo-audya.svg';
import { registerStyles as s, COLORS } from '../../screens/Register/Register.styles';
import { useNavigation } from '../../context/NavigationContext';
import { useRegister, PRIVACY_POLICY_VERSION } from '../../context/RegisterContext';
import Bubbles from '../../components/Bubbles';
import { validatePassword, isValidEmail, ERROR_MESSAGES, sanitizeName, sanitizeEmail, MAX_LENGTHS } from '../../utils/validators';

const CGU_URL = 'https://audya.com/cgu';
const PRIVACY_URL = 'https://audya.com/politique-de-confidentialite';

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
  maxLen?: number;
  onChangeText: (v: string) => void;
};

const Field: React.FC<FieldProps> = ({ placeholder, value, error, secure, keyboard, maxLen, onChangeText }) => (
  <>
    <TextInput
      style={[s.input, error ? s.inputError : null]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textLight}
      secureTextEntry={secure}
      keyboardType={keyboard}
      autoCapitalize={keyboard === 'email-address' ? 'none' : 'sentences'}
      maxLength={maxLen}
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
      <TouchableOpacity onPress={onToggle} accessibilityLabel={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} accessibilityRole="button">
        <Icon name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textLight} />
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
    else if (!isValidEmail(form.email.trim())) e.email = ERROR_MESSAGES.EMAIL_INVALID;
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
      // RGPD Art. 7 — preuve du consentement : timestamp + version du document
      // Ces deux champs DOIVENT être transmis au backend lors de l'inscription.
      setRegisterData({
        email: form.email,
        nom: form.nom,
        prenom: form.prenom,
        cgvAccepted: true,
        cgvAcceptedAt: new Date().toISOString(),
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      });
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
          <Field placeholder="Nom *"    value={form.nom}    error={errors.nom}    maxLen={MAX_LENGTHS.name}  onChangeText={v => { setForm({ ...form, nom: sanitizeName(v) });    clearError('nom'); }} />
          <Field placeholder="Prénom *" value={form.prenom} error={errors.prenom} maxLen={MAX_LENGTHS.name}  onChangeText={v => { setForm({ ...form, prenom: sanitizeName(v) }); clearError('prenom'); }} />
          <Field placeholder="Email *"  value={form.email}  error={errors.email}  keyboard="email-address" maxLen={MAX_LENGTHS.email} onChangeText={v => { setForm({ ...form, email: sanitizeEmail(v) }); clearError('email'); }} />

          {/* Mots de passe */}
          <PasswordField placeholder="Mot de passe *"               value={form.motDePasse}   error={errors.motDePasse}   show={showPassword} onToggle={() => setShowPassword(!showPassword)} onChangeText={v => { setForm({ ...form, motDePasse: v });   clearError('motDePasse'); }} />
          <PasswordField placeholder="Confirmation du mot de passe *" value={form.confirmation} error={errors.confirmation} show={showConfirm}  onToggle={() => setShowConfirm(!showConfirm)}  onChangeText={v => { setForm({ ...form, confirmation: v }); clearError('confirmation'); }} />

          {/* Acceptation CGU + politique de confidentialité (RGPD Art. 7) */}
          <Pressable style={s.checkboxRow} onPress={() => { setForm({ ...form, cgv: !form.cgv }); clearError('cgv'); }}>
            <View style={[s.radioCircle, form.cgv && s.radioCircleSelected]}>
              {form.cgv && <View style={s.radioDot} />}
            </View>
            <Text style={s.checkboxLabel}>
              J'accepte les{' '}
              <Text
                style={s.linkText}
                onPress={() => Linking.openURL(CGU_URL)}
                accessibilityRole="link"
              >
                CGU
              </Text>
              {' '}et la{' '}
              <Text
                style={s.linkText}
                onPress={() => Linking.openURL(PRIVACY_URL)}
                accessibilityRole="link"
              >
                politique de confidentialité
              </Text>
              {' *'}
            </Text>
          </Pressable>
          {errors.cgv && <Text style={s.errorText}>⊙ {errors.cgv}</Text>}

          {/* Consentement contact AUDYA */}
          <Text style={s.consentLabel}>J'accepte d'être contacté par AUDYA pour des enquêtes et évaluation de l'usage</Text>
          <View style={s.radioRow}>
            {(['oui', 'non'] as const).map(val => (
              <Pressable key={val} style={s.radioOption} onPress={() => setForm({ ...form, contact: val })}>
                <View style={[s.radioCircle, form.contact === val && s.radioCircleSelected]}>
                  {form.contact === val && <View style={s.radioDot} />}
                </View>
                <Text style={s.radioText}>{val.toUpperCase()}</Text>
              </Pressable>
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
