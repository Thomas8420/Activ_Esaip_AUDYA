import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker, { types as DocumentTypes } from 'react-native-document-picker';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import BottomSheetModal from '../common/BottomSheetModal/BottomSheetModal';
import { styles, COLORS } from '../../screens/Health/HealthScreen.styles';
import { fetchPatientHealth, PatientHealth, USE_HEALTH_API } from '../../services/healthService';
import { sanitizeName, sanitizeNumeric, MAX_LENGTHS } from '../../utils/validators';
import QrCode from '../../assets/images/qr-code.svg';
import { useLanguage } from '../../context/LanguageContext';

// ─── Mock Data (remove once API is ready) ────────────────────────────────────
const MOCK_HEALTH: PatientHealth = {
  fullName: 'Roger Duroc',
  age: 71,
  gender: 'Homme',
  addressLine: '76 cours gambetta',
  cityZip: '69007 Lyon',
  bmi: 23.25,
  sex: 'Homme',
  smoker: 'Oui',
  heightCm: 182,
  weightKg: 77,
  familyHistory: 'bllblblblbllblb',
  medicalHistory: ['Adenome de la prostate'],
  documents: [
    'IRM CEREBRALE1712072758.png',
    'IRM CEREBRALE1712072758.png',
    'IRM CEREBRALE1712072758.png',
  ],
};

// ─── Options sélecteur — niveau module (jamais dans le corps du composant) ────
const SEX_OPTIONS = ['Homme', 'Femme', 'Autre'] as const;
const SMOKER_OPTIONS = ['Oui', 'Non', 'Ancien fumeur'] as const;

/**
 * Page Ma sante : resume de l'etat de sante + informations generales.
 */
const HealthPage = () => {
  const { t } = useLanguage();
  const [health, setHealth] = useState<PatientHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'sex' | 'smoker' | null>(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'familyHistory' | 'medicalHistory' | null>(null);
  const [antecedentName, setAntecedentName] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (USE_HEALTH_API) {
          const data = await fetchPatientHealth();
          setHealth(data);
        } else {
          setHealth({ ...MOCK_HEALTH });
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const calculateBMI = (weight: number, height: number) => {
    if (height > 0) {
      return weight / ((height / 100) * (height / 100));
    }
    return 0;
  };

  const handleUpdateField = (key: keyof PatientHealth, value: any) => {
    setHealth(prev => {
      if (!prev) {return prev;}
      const updated = { ...prev, [key]: value };

      // Sync gender if sex is changed
      if (key === 'sex') {
        updated.gender = value;
      }

      // Recalculate BMI if height or weight changes
      if (key === 'heightCm' || key === 'weightKg') {
        const h = key === 'heightCm' ? Number(value) : prev.heightCm;
        const w = key === 'weightKg' ? Number(value) : prev.weightKg;
        updated.bmi = calculateBMI(w, h);
      }

      return updated;
    });
  };

  const handleOpenUploadModal = (target: 'familyHistory' | 'medicalHistory') => {
    setUploadTarget(target);
    setAntecedentName('');
    setSelectedFile(null);
    setIsUploadModalVisible(true);
  };

  const handleCloseModal = () => {
    setAntecedentName('');
    setSelectedFile(null);
    setIsUploadModalVisible(false);
  };

  const handlePickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentTypes.pdf, DocumentTypes.doc, DocumentTypes.docx, DocumentTypes.plainText, DocumentTypes.images],
        allowMultiSelection: false,
      });
      const file = results[0];
      setSelectedFile({ name: file.name ?? 'document' });
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Erreur', 'Impossible de sélectionner le document.');
      }
    }
  };

  const handleValidateAntecedent = () => {
    if (!health || !antecedentName.trim()) { return; }
    setHealth(prev => {
      if (!prev) { return prev; }
      const updated = { ...prev };
      if (uploadTarget === 'familyHistory') {
        const items = prev.familyHistory ? prev.familyHistory.split('\n').filter(Boolean) : [];
        items.push(antecedentName.trim());
        updated.familyHistory = items.join('\n');
      } else {
        updated.medicalHistory = [...prev.medicalHistory, antecedentName.trim()];
      }
      if (selectedFile) {
        updated.documents = [...prev.documents, selectedFile.name];
      }
      return updated;
    });
    handleCloseModal();
  };

  const bmiValue = useMemo(() => {
    if (!health) {
      return '';
    }
    return health.bmi.toFixed(2);
  }, [health]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {isLoading || !health ? (
          <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTopTitle}>{t('screen.health')}</Text>

              {/* Identité + adresse + IMC aligné sur toute la hauteur */}
              <View style={styles.summaryIdentityRow}>
                <View style={styles.summaryAvatar}>
                  <Text style={styles.summaryAvatarText}>
                    {health.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                  </Text>
                </View>
                <View style={styles.summaryNameBlock}>
                  <Text style={styles.summaryName}>{health.fullName}</Text>
                  <View style={styles.summaryChips}>
                    <View style={styles.summaryChip}>
                      <Text style={styles.summaryChipText}>{health.age} ans</Text>
                    </View>
                    <View style={styles.summaryChip}>
                      <Text style={styles.summaryChipText}>{health.gender}</Text>
                    </View>
                  </View>
                  <View style={styles.summaryAddressRow}>
                    <Icon name="location-outline" size={13} color={COLORS.textLighter} />
                    <Text style={styles.summaryAddressText}>
                      {health.addressLine} · {health.cityZip}
                    </Text>
                  </View>
                </View>
                <View style={styles.bmiBlock}>
                  <View style={styles.bmiCircle}>
                    <Text style={styles.bmiValue}>{bmiValue}</Text>
                  </View>
                  <Text style={styles.bmiLabel}>Mon IMC</Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              {/* QR Code */}
              <View style={styles.qrCodeContainer}>
                <QrCode width={110} height={110} />
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('health.section.general')}</Text>

              {/* Informations corporelles */}
              <View style={styles.twoColumnRow}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Taille (cm)</Text>
                  <TextInput
                    value={health.heightCm === 0 ? '' : String(health.heightCm)}
                    onChangeText={(val) => handleUpdateField('heightCm', sanitizeNumeric(val))}
                    keyboardType="numeric"
                    maxLength={3}
                    style={styles.textInputReadonly}
                  />
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Poids (kg)</Text>
                  <TextInput
                    value={health.weightKg === 0 ? '' : String(health.weightKg)}
                    onChangeText={(val) => handleUpdateField('weightKg', sanitizeNumeric(val))}
                    keyboardType="numeric"
                    maxLength={3}
                    style={styles.textInputReadonly}
                  />
                </View>
              </View>

              <View style={styles.twoColumnRow}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Sexe</Text>
                  <TouchableOpacity
                    style={styles.fieldValuePill}
                    onPress={() => setActiveModal('sex')}
                    activeOpacity={0.7}
                    accessibilityLabel="Sexe"
                    accessibilityRole="button"
                  >
                    <Text style={styles.fieldValueText}>{health.sex}</Text>
                    <View style={styles.chevronBubble}>
                      <Icon name="chevron-down" size={14} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Fumeur</Text>
                  <TouchableOpacity
                    style={styles.fieldValuePill}
                    onPress={() => setActiveModal('smoker')}
                    activeOpacity={0.7}
                    accessibilityLabel="Fumeur"
                    accessibilityRole="button"
                  >
                    <Text style={styles.fieldValueText}>{health.smoker}</Text>
                    <View style={styles.chevronBubble}>
                      <Icon name="chevron-down" size={14} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Antécédents */}
              <View style={styles.antecedentSection}>
                <View style={styles.antecedentHeader}>
                  <Text style={styles.antecedentTitle}>Antécédents familiaux</Text>
                  <TouchableOpacity
                    style={styles.addAntecedentBtn}
                    activeOpacity={0.7}
                    onPress={() => handleOpenUploadModal('familyHistory')}
                    accessibilityLabel="Ajouter un antécédent familial"
                    accessibilityRole="button"
                  >
                    <Icon name="add" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsWrap}>
                  {health.familyHistory.split('\n').filter(Boolean).map((item, idx) => (
                    <TouchableOpacity
                      key={`fh-${item}-${idx}`}
                      style={styles.tag}
                      onPress={() => {
                        const items = health.familyHistory.split('\n').filter(Boolean);
                        items.splice(idx, 1);
                        handleUpdateField('familyHistory', items.join('\n'));
                      }}
                      accessibilityLabel={`Supprimer ${item}`}
                      accessibilityRole="button"
                    >
                      <Text style={styles.tagText}>{item}</Text>
                      <Text style={styles.tagClose}>×</Text>
                    </TouchableOpacity>
                  ))}
                  {health.familyHistory.split('\n').filter(Boolean).length === 0 && (
                    <Text style={styles.antecedentEmpty}>Aucun antécédent renseigné</Text>
                  )}
                </View>
              </View>

              <View style={styles.antecedentSection}>
                <View style={styles.antecedentHeader}>
                  <Text style={styles.antecedentTitle}>Antécédents médicaux</Text>
                  <TouchableOpacity
                    style={styles.addAntecedentBtn}
                    activeOpacity={0.7}
                    onPress={() => handleOpenUploadModal('medicalHistory')}
                    accessibilityLabel="Ajouter un antécédent médical"
                    accessibilityRole="button"
                  >
                    <Icon name="add" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsWrap}>
                  {health.medicalHistory.map((item, idx) => (
                    <TouchableOpacity
                      key={`${item}-${idx}`}
                      style={styles.tag}
                      onPress={() => {
                        const newList = [...health.medicalHistory];
                        newList.splice(idx, 1);
                        handleUpdateField('medicalHistory', newList);
                      }}
                      accessibilityLabel={`Supprimer ${item}`}
                      accessibilityRole="button"
                    >
                      <Text style={styles.tagText}>{item}</Text>
                      <Text style={styles.tagClose}>×</Text>
                    </TouchableOpacity>
                  ))}
                  {health.medicalHistory.length === 0 && (
                    <Text style={styles.antecedentEmpty}>Aucun antécédent renseigné</Text>
                  )}
                </View>
              </View>

              {/* Documents */}
              {health.documents.length > 0 && (
                <>
                  <View style={styles.sectionDivider} />
                  <Text style={styles.subsectionLabel}>Documents associés</Text>
                  {health.documents.map((file, index) => (
                    <View key={`${file}-${index}`} style={styles.fileRow}>
                      <Icon name="document-text-outline" size={16} color={COLORS.orange} />
                      <Text style={styles.fileName}>{file}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* ─── Sélecteur Sexe / Fumeur ────────────────────────────────────── */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.healthModalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
          accessibilityLabel="Fermer"
          accessibilityRole="button"
        >
          <View style={styles.healthModalSheet}>
            <View style={styles.healthModalHandle} />
            <Text style={styles.healthModalTitle}>
              {activeModal === 'sex' ? 'Sexe' : 'Fumeur'}
            </Text>
            {(activeModal === 'sex' ? SEX_OPTIONS : SMOKER_OPTIONS).map(option => {
              const currentValue = activeModal === 'sex' ? health?.sex : health?.smoker;
              const isSelected = currentValue === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.healthModalItem, isSelected && styles.healthModalItemSelected]}
                  onPress={() => {
                    if (activeModal) {
                      handleUpdateField(activeModal, option);
                    }
                    setActiveModal(null);
                  }}
                  accessibilityLabel={option}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.healthModalItemText,
                      isSelected && styles.healthModalItemTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {isSelected && (
                    <Icon name="checkmark" size={18} color={COLORS.orange} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomSheetModal
        visible={isUploadModalVisible}
        onClose={handleCloseModal}
      >
        <View style={styles.uploadModalSheet}>
          <Text style={styles.uploadModalTitle}>Ajouter un antécédent</Text>
          <Text style={styles.uploadModalSubtitle}>
            {uploadTarget === 'familyHistory' ? 'Antécédents familiaux' : 'Antécédents médicaux'}
          </Text>

          {/* Étape 1 — Nom */}
          <Text style={styles.uploadModalStepLabel}>1. Nom de l'antécédent</Text>
          <TextInput
            style={styles.uploadModalNameInput}
            value={antecedentName}
            onChangeText={v => setAntecedentName(sanitizeName(v))}
            placeholder="Ex. Diabète, Hypertension..."
            placeholderTextColor={COLORS.textLighter}
            maxLength={MAX_LENGTHS.name}
            autoFocus
          />

          {/* Étape 2 — Document (optionnel) */}
          <Text style={styles.uploadModalStepLabel}>2. Document associé (optionnel)</Text>
          {selectedFile ? (
            <View style={styles.uploadModalFileRow}>
              <Icon name="document-text-outline" size={18} color={COLORS.orange} />
              <Text style={styles.uploadModalFileSelectedText} numberOfLines={1}>
                {selectedFile.name}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedFile(null)}
                accessibilityLabel="Supprimer le fichier"
                accessibilityRole="button"
              >
                <Icon name="close-circle-outline" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadModalPickBtn}
              onPress={handlePickDocument}
              activeOpacity={0.8}
              accessibilityLabel="Choisir un fichier"
              accessibilityRole="button"
            >
              <Icon name="document-attach-outline" size={20} color={COLORS.white} />
              <Text style={styles.uploadModalPickBtnText}>Choisir un fichier</Text>
            </TouchableOpacity>
          )}

          {/* Étape 3 — Valider */}
          <TouchableOpacity
            style={[
              styles.uploadModalValidateBtn,
              !antecedentName.trim() && styles.uploadModalValidateBtnDisabled,
            ]}
            onPress={handleValidateAntecedent}
            disabled={!antecedentName.trim()}
            activeOpacity={0.8}
            accessibilityLabel="Valider l'antécédent"
            accessibilityRole="button"
          >
            <Text style={styles.uploadModalValidateBtnText}>Valider</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadModalCancelBtn}
            onPress={handleCloseModal}
            activeOpacity={0.7}
            accessibilityLabel="Annuler"
            accessibilityRole="button"
          >
            <Text style={styles.uploadModalCancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>

      <BottomNav />
    </SafeAreaView>
  );
};

export default HealthPage;
