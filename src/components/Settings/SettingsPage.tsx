import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
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
import Svg, { Path } from 'react-native-svg';
import { styles, COLORS } from '../../screens/Settings/SettingsScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import {
  UserSettings,
  fetchSettings,
  saveSettings,
  changePassword,
  deleteAccount,
} from '../../services/settingsService';
import { useNavigation } from '../../context/NavigationContext';

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

/** Passer à true dès que GET/PATCH /api/patient/settings est disponible */
const USE_API = false;

// ─── Preference options ────────────────────────────────────────────────────────
const LANGUAGE_OPTIONS = ['FR', 'EN'];
const DATE_FORMAT_OPTIONS = ['JJ/MM/AAAA', 'MM/JJ/AAAA', 'AAAA/MM/JJ'];
const TIME_FORMAT_OPTIONS = ['24h', '12h'];

// ─── Eye Icon (password visibility toggle) ────────────────────────────────────
const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    {visible ? (
      <Path
        // eye open
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
        fill={COLORS.textLighter}
      />
    ) : (
      <Path
        // eye closed / off
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
        fill={COLORS.textLighter}
      />
    )}
  </Svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Page Paramètres : préférences utilisateur (langue, formats), notifications,
 * changement de mot de passe et suppression de compte.
 *
 * Suit le pattern USE_API défini dans CLAUDE.md :
 * - USE_API = false → données mock
 * - USE_API = true  → appels API via settingsService
 */
const SettingsPage = () => {
  const { goHome } = useNavigation();

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
        if (USE_API) {
          const data = await fetchSettings();
          setSettings(data);
        } else {
          setSettings({ ...MOCK_SETTINGS });
        }
      } catch (err) {
        console.error('Erreur chargement paramètres:', err);
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
  const canChangePassword =
    newPassword.length > 0 && confirmPassword.length > 0 && passwordsMatch;
  const showPasswordMismatch =
    newPassword.length > 0 && confirmPassword.length > 0 && !passwordsMatch;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    if (!settings) {
      return;
    }
    setIsSaving(true);
    try {
      if (USE_API) {
        await saveSettings(settings);
      }
      // TODO: afficher un toast de confirmation
    } catch (err) {
      console.error('Erreur sauvegarde paramètres:', err);
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
      if (USE_API) {
        await changePassword(newPassword);
      }
      setNewPassword('');
      setConfirmPassword('');
      // TODO: afficher un toast de confirmation
    } catch (err) {
      console.error('Erreur changement mot de passe:', err);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    try {
      if (USE_API) {
        await deleteAccount();
      }
      goHome();
    } catch (err) {
      console.error('Erreur suppression compte:', err);
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
          <Text style={styles.title}>MES PARAMÈTRES</Text>
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
              <Text style={styles.sectionTitle}>Préférences</Text>
              {/* Ligne 1 : Langue + Date */}
              <View style={styles.prefsRow}>

                {/* Dropdown Langue */}
                <View style={styles.prefDropdownWrapper}>
                  <Text style={styles.prefDropdownLabel}>Langue</Text>
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
                  {langOpen && (
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
                  )}
                </View>

                {/* Dropdown Format date */}
                <View style={styles.prefDropdownWrapper}>
                  <Text style={styles.prefDropdownLabel}>Date</Text>
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
                  {dateOpen && (
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
                  )}
                </View>

              </View>

              {/* Ligne 2 : Heure */}
              <View style={[styles.prefsRow, { marginTop: 12 }]}>

                {/* Dropdown Format heure */}
                <View style={styles.prefDropdownWrapper}>
                  <Text style={styles.prefDropdownLabel}>Heure</Text>
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
                  {timeOpen && (
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
                  )}
                </View>

                {/* Spacer : aligne Heure sur la même largeur que Langue et Date */}
                <View style={styles.prefDropdownWrapper} />

              </View>
            </View>

            {/* ── NOTIFICATIONS ── */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Notifications</Text>

              <View style={styles.notifRow}>
                <Text style={styles.notifLabel}>Notifications de messages</Text>
                <Switch
                  value={settings.notificationsMessages}
                  onValueChange={v => updateSetting('notificationsMessages', v)}
                  trackColor={{ false: COLORS.border, true: COLORS.teal }}
                  thumbColor={COLORS.white}
                  testID="switchMessages"
                />
              </View>

              <View style={styles.notifRow}>
                <Text style={styles.notifLabel}>Notifications d'alertes</Text>
                <Switch
                  value={settings.notificationsAlerts}
                  onValueChange={v => updateSetting('notificationsAlerts', v)}
                  trackColor={{ false: COLORS.border, true: COLORS.teal }}
                  thumbColor={COLORS.white}
                  testID="switchAlerts"
                />
              </View>

              <View style={[styles.notifRow, styles.notifRowLast]}>
                <Text style={styles.notifLabel}>Notifications de tâches</Text>
                <Switch
                  value={settings.notificationsTasks}
                  onValueChange={v => updateSetting('notificationsTasks', v)}
                  trackColor={{ false: COLORS.border, true: COLORS.teal }}
                  thumbColor={COLORS.white}
                  testID="switchTasks"
                />
              </View>
            </View>

            {/* ── MON MOT DE PASSE ── */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Mon mot de passe</Text>

              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Nouveau mot de passe"
                  placeholderTextColor={COLORS.textLighter}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  testID="newPasswordInput"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(v => !v)}
                  accessibilityLabel={
                    showNewPassword
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  }
                >
                  <EyeIcon visible={showNewPassword} />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirmation du mot de passe"
                  placeholderTextColor={COLORS.textLighter}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  testID="confirmPasswordInput"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(v => !v)}
                  accessibilityLabel={
                    showConfirmPassword
                      ? 'Masquer la confirmation'
                      : 'Afficher la confirmation'
                  }
                >
                  <EyeIcon visible={showConfirmPassword} />
                </TouchableOpacity>
              </View>

              {showPasswordMismatch && (
                <Text style={styles.passwordMismatch} testID="passwordMismatchError">
                  Les mots de passe ne correspondent pas.
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.outlineButton,
                  (!canChangePassword || isChangingPassword) &&
                    styles.outlineButtonDisabled,
                ]}
                onPress={handleChangePassword}
                disabled={!canChangePassword || isChangingPassword}
                activeOpacity={0.7}
                testID="changePasswordButton"
              >
                <Text
                  style={[
                    styles.outlineButtonText,
                    (!canChangePassword || isChangingPassword) &&
                      styles.outlineButtonTextDisabled,
                  ]}
                >
                  {isChangingPassword ? 'Modification…' : 'Modifier le mot de passe'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── MON COMPTE ── */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Mon compte</Text>

              <TouchableOpacity
                style={styles.dangerButton}
                onPress={() => setShowDeleteModal(true)}
                activeOpacity={0.7}
                testID="deleteAccountButton"
              >
                <Text style={styles.dangerButtonText}>Supprimer mon compte</Text>
              </TouchableOpacity>
            </View>

            {/* ── Enregistrer les modifications ── */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSettings}
              disabled={isSaving}
              activeOpacity={0.8}
              testID="saveSettingsButton"
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Enregistrement…' : 'Enregistrer les modifications'}
              </Text>
            </TouchableOpacity>
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
              Voulez-vous vraiment supprimer votre compte ?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.7}
                testID="cancelDeleteButton"
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
                testID="confirmDeleteButton"
              >
                <Text style={styles.modalConfirmText}>Oui</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsPage;
