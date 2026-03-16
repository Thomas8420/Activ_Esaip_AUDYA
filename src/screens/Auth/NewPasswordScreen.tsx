import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LogoAudya from '../../assets/images/logo-audya.svg';
import AuthButton from '../../components/auth/Button';
import {newPasswordScreenStyles as styles} from './NewPasswordScreen.styles';
import {useNewPassword} from './UseNewPassword';
import {resetPassword} from '../../services/authService';
import {ApiError} from '../../services/api';

type Props = {
  onSuccess: () => void;
};

/**
 * Écran de saisie du nouveau mot de passe.
 * Inclut validation CGV et consentement contact AUDYA.
 */
const NewPasswordScreen: React.FC<Props> = ({onSuccess}) => {
  const form = useNewPassword();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async () => {
    if (!form.validate()) return;
    setServerError('');
    setLoading(true);
    try {
      // Le token sera passé depuis le lien email en production
      await resetPassword('', form.password, form.confirmPassword);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <LogoAudya width={200} height={80} />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Nouveau mot de passe</Text>

          {(['password', 'confirmPassword'] as const).map(field => (
            <View key={field}>
              <View
                style={[
                  styles.inputContainer,
                  form.errors[field] ? styles.inputError : null,
                ]}>
                <TextInput
                  style={styles.input}
                  placeholder={
                    field === 'password'
                      ? 'Nouveau mot de passe *'
                      : 'Confirmation du mot de passe *'
                  }
                  placeholderTextColor="#999"
                  value={form[field]}
                  onChangeText={t => {
                    (field === 'password'
                      ? form.setPassword
                      : form.setConfirmPassword)(t);
                    form.clearError(field);
                  }}
                  secureTextEntry={
                    field === 'password'
                      ? !form.showPassword
                      : !form.showConfirmPassword
                  }
                />
                <TouchableOpacity
                  onPress={() =>
                    (field === 'password'
                      ? form.setShowPassword
                      : form.setShowConfirmPassword)(v => !v)
                  }
                  style={styles.eyeBtn}>
                  <Icon
                    name={
                      (field === 'password'
                        ? form.showPassword
                        : form.showConfirmPassword)
                        ? 'eye-outline'
                        : 'eye-off-outline'
                    }
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {form.errors[field] ? (
                <Text style={styles.errorText}>{form.errors[field]}</Text>
              ) : null}
            </View>
          ))}

          {/* Checkbox CGV */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => {
              form.setAcceptCGV(v => !v);
              form.clearError('cgv');
            }}
            activeOpacity={0.7}>
            <View
              style={[
                styles.checkbox,
                form.acceptCGV && styles.checkboxChecked,
              ]}>
              {form.acceptCGV && <View style={styles.checkmark} />}
            </View>
            <Text style={styles.checkboxLabel}>J'accepte les CGV - CGU *</Text>
          </TouchableOpacity>
          {form.errors.cgv ? (
            <Text style={styles.errorText}>{form.errors.cgv}</Text>
          ) : null}

          {/* Contact */}
          <Text style={styles.contactLabel}>
            J'accepte d'être contacté par AUDYA pour des enquêtes et
            évaluation de l'usage
          </Text>
          <View style={styles.radioRow}>
            {['oui', 'non'].map(val => (
              <TouchableOpacity
                key={val}
                style={styles.radioOption}
                onPress={() => {
                  form.setContact(val);
                  form.clearError('contact');
                }}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.radioCircle,
                    form.contact === val && styles.radioCircleSelected,
                  ]}>
                  {form.contact === val && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{val.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {form.errors.contact ? (
            <Text style={styles.errorText}>{form.errors.contact}</Text>
          ) : null}

          {serverError ? (
            <Text style={[styles.errorText, {textAlign: 'center'}]}>
              {serverError}
            </Text>
          ) : null}

          <AuthButton
            title="Valider le nouveau mot de passe"
            onPress={handleSubmit}
            variant="validatePwd"
            loading={loading}
            style={styles.submitButton}
          />

          <Text style={styles.infoText}>
            Après la création de votre nouveau mot de passe, vous serez invité
            à vous reconnecter.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewPasswordScreen;
