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
import { sanitizeNumeric } from '../../utils/validators';
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
  surgicalHistory: [],
  medications: [],
  allergies: [],
  physicalActivityHours: '3',
  documents: [
    'IRM CEREBRALE1712072758.png',
    'IRM CEREBRALE1712072758.png',
    'IRM CEREBRALE1712072758.png',
  ],
};

// ─── Options sélecteur — niveau module (jamais dans le corps du composant) ────
const SEX_OPTIONS = ['Homme', 'Femme', 'Autre'] as const;
const SMOKER_OPTIONS = ['Oui', 'Non', 'Ancien fumeur'] as const;

const FAMILY_HISTORY_OPTIONS = [
  'Aucun antécédent familial','Surdité','Hypertension','Diabète','Infarctus',
  'Athérosclérose','Cancer','Dépression','Démences ou Alzheimer','Maladies génétiques','Autres',
] as const;

const MEDICAL_HISTORY_OPTIONS = [
  'Aucun antécédent médical','Accident vasculaire cérébral','Acné','Addiction','Adénome de la prostate',
  'Algie vasculaire de la face','Allergies respiratoires','Anévrisme','Angine de poitrine',
  'Apnée du sommeil','Arthrose','Asthme','Bronchite chronique','Calculs rénaux',
  'Cancer de l\'estomac','Cancer de l\'utérus et du col de l\'utérus','Cancer de la peau',
  'Cancer de la thyroïde','Cancer des os','Cancer du cerveau','Cancer du colon','Cancer du foie',
  'Cancer du poumon','Cancer du rein','Cancer du sein','Cataracte','Cécité bilatérale',
  'Céphalées chroniques','Cholestérol et/ou triglycérides élevés','Cirrhose','Côlon irritable',
  'Déficit immunitaire','Dépression','Diabète','Drépanocytose','Eczéma','Embolie pulmonaire',
  'Emphysème','Endométriose','Épilepsie','Fibrome utérin','Fibromyalgie','Gastrite chronique',
  'Glaucome','Hémophilie','Hépatite B','Hépatite C','Hernie discale','Herpès',
  'Hypercholestérolémie','Hypertension artérielle','Hyperthyroïdie','Hypothyroïdie',
  'Incontinence urinaire','Infarctus du myocarde','Insuffisance cardiaque','Insuffisance rénale',
  'Kyste ovarien','Leucémie','Lombalgie','Lupus','Lymphome','Lymphome de Hodgkin',
  'Maladie cœliaque','Maladie d\'Alzheimer et démence','Maladie de Lyme','Maladie de Paget',
  'Maladie de Parkinson','Mucoviscidose','Myopathies','Névralgie','Ostéoporose',
  'Pathologies des artères (artériopathie)','Phlébite','Pneumopathie','Psoriasis',
  'Rectocolite hémorragique','Reflux gastro-œsophagien','Rétinopathie','Rhinite chronique',
  'Schizophrénie','Sciatique','Sclérose en plaques','Scoliose','Sinusite chronique',
  'Syndrome de Guillain Barré','Syndrome de stress post-traumatique','Tendinite chronique',
  'Trouble bipolaire','Trouble érectile','Trouble de la coagulation','Trouble de la fertilité',
  'Trouble de la vision','Trouble du comportement alimentaire','Trouble du rythme cardiaque',
  'Trouble obsessionnels compulsifs','Tuberculose','Ulcère gastro-duodénal','Urticaire',
  'VIH/Sida','Valvulopathie (souffle au cœur)','Vitiligo','Zona',
] as const;

const SURGICAL_HISTORY_OPTIONS = [
  'Orthopédie bras et épaule','Orthopédie hanche et jambe','Orthopédie main ou pied',
  'Neurochirurgie rachis','Neurochirurgie cerveau','Ophtalmologie cataracte','Ophtalmologie retine',
  'Système digestif colon','Système digestif estomac','Système digestif foie et vesicule',
  'Système digestif pancreas','Poumon','Rein','Prostate','Vessie','Uterus','Ovaires','Sein',
  'Orl oreille','Orl gorge','Orl larynx','Stomatologie dents et implants','Stomatologie machoire',
  'Stomatologie visage','Cardiologie et chirurgie cardiaque','Chirurgie dermatologique',
  'Thyroide','Surrenale','Greffe organe (précisez)','Pose implants ou de prothèses','Autres',
] as const;

const MEDICATIONS_OPTIONS = [
  'Aucun traitement médical','Maladies cardio vasculaires et métaboliques','Cancers',
  'Maladies ORL','Maladies pulmonaires','Troubles digestifs et hépatiques',
  'Maladies rhumatologiques','Maladies neurologiques et musculaires','Maladies urologiques',
  'Maladies gynecologiques','Maladies de la peau','Maladies des yeux','Maladies du sang',
  'Maladies infectieuses','Maladies hereditaires et rares','Maladies psychologiques',
] as const;

const ALLERGIES_OPTIONS = [
  'Aucune allergie','Allergie aux arachides','Allergie aux fruits de mer','Allergie au lait',
  'Allergie aux œufs','Allergie au blé','Allergie au soja','Allergie au poisson',
  'Allergie au gluten','Allergie aux noix','Allergie aux graines de sésame','Allergie au pollen',
  'Allergie aux acariens','Allergie aux moisissures','Allergie aux piqûres d\'insectes',
  'Allergie au latex','Allergie au nickel','Allergie aux médicaments',
  'Allergie au pollen de graminées','Allergie au pollen d\'ambroisie','Allergie à la poussière',
  'Allergie au soleil','Allergie aux produits chimiques','Allergie au froid','Allergie au cuir',
  'Allergie à la laine','Allergie au parfum','Allergie aux produits laitiers','Allergie aux fruits',
  'Allergie aux légumes','Allergie au maquillage','Allergie aux colorants alimentaires',
  'Allergie au chocolat','Allergie aux agrumes','Allergie au poivre','Allergie à l\'ail',
  'Allergie aux noix de cajou','Allergie aux noix de pécan','Allergie aux amandes',
  'Allergie aux noisettes','Allergie au kiwi','Allergie à la banane','Allergie à l\'ananas',
  'Allergie à la mangue','Allergie aux fraises','Allergie aux tomates',
  'Allergie aux pommes de terre','Allergie à la carotte','Allergie au céleri',
  'Allergie aux oignons','Allergie aux épinards','Allergie aux champignons',
  'Allergie au poivre noir','Allergie à la cannelle','Allergie au sucre','Allergie au café',
  'Allergie au thé','Allergie aux huiles essentielles','Allergie à l\'herbe à puce',
  'Allergie au pollen de bouleau','Allergie au pollen d\'aulne','Allergie au pollen de chêne',
  'Allergie au pollen de cyprès','Allergie au pollen de peuplier','Allergie au pollen de saule',
  'Allergie au pollen de tilleul','Allergie au pollen de platane','Allergie au pollen d\'olivier',
  'Allergie au pollen de pin','Allergie au pollen de frêne','Allergie au pollen de noisetier',
  'Allergie au pollen de pissenlit','Allergie au pollen d\'armoise','Allergie au pollen de marguerite',
  'Allergie au pollen de plantain','Allergie aux plumes','Allergie aux acariens de la poussière',
  'Allergie aux animaux domestiques','Allergie aux punaises de lit','Allergie à l\'ambroisie',
  'Allergie aux arbres','Allergie au pollen de cèdre','Allergie au pollen d\'érable',
  'Allergie au pollen d\'eucalyptus','Allergie au pollen de hêtre',
] as const;

/**
 * Page Ma sante : resume de l'etat de sante + informations generales.
 */
const HealthPage = () => {
  const { t } = useLanguage();
  const [health, setHealth] = useState<PatientHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'sex' | 'smoker' | null>(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'familyHistory' | 'medicalHistory' | 'surgicalHistory' | 'medications' | 'allergies' | null>(null);
  const [antecedentName, setAntecedentName] = useState('');
  const [antecedentSearch, setAntecedentSearch] = useState('');
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

  const handleOpenUploadModal = (target: 'familyHistory' | 'medicalHistory' | 'surgicalHistory' | 'medications' | 'allergies') => {
    setUploadTarget(target);
    setAntecedentName('');
    setAntecedentSearch('');
    setSelectedFile(null);
    setIsUploadModalVisible(true);
  };

  const handleCloseModal = () => {
    setAntecedentName('');
    setAntecedentSearch('');
    setSelectedFile(null);
    setIsUploadModalVisible(false);
  };

  const getOptionsForTarget = (target: typeof uploadTarget): readonly string[] => {
    switch (target) {
      case 'familyHistory': return FAMILY_HISTORY_OPTIONS;
      case 'medicalHistory': return MEDICAL_HISTORY_OPTIONS;
      case 'surgicalHistory': return SURGICAL_HISTORY_OPTIONS;
      case 'medications': return MEDICATIONS_OPTIONS;
      case 'allergies': return ALLERGIES_OPTIONS;
      default: return [];
    }
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
      } else if (uploadTarget === 'surgicalHistory') {
        updated.surgicalHistory = [...prev.surgicalHistory, antecedentName.trim()];
      } else if (uploadTarget === 'medications') {
        updated.medications = [...prev.medications, antecedentName.trim()];
      } else if (uploadTarget === 'allergies') {
        updated.allergies = [...prev.allergies, antecedentName.trim()];
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

              {/* Identité + adresse */}
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
              </View>

              <View style={styles.summaryDivider} />

              {/* QR Code + IMC côte à côte */}
              <View style={styles.summaryBottomRow}>
                <View style={styles.qrCodeContainer}>
                  <QrCode width={110} height={110} />
                </View>
                <View style={styles.bmiBlock}>
                  <View style={styles.bmiCircle}>
                    <Text style={styles.bmiValue}>{bmiValue}</Text>
                  </View>
                  <Text style={styles.bmiLabel}>Mon IMC</Text>
                </View>
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

              <View style={styles.twoColumnRow}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Activité physique (h/sem.)</Text>
                  <TextInput
                    value={health.physicalActivityHours}
                    onChangeText={(val) => handleUpdateField('physicalActivityHours', sanitizeNumeric(val))}
                    keyboardType="numeric"
                    maxLength={3}
                    style={styles.textInputReadonly}
                  />
                </View>
                <View style={styles.fieldColumn} />
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

              {/* Antécédents chirurgicaux */}
              <View style={styles.antecedentSection}>
                <View style={styles.antecedentHeader}>
                  <Text style={styles.antecedentTitle}>Antécédents chirurgicaux</Text>
                  <TouchableOpacity style={styles.addAntecedentBtn} activeOpacity={0.7}
                    onPress={() => handleOpenUploadModal('surgicalHistory')}
                    accessibilityLabel="Ajouter un antécédent chirurgical" accessibilityRole="button">
                    <Icon name="add" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsWrap}>
                  {health.surgicalHistory.map((item, idx) => (
                    <TouchableOpacity key={`sh-${item}-${idx}`} style={styles.tag}
                      onPress={() => {
                        const newList = [...health.surgicalHistory]; newList.splice(idx, 1);
                        handleUpdateField('surgicalHistory', newList);
                      }}
                      accessibilityLabel={`Supprimer ${item}`} accessibilityRole="button">
                      <Text style={styles.tagText}>{item}</Text>
                      <Text style={styles.tagClose}>×</Text>
                    </TouchableOpacity>
                  ))}
                  {health.surgicalHistory.length === 0 && (
                    <Text style={styles.antecedentEmpty}>Aucun antécédent renseigné</Text>
                  )}
                </View>
              </View>

              {/* Médicaments en cours */}
              <View style={styles.antecedentSection}>
                <View style={styles.antecedentHeader}>
                  <Text style={styles.antecedentTitle}>Médicaments en cours</Text>
                  <TouchableOpacity style={styles.addAntecedentBtn} activeOpacity={0.7}
                    onPress={() => handleOpenUploadModal('medications')}
                    accessibilityLabel="Ajouter un médicament" accessibilityRole="button">
                    <Icon name="add" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsWrap}>
                  {health.medications.map((item, idx) => (
                    <TouchableOpacity key={`med-${item}-${idx}`} style={styles.tag}
                      onPress={() => {
                        const newList = [...health.medications]; newList.splice(idx, 1);
                        handleUpdateField('medications', newList);
                      }}
                      accessibilityLabel={`Supprimer ${item}`} accessibilityRole="button">
                      <Text style={styles.tagText}>{item}</Text>
                      <Text style={styles.tagClose}>×</Text>
                    </TouchableOpacity>
                  ))}
                  {health.medications.length === 0 && (
                    <Text style={styles.antecedentEmpty}>Aucun médicament renseigné</Text>
                  )}
                </View>
              </View>

              {/* Allergies */}
              <View style={styles.antecedentSection}>
                <View style={styles.antecedentHeader}>
                  <Text style={styles.antecedentTitle}>Allergies connues</Text>
                  <TouchableOpacity style={styles.addAntecedentBtn} activeOpacity={0.7}
                    onPress={() => handleOpenUploadModal('allergies')}
                    accessibilityLabel="Ajouter une allergie" accessibilityRole="button">
                    <Icon name="add" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsWrap}>
                  {health.allergies.map((item, idx) => (
                    <TouchableOpacity key={`al-${item}-${idx}`} style={styles.tag}
                      onPress={() => {
                        const newList = [...health.allergies]; newList.splice(idx, 1);
                        handleUpdateField('allergies', newList);
                      }}
                      accessibilityLabel={`Supprimer ${item}`} accessibilityRole="button">
                      <Text style={styles.tagText}>{item}</Text>
                      <Text style={styles.tagClose}>×</Text>
                    </TouchableOpacity>
                  ))}
                  {health.allergies.length === 0 && (
                    <Text style={styles.antecedentEmpty}>Aucune allergie renseignée</Text>
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
      <BottomSheetModal
        visible={activeModal !== null}
        onClose={() => setActiveModal(null)}
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
      </BottomSheetModal>

      <BottomSheetModal
        visible={isUploadModalVisible}
        onClose={handleCloseModal}
      >
        <View style={styles.uploadModalSheet}>
          <Text style={styles.uploadModalTitle}>Ajouter un antécédent</Text>
          <Text style={styles.uploadModalSubtitle}>
            {uploadTarget === 'familyHistory' ? 'Antécédents familiaux'
              : uploadTarget === 'surgicalHistory' ? 'Antécédents chirurgicaux'
              : uploadTarget === 'medications' ? 'Médicaments en cours'
              : uploadTarget === 'allergies' ? 'Allergies connues'
              : 'Antécédents médicaux'}
          </Text>

          {/* Étape 1 — Sélection */}
          <Text style={styles.uploadModalStepLabel}>1. Sélectionner</Text>
          {!antecedentName.trim() ? (
            <>
              <View style={styles.uploadModalSearchRow}>
                <Icon name="search-outline" size={16} color={COLORS.textLighter} />
                <TextInput
                  style={styles.uploadModalSearchInput}
                  value={antecedentSearch}
                  onChangeText={setAntecedentSearch}
                  placeholder="Rechercher..."
                  placeholderTextColor={COLORS.textLighter}
                />
              </View>
              <ScrollView style={styles.uploadModalOptionsList} nestedScrollEnabled>
                {getOptionsForTarget(uploadTarget)
                  .filter(opt => opt.toLowerCase().includes(antecedentSearch.toLowerCase()))
                  .map(opt => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.uploadModalOptionItem}
                      onPress={() => { setAntecedentName(opt); setAntecedentSearch(''); }}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={opt}
                    >
                      <Text style={styles.uploadModalOptionText}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </>
          ) : (
            <View style={styles.uploadModalSelectedRow}>
              <Text style={styles.uploadModalSelectedText} numberOfLines={1}>{antecedentName}</Text>
              <TouchableOpacity onPress={() => setAntecedentName('')} accessibilityRole="button" accessibilityLabel="Changer">
                <Icon name="close-circle-outline" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          )}

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
