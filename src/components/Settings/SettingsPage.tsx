import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles, COLORS } from '../../screens/Settings/SettingsScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import {
  UserSettings,
  fetchSettings,
  saveSettings,
  changePassword,
  deleteAccount,
  USE_SETTINGS_API,
} from '../../services/settingsService';
import { validatePassword } from '../../utils/validators';
import { useNavigation } from '../../context/NavigationContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import AnimatedDropdown from '../common/AnimatedDropdown/AnimatedDropdown';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
/**
 * Données mock utilisées tant que GET /api/patient/settings n'est pas disponible.
 * ⚠️  À supprimer dès que l'endpoint est opérationnel.
 */
const MOCK_SETTINGS: UserSettings = {
  language: 'FR',
  dateFormat: 'JJ/MM/AAAA',
  timeFormat: '24h',
  notificationsMessages: true,
  notificationsAlerts: true,
  notificationsTasks: false,
};

// ─── Preference options ────────────────────────────────────────────────────────
const LANGUAGE_OPTIONS: Language[] = ['FR', 'EN', 'ES', 'TH', 'AR', 'HY', 'RU', 'TR'];
const DATE_FORMAT_OPTIONS = ['JJ/MM/AAAA', 'MM/JJ/AAAA', 'AAAA/MM/JJ'];
const TIME_FORMAT_OPTIONS = ['24h', '12h'];

// ─── Eye Icon (password visibility toggle) ────────────────────────────────────
const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Icon
    name={visible ? 'eye-outline' : 'eye-off-outline'}
    size={20}
    color={COLORS.textLighter}
  />
);

// ─── Password Rule (live validation row) ──────────────────────────────────────
const PasswordRule = ({ met, label }: { met: boolean; label: string }) => (
  <View style={styles.pwdRuleRow}>
    <Icon
      name={met ? 'checkmark-circle' : 'ellipse-outline'}
      size={14}
      color={met ? '#2E7D32' : COLORS.textLighter}
    />
    <Text style={[styles.pwdRuleText, met && styles.pwdRuleTextValid]}>
      {label}
    </Text>
  </View>
);

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Page Paramètres : préférences utilisateur (langue, formats), notifications,
 * changement de mot de passe et suppression de compte.
 *
 * Suit le pattern USE_API défini dans CLAUDE.md :
 * - USE_SETTINGS_API = false → données mock
 * - USE_SETTINGS_API = true  → appels API via settingsService
 */
const SettingsPage = () => {
  const { goHome } = useNavigation();
  const { t, setLanguage } = useLanguage();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ── Password state ──────────────────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ── Dropdown state ──────────────────────────────────────────────────────────
  const [langOpen, setLangOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ── Load settings on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (USE_SETTINGS_API) {
          const data = await fetchSettings();
          setSettings(data);
        } else {
          setSettings({ ...MOCK_SETTINGS });
        }
      } catch {
        Alert.alert('Erreur', t('error.load'));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => {
    if (!settings) {
      return;
    }
    setSettings({ ...settings, [key]: value });
  };

  const passwordsMatch = newPassword === confirmPassword;
  const pwdHasMinLength = newPassword.length >= 8;
  const pwdHasUppercase = /[A-Z]/.test(newPassword);
  const pwdHasDigit = /\d/.test(newPassword);
  const pwdHasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isPasswordValid = validatePassword(newPassword) === null;
  const canChangePassword =
    newPassword.length > 0 && confirmPassword.length > 0 && passwordsMatch && isPasswordValid;
  const showPasswordMismatch =
    newPassword.length > 0 && confirmPassword.length > 0 && !passwordsMatch;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    if (!settings) {
      return;
    }
    setIsSaving(true);
    try {
      if (USE_SETTINGS_API) {
        await saveSettings(settings);
      }
      // TODO: afficher un toast de confirmation
    } catch {
      Alert.alert('Erreur', t('error.save'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!canChangePassword) {
      return;
    }
    setIsChangingPassword(true);
    try {
      if (USE_SETTINGS_API) {
        await changePassword(newPassword);
      }
      setNewPassword('');
      setConfirmPassword('');
      // TODO: afficher un toast de confirmation
    } catch {
      Alert.alert('Erreur', t('error.password'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    try {
      if (USE_SETTINGS_API) {
        await deleteAccount();
      }
      goHome();
    } catch {
      Alert.alert('Erreur', t('error.delete'));
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Titre ── */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{t('settings.title')}</Text>
        </View>

        {isLoading || !settings ? (
          <ActivityIndicator
            size="large"
            color={COLORS.orange}
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            {/* ── Préférences : langue / format date / format heure ── */}
            <View style={[styles.sectionCard, { zIndex: 10 }]}>
              <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
              {/* Ligne 1 : Langue + Date */}
              <View style={styles.prefsRow}>

                {/* Dropdown Langue */}
                <View style={styles.prefDropdownWrapper}>
                  <Text style={styles.prefDropdownLabel}>{t('settings.language')}</Text>
                  <TouchableOpacity
                    style={[
                      styles.prefDropdownButton,
                      langOpen && styles.prefDropdownButtonOpen,
                    ]}
                    onPress={() => {
                      setLangOpen(v => !v);
                      setDateOpen(false);
                      setTimeOpen(false);
                    }}
                    activeOpacity={0.7}
                    testID="langDropdown"
                  >
                    <Text style={styles.prefDropdownValue}>{settings.language}</Text>
                    <Text style={styles.prefDropdownChevron}>▼</Text>
                  </TouchableOpacity>
                  <AnimatedDropdown visible={langOpen} absolute>
                    <View style={styles.prefDropdownMenu}>
                      {LANGUAGE_OPTIONS.map((opt, i) => (
                        <TouchableOpacity
                          key={opt}
                          style={[
                            styles.prefDropdownItem,
                            i === LANGUAGE_OPTIONS.length - 1 && styles.prefDropdownItemLast,
                          ]}
                          onPress={() => {
                            updateSetting('language', opt);
                            setLanguage(opt);
                            setLangOpen(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.prefDropdownItemText,
                              settings.language === opt && styles.prefDropdownItemTextActive,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </AnimatedDropdown>
                </View>

                {/* Dropdown Format date */}
                <View style={styles.prefDropdownWrapper}>
                  <Text style={styles.prefDropdownLabel}>{t('settings.date')}</Text>
                  <TouchableOpacity
                    style={[
                      styles.prefDropdownButton,
                      dateOpen && styles.prefDropdownButtonOpen,
                    ]}
                    onPress={() => {
                      setDateOpen(v => !v);
                      setLangOpen(false);
                      setTimeOpen(false);
                    }}
                    activeOpacity={0.7}
                    testID="dateDropdown"
                  >
                    <Text style={styles.prefDropdownValue}>{settings.dateFormat}</Text>
                    <Text style={styles.prefDropdownChevron}>▼</Text>
                  </TouchableOpacity>
                  <AnimatedDropdown visible={dateOpen} absolute>
                    <View style={styles.prefDropdownMenu}>
                      {DATE_FORMAT_OPTIONS.map((opt, i) => (
                        <TouchableOpacity
                          key={opt}
                          style={[
                            styles.prefDropdownItem,
                            i === DATE_FORMAT_OPTIONS.length - 1 && styles.prefDropdownItemLast,
                          ]}
                          onPress={() => {
                            updateSetting('dateFormat', opt);
                            setDateOpen(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.prefDropdownItemText,
                              settings.dateFormat === opt && styles.prefDropdownItemTextActive,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </AnimatedDropdown>
                </View>

              </View>

              {/* Ligne 2 : Heure */}
              <View style={[styles.prefsRow, { marginTop: 12 }]}>

                {/* Dropdown Format heure */}
                <View style={styles.prefDropdownWrapper}>
                  <Text style={styles.prefDropdownLabel}>{t('settings.time')}</Text>
                  <TouchableOpacity
                    style={[
                      styles.prefDropdownButton,
                      timeOpen && styles.prefDropdownButtonOpen,
                    ]}
                    onPress={() => {
                      setTimeOpen(v => !v);
                      setLangOpen(false);
                      setDateOpen(false);
                    }}
                    activeOpacity={0.7}
                    testID="timeDropdown"
                  >
                    <Text style={styles.prefDropdownValue}>{settings.timeFormat}</Text>
                    <Text style={styles.prefDropdownChevron}>▼</Text>
                  </TouchableOpacity>
                  <AnimatedDropdown visible={timeOpen} absolute>
                    <View style={styles.prefDropdownMenu}>
                      {TIME_FORMAT_OPTIONS.map((opt, i) => (
                        <TouchableOpacity
                          key={opt}
                          style={[
                            styles.prefDropdownItem,
                            i === TIME_FORMAT_OPTIONS.length - 1 && styles.prefDropdownItemLast,
                          ]}
                          onPress={() => {
                            updateSetting('timeFormat', opt);
                            setTimeOpen(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.prefDropdownItemText,
                              settings.timeFormat === opt && styles.prefDropdownItemTextActive,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </AnimatedDropdown>
                </View>

                {/* Spacer : aligne Heure sur la même largeur que Langue et Date */}
                <View style={styles.prefDropdownWrapper} />

              </View>
            </View>

            {/* ── NOTIFICATIONS ── */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>

              <View style={styles.notifRow}>
                <Text style={styles.notifLabel}>{t('settings.notif.messages')}</Text>
                <Switch
                  value={settings.notificationsMessages}
                  onValueChange={v => updateSetting('notificationsMessages', v)}
                  trackColor={{ false: COLORS.border, true: COLORS.teal }}
                  thumbColor={COLORS.white}
                  testID="switchMessages"
                  accessibilityLabel="Notifications de messages"
                  accessibilityRole="switch"
                />
              </View>

              <View style={styles.notifRow}>
                <Text style={styles.notifLabel}>{t('settings.notif.alerts')}</Text>
                <Switch
                  value={settings.notificationsAlerts}
                  onValueChange={v => updateSetting('notificationsAlerts', v)}
                  trackColor={{ false: COLORS.border, true: COLORS.teal }}
                  thumbColor={COLORS.white}
                  testID="switchAlerts"
                  accessibilityLabel="Notifications d'alertes"
                  accessibilityRole="switch"
                />
              </View>

              <View style={[styles.notifRow, styles.notifRowLast]}>
                <Text style={styles.notifLabel}>{t('settings.notif.tasks')}</Text>
                <Switch
                  value={settings.notificationsTasks}
                  onValueChange={v => updateSetting('notificationsTasks', v)}
                  trackColor={{ false: COLORS.border, true: COLORS.teal }}
                  thumbColor={COLORS.white}
                  testID="switchTasks"
                  accessibilityLabel="Notifications de tâches"
                  accessibilityRole="switch"
                />
              </View>
            </View>

            {/* ── MON MOT DE PASSE ── */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('settings.password')}</Text>

              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('settings.password.new')}
                  placeholderTextColor={COLORS.textLighter}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  maxLength={128}
                  testID="newPasswordInput"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(v => !v)}
                  accessibilityLabel={
                    showNewPassword
                      ? t('settings.password.hide')
                      : t('settings.password.show')
                  }
                >
                  <EyeIcon visible={showNewPassword} />
                </TouchableOpacity>
              </View>

              {newPassword.length > 0 && (
                <View style={styles.pwdRulesContainer}>
                  <PasswordRule met={pwdHasMinLength} label="8 caractères minimum" />
                  <PasswordRule met={pwdHasUppercase} label="1 lettre majuscule" />
                  <PasswordRule met={pwdHasDigit} label="1 chiffre" />
                  <PasswordRule met={pwdHasSpecial} label="1 caractère spécial" />
                </View>
              )}

              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('settings.password.confirm')}
                  placeholderTextColor={COLORS.textLighter}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  maxLength={128}
                  testID="confirmPasswordInput"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(v => !v)}
                  accessibilityLabel={
                    showConfirmPassword
                      ? t('settings.password.hideConfirm')
                      : t('settings.password.showConfirm')
                  }
                >
                  <EyeIcon visible={showConfirmPassword} />
                </TouchableOpacity>
              </View>

              {showPasswordMismatch && (
                <Text style={styles.passwordMismatch} testID="passwordMismatchError">
                  {t('settings.password.mismatch')}
                </Text>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.ctaPrimary,
                  pressed && !(!canChangePassword || isChangingPassword) && styles.ctaPrimaryPressed,
                  (!canChangePassword || isChangingPassword) && styles.outlineButtonDisabled,
                ]}
                onPress={handleChangePassword}
                disabled={!canChangePassword || isChangingPassword}
                testID="changePasswordButton"
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.ctaPrimaryText,
                      pressed && !(!canChangePassword || isChangingPassword) && styles.ctaPrimaryTextPressed,
                      (!canChangePassword || isChangingPassword) && styles.outlineButtonTextDisabled,
                    ]}
                  >
                    {isChangingPassword ? t('settings.password.changing') : t('settings.password.change')}
                  </Text>
                )}
              </Pressable>
            </View>

            {/* ── MON COMPTE ── */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('settings.account')}</Text>

              <TouchableOpacity
                style={styles.ctaSecondary}
                onPress={() => setShowDeleteModal(true)}
                activeOpacity={0.7}
                testID="deleteAccountButton"
              >
                <Text style={styles.ctaSecondaryText}>{t('settings.account.delete')}</Text>
              </TouchableOpacity>
            </View>

            {/* ── Enregistrer les modifications ── */}
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && !isSaving && styles.saveButtonPressed,
              ]}
              onPress={handleSaveSettings}
              disabled={isSaving}
              testID="saveSettingsButton"
            >
              {({ pressed }) => (
                <Text style={[styles.saveButtonText, pressed && !isSaving && styles.saveButtonTextPressed]}>
                  {isSaving ? t('settings.saving') : t('settings.save')}
                </Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>

      <BottomNav />

      {/* ── Modal de confirmation de suppression de compte ── */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        {/* Overlay : ferme le modal au clic en dehors */}
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDeleteModal(false)}
        >
          {/* Carte interne : stoppe la propagation du tap vers l'overlay */}
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalText}>
              {t('modal.delete.text')}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.7}
                testID="cancelDeleteButton"
              >
                <Text style={styles.modalCancelText}>{t('modal.delete.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
                testID="confirmDeleteButton"
              >
                <Text style={styles.modalConfirmText}>{t('modal.delete.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsPage;
