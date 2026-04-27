import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
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
import SelectModal from '../common/SelectModal/SelectModal';
import CTA1 from '../common/Button/CTA1';
import { COLORS } from '../../screens/Home/HomeScreen.styles';
import { useLanguage } from '../../context/LanguageContext';
import CTA4 from '../common/Button/CTA4';

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
                  <Text style={[styles.dropdownText, { maxWidth: 68 }]} numberOfLines={1} ellipsizeMode="tail">{selectedFilter}</Text>
                  <View style={styles.dropdownArrowBg}>
                    <DropdownIcon width={10} height={10} fill="white" />
                  </View>
                </TouchableOpacity>

                <SelectModal
                  visible={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  title="Type de document"
                  options={FILTER_OPTIONS}
                  value={selectedFilter}
                  onSelect={setSelectedFilter}
                />
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
              onPress={() => setIsCategoryPickerOpen(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Sélectionner un type de document"
            >
              <Text style={{ fontSize: 13, color: docCategory ? '#2D2D2D' : '#999', fontFamily: 'Montserrat-Regular', flex: 1 }}>
                {docCategory || 'Ex: Ordonnance, CR...'}
              </Text>
              <Icon name="chevron-down" size={16} color="#999" />
            </TouchableOpacity>
            <SelectModal
              visible={isCategoryPickerOpen}
              onClose={() => setIsCategoryPickerOpen(false)}
              title="Type de document"
              options={FILTER_OPTIONS.filter(o => o !== 'Tout')}
              value={docCategory}
              onSelect={setDocCategory}
            />

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
                  <View style={styles.viewBigActionsRow}>
                    <CTA1
                      label="Télécharger"
                      style={{ flex: 1, height: 40, paddingVertical: 0 }}
                      textStyle={{ fontSize: 12 }}
                    />
                    <Pressable
                      style={[modalBtnStyles.base, modalBtnStyles.delete]}
                      accessibilityRole="button"
                      accessibilityLabel="Supprimer"
                    >
                      <Text style={[modalBtnStyles.text, modalBtnStyles.deleteText]}>Supprimer</Text>
                    </Pressable>
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

const modalBtnStyles = StyleSheet.create({
  base: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  delete: {
    backgroundColor: '#C8D6E1',
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    textAlign: 'center',
  },
  deleteText: {
    color: '#172A4F',
  },
});

export default CarnetAuditionPage;