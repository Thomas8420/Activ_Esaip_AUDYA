import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import { styles, COLORS } from '../../screens/Health/HealthScreen.styles';
import { fetchPatientHealth, PatientHealth, USE_HEALTH_API } from '../../services/healthService';

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
  familyHistory: 'Antecedents familiaux',
  medicalHistory: ['Accident vasculaire cerebral', 'Adenome de la prostate'],
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
  const [health, setHealth] = useState<PatientHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
              <Text style={styles.summaryTopTitle}>MA SANTE</Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryIdentity}>
                  <Text style={styles.summaryNameLine}>
                    {health.fullName} - {health.age} an(s) - {health.gender}
                  </Text>
                  <Text style={styles.summaryAddressLine}>{health.addressLine}</Text>
                  <Text style={styles.summaryAddressLine}>{health.cityZip}</Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.bmiBlock}>
                  <Text style={styles.bmiLabel}>Mon IMC</Text>
                  <View style={styles.bmiCircle}>
                    <Text style={styles.bmiValue}>{bmiValue}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>INFORMATIONS GENERALES</Text>

              <View style={styles.twoColumnRow}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Sexe *</Text>
                  <View style={styles.fieldValuePill}>
                    <Text style={styles.fieldValueText}>{health.sex}</Text>
                    <View style={styles.chevronBubble}>
                      <Icon name="chevron-down" size={14} color="#FFFFFF" />
                    </View>
                  </View>
                </View>

                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Fumeur</Text>
                  <View style={styles.fieldValuePill}>
                    <Text style={styles.fieldValueText}>{health.smoker}</Text>
                    <View style={styles.chevronBubble}>
                      <Icon name="chevron-down" size={14} color="#FFFFFF" />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.twoColumnRow}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Taille (cm) *</Text>
                  <TextInput
                    value={String(health.heightCm)}
                    editable={false}
                    style={styles.textInputReadonly}
                  />
                </View>

                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Poids (kg) *</Text>
                  <TextInput
                    value={String(health.weightKg)}
                    editable={false}
                    style={styles.textInputReadonly}
                  />
                </View>
              </View>

              <Text style={styles.subsectionLabel}>Antecedents familiaux</Text>
              <View style={styles.inlineRowCard}>
                <View style={styles.inlineInputLike}>
                  <Text style={styles.inlineInputLikeText}>{health.familyHistory}</Text>
                </View>
                <View style={styles.inlineDivider} />
                <TouchableOpacity style={styles.documentButton} activeOpacity={0.7}>
                  <Text style={styles.documentButtonText}>Document</Text>
                  <Icon name="download-outline" size={18} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.subsectionLabel}>Antecedents medicaux</Text>
              <View style={styles.inlineRowCard}>
                <View style={styles.tagsWrap}>
                  {health.medicalHistory.map(item => (
                    <View key={item} style={styles.tag}>
                      <Text style={styles.tagText}>{item}</Text>
                      <Text style={styles.tagClose}>x</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.inlineDivider} />
                <TouchableOpacity style={styles.documentButton} activeOpacity={0.7}>
                  <Text style={styles.documentButtonText}>Document</Text>
                  <Icon name="download-outline" size={18} color={COLORS.text} />
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

      <BottomNav />
    </SafeAreaView>
  );
};

export default HealthPage;

