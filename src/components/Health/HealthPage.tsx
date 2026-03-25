import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

/**
 * Page Ma sante : resume de l'etat de sante + informations generales.
 */
const HealthPage = () => {
  const { t } = useLanguage();
  const [health, setHealth] = useState<PatientHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'familyHistory' | 'medicalHistory' | null>(null);

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

  const toggleSex = () => {
    if (!health) {return;}
    const newValue = health.sex === 'Homme' ? 'Femme' : 'Homme';
    handleUpdateField('sex', newValue);
  };

  const toggleSmoker = () => {
    if (!health) {return;}
    const newValue = health.smoker === 'Oui' ? 'Non' : 'Oui';
    handleUpdateField('smoker', newValue);
  };

  const handleOpenUploadModal = (target: 'familyHistory' | 'medicalHistory') => {
    setUploadTarget(target);
    setIsUploadModalVisible(true);
  };

  const handlePickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentTypes.pdf, DocumentTypes.doc, DocumentTypes.docx, DocumentTypes.plainText, DocumentTypes.images],
        allowMultiSelection: false,
      });
      const file = results[0];
      const fileName = file.name ?? 'document';
      setHealth(prev => {
        if (!prev) { return prev; }
        return { ...prev, documents: [...prev.documents, fileName] };
      });
      setIsUploadModalVisible(false);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Erreur', 'Impossible de sélectionner le document.');
      }
    }
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

              <View style={styles.summaryRow}>
                <View style={styles.summaryIdentity}>
                  <Text style={styles.summaryNameLine}>
                    {health.fullName} - {health.age} an(s) - {health.gender}
                  </Text>
                  <Text style={styles.summaryAddressLine}>{health.addressLine}</Text>
                  <Text style={styles.summaryAddressLine}>{health.cityZip}</Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.summaryMetrics}>
                  <View style={styles.bmiBlock}>
                    <Text style={styles.bmiLabel}>Mon IMC</Text>
                    <View style={styles.bmiCircle}>
                      <Text style={styles.bmiValue}>{bmiValue}</Text>
                    </View>
                  </View>

                  <View style={styles.metricDivider} />

                  <View style={styles.qrCodeContainer}>
                    <QrCode width={56} height={56} />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('health.section.general')}</Text>

              <View style={styles.twoColumnRow}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Sexe *</Text>
                  <TouchableOpacity
                    style={styles.fieldValuePill}
                    onPress={toggleSex}
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
                    onPress={toggleSmoker}
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

              <View style={styles.twoColumnRow}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Taille (cm) *</Text>
                  <TextInput
                    value={health.heightCm === 0 ? '' : String(health.heightCm)}
                    onChangeText={(val) => handleUpdateField('heightCm', val.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    style={styles.textInputReadonly}
                  />
                </View>

                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Poids (kg) *</Text>
                  <TextInput
                    value={health.weightKg === 0 ? '' : String(health.weightKg)}
                    onChangeText={(val) => handleUpdateField('weightKg', val.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    style={styles.textInputReadonly}
                  />
                </View>
              </View>

              <Text style={styles.subsectionLabel}>Antecedents familiaux</Text>
              <View style={styles.inlineRowCard}>
                <View style={styles.inlineInputLike}>
                  <TextInput
                    style={styles.inlineInputLikeText}
                    value={health.familyHistory}
                    onChangeText={(val) => handleUpdateField('familyHistory', val)}
                    placeholder="Saisir..."
                  />
                </View>
                <View style={styles.inlineDivider} />
                <TouchableOpacity
                  style={styles.documentButton}
                  activeOpacity={0.7}
                  onPress={() => handleOpenUploadModal('familyHistory')}
                  accessibilityLabel="Ajouter un document pour les antécédents familiaux"
                  accessibilityRole="button"
                >
                  <Text style={styles.documentButtonText}>Document</Text>
                  <Icon name="download-outline" size={13} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.subsectionLabel}>Antecedents medicaux</Text>
              <View style={styles.inlineRowCard}>
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
                    >
                      <Text style={styles.tagText}>{item}</Text>
                      <Text style={styles.tagClose}>x</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.inlineDivider} />
                <TouchableOpacity
                  style={styles.documentButton}
                  activeOpacity={0.7}
                  onPress={() => handleOpenUploadModal('medicalHistory')}
                  accessibilityLabel="Ajouter un document pour les antécédents médicaux"
                  accessibilityRole="button"
                >
                  <Text style={styles.documentButtonText}>Document</Text>
                  <Icon name="download-outline" size={13} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              {health.documents.map((file, index) => (
                <View key={`${file}-${index}`} style={styles.fileRow}>
                  <Icon name="document-text-outline" size={16} color={COLORS.text} />
                  <Text style={styles.fileName}>{file}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <BottomSheetModal
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
      >
        <View style={styles.uploadModalSheet}>
          <Text style={styles.uploadModalTitle}>Ajouter un document</Text>
          <Text style={styles.uploadModalSubtitle}>
            {uploadTarget === 'familyHistory' ? 'Antécédents familiaux' : 'Antécédents médicaux'}
          </Text>
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
          <TouchableOpacity
            style={styles.uploadModalCancelBtn}
            onPress={() => setIsUploadModalVisible(false)}
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
