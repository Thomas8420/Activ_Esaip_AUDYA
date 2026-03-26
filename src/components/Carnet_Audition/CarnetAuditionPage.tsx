import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker, { types as DocumentTypes } from 'react-native-document-picker';

// Navigation & Communs
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import BottomSheetModal from '../common/BottomSheetModal/BottomSheetModal';
import CTA1 from '../common/Button/CTA1';
import { COLORS } from '../../screens/Home/HomeScreen.styles';
import { useLanguage } from '../../context/LanguageContext';
import CTA4 from '../common/Button/CTA4';
import AnimatedDropdown from '../common/AnimatedDropdown/AnimatedDropdown';

// Vues déportées
import { CarnetTimelineView } from './CarnetTimelineView';
import { CarnetListView } from './CarnetListView';
import { CarnetGridView } from './CarnetGridView';

// Styles & Services
import { styles } from '../../screens/Carnet_Audition/CarnetAuditionScreen.styles';
import {
  getMockDocuments,
  fetchDocuments,
  USE_CARNET_API,
  AuditionDocument
} from '../../services/carnetauditionService';

// Icônes SVG
import SearchIcon from '../../assets/images/loupe.svg';
import TimelineIcon from '../../assets/images/timeline-icon.svg';
import GridIcon from '../../assets/images/grid-icon.svg';
import ListIcon from '../../assets/images/list-icon.svg';
import DropdownIcon from '../../assets/images/dropdown.svg';

const CarnetAuditionPage = () => {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<AuditionDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'list'>('timeline');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Tout');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewedDoc, setViewedDoc] = useState<AuditionDocument | null>(null);
  const [docCategory, setDocCategory] = useState('');
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const FILTER_OPTIONS = [
    'Tout','Document d\'imagerie médicale','Audiométrie','Biologie','Bilan d\'efficacité',
    'Bilan d\'orientation','Fiche de liaison','Compte-Rendus','Note de suivi','Ordonnance',
    'CR Orthophonique','Otoscopie','Photo appareillages','Questionnaires',
    'Tests auditifs spécifiques','Autres',
  ];

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (USE_CARNET_API) {
          const data = await fetchDocuments();
          setDocuments(data);
        } else {
          setDocuments(getMockDocuments());
        }
      } catch {
        Alert.alert('Erreur', 'Impossible de charger les documents.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedFile(null);
    setDocCategory('');
    setIsCategoryPickerOpen(false);
  };

  const handlePickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentTypes.pdf, DocumentTypes.doc, DocumentTypes.docx, DocumentTypes.plainText, DocumentTypes.images],
        allowMultiSelection: false,
      });
      setSelectedFile(results[0].name ?? 'document');
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Erreur', 'Impossible de sélectionner le fichier.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('screen.notebook')}</Text>

          {/* --- ZONE FILTRES --- */}
          <View style={styles.controlsContainer}>
            <View style={styles.rowTop}>
              <Text style={styles.label}>Filtres</Text>
              <View style={styles.searchBox}>
                <SearchIcon width={16} height={16} style={{ marginRight: 8 }} />
                <TextInput placeholder="Rechercher" style={styles.searchInput} placeholderTextColor="#999" />
              </View>
              <View style={styles.rightControl}>
                <Text style={styles.displayText}>Affichage</Text>
                <View style={styles.displayIcons}>
                    <TouchableOpacity style={styles.viewModeBtn} onPress={() => setViewMode('timeline')} accessibilityLabel="Vue timeline" accessibilityRole="button">
                      <TimelineIcon width={18} height={18} color={viewMode === 'timeline' ? COLORS.orange : COLORS.border} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewModeBtn} onPress={() => setViewMode('grid')} accessibilityLabel="Vue grille" accessibilityRole="button">
                      <GridIcon width={18} height={18} color={viewMode === 'grid' ? COLORS.orange : COLORS.border} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewModeBtn} onPress={() => setViewMode('list')} accessibilityLabel="Vue liste" accessibilityRole="button">
                      <ListIcon width={18} height={18} color={viewMode === 'list' ? COLORS.orange : COLORS.border} />
                    </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[styles.rowBottom, { zIndex: 1000 }]}>
              <View>
                <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen(!dropdownOpen)}>
                  <Text style={styles.dropdownText}>{selectedFilter}</Text>
                  <View style={styles.dropdownArrowBg}>
                    <DropdownIcon width={10} height={10} fill="white" />
                  </View>
                </TouchableOpacity>

                <AnimatedDropdown visible={dropdownOpen} absolute>
                  <View style={styles.dropdownList}>
                    {FILTER_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={styles.dropdownItem}
                        onPress={() => { setSelectedFilter(opt); setDropdownOpen(false); }}
                      >
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </AnimatedDropdown>
              </View>

              <CTA1
                label="Ajouter un document"
                onPress={() => setIsModalVisible(true)}
                style={{ height: 38, paddingHorizontal: 12, paddingVertical: 0, minWidth: 0 }}
                textStyle={{ fontSize: 12 }}
              />
            </View>
          </View>

          {/* --- AFFICHAGE DU CONTENU --- */}
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 50 }} />
          ) : (
            <>
              {viewMode === 'timeline' && <CarnetTimelineView documents={documents} onView={setViewedDoc} />}
              {viewMode === 'grid' && <CarnetGridView documents={documents} />}
              {viewMode === 'list' && <CarnetListView documents={documents} onView={setViewedDoc} />}
            </>
          )}
        </View>
      </ScrollView>
        {/* --- MODALE D'AJOUT DE DOCUMENT --- */}
        <BottomSheetModal visible={isModalVisible} onClose={handleCloseModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>NOUVEAU DOCUMENT</Text>

            <Text style={styles.inputLabel}>Nom du document</Text>
            <TextInput style={styles.input} placeholder="Ex: Audiogramme Mars 2026" placeholderTextColor="#999" />

            <Text style={styles.inputLabel}>Type de document</Text>
            <TouchableOpacity
              style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48 }]}
              onPress={() => setIsCategoryPickerOpen(v => !v)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Sélectionner un type de document"
            >
              <Text style={{ fontSize: 13, color: docCategory ? '#2D2D2D' : '#999', fontFamily: 'Montserrat-Regular', flex: 1 }}>
                {docCategory || 'Ex: Ordonnance, CR...'}
              </Text>
              <Icon name={isCategoryPickerOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#999" />
            </TouchableOpacity>
            {isCategoryPickerOpen && (
              <ScrollView style={{ maxHeight: 180, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, marginBottom: 12 }} nestedScrollEnabled>
                {FILTER_OPTIONS.filter(o => o !== 'Tout').map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={{ paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}
                    onPress={() => { setDocCategory(opt); setIsCategoryPickerOpen(false); }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={opt}
                  >
                    <Text style={{ fontSize: 13, color: '#2D2D2D', fontFamily: 'Montserrat-Regular' }}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.uploadButtonModal}
              onPress={handlePickDocument}
              activeOpacity={0.8}
              accessibilityLabel="Choisir un fichier"
              accessibilityRole="button"
            >
              <Icon name="document-attach-outline" size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonTextModal} numberOfLines={1}>
                {selectedFile ?? 'Choisir un fichier (PDF, PNG…)'}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <CTA4 label="Annuler" onPress={handleCloseModal} />
              <CTA1
                label="Enregistrer"
                onPress={() => {
                  handleCloseModal();
                  Alert.alert('Succès', 'Document ajouté avec succès !');
                }}
              />
            </View>
          </View>
        </BottomSheetModal>
      {/* --- MODALE DE VISUALISATION --- */}
      <Modal
        visible={viewedDoc !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setViewedDoc(null)}
      >
        <View style={styles.viewModalOverlay}>
          <View style={styles.viewModalContent}>
            <View style={styles.viewModalHeader}>
              <Text style={styles.viewModalTitle}>VOTRE CARNET AUDITION</Text>
              <TouchableOpacity
                onPress={() => setViewedDoc(null)}
                style={styles.viewModalCloseBtn}
                accessibilityLabel="Fermer"
                accessibilityRole="button"
              >
                <Icon name="close" size={14} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {viewedDoc && (
              <View style={styles.viewDetailTable}>
                <View style={styles.viewDetailRow}>
                  <Text style={styles.viewDetailLabel}>PATIENT</Text>
                  <Text style={styles.viewDetailValue}>
                    {viewedDoc.patientName ?? 'Non renseigné'}
                  </Text>
                </View>
                <View style={styles.viewDetailRow}>
                  <Text style={styles.viewDetailLabel}>NOM DU DOCUMENT</Text>
                  <Text style={styles.viewDetailValue}>
                    {viewedDoc.title ?? viewedDoc.type}
                  </Text>
                </View>
                <View style={styles.viewDetailRow}>
                  <Text style={styles.viewDetailLabel}>TYPE DE DOCUMENT</Text>
                  <Text style={styles.viewDetailValue}>{viewedDoc.type}</Text>
                </View>
                <View style={styles.viewDetailRow}>
                  <Text style={styles.viewDetailLabel}>DATE</Text>
                  <Text style={styles.viewDetailValue}>{viewedDoc.date}</Text>
                </View>

                <View style={styles.viewActionsSection}>
                  <Text style={styles.viewActionsLabel}>ACTIONS</Text>
                  <View style={styles.viewBigActionsRow}>
                    <TouchableOpacity style={styles.viewBigActionButton} accessibilityLabel="Voir" accessibilityRole="button">
                      <Icon name="eye-outline" size={26} color={COLORS.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewBigActionButton} accessibilityLabel="Télécharger" accessibilityRole="button">
                      <Icon name="download-outline" size={26} color={COLORS.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewBigActionButton} accessibilityLabel="Supprimer" accessibilityRole="button">
                      <Icon name="trash-outline" size={26} color={COLORS.textLight} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <BottomNav />
    </SafeAreaView>
  );
};

export default CarnetAuditionPage;