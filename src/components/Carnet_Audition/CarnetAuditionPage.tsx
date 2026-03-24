import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Navigation & Communs
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import CTA1 from '../common/Button/CTA1';
import { COLORS } from '../../screens/Home/HomeScreen.styles';
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
  const [documents, setDocuments] = useState<AuditionDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'list'>('timeline');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Tout');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const filterOptions = ['Tout', 'Ordonnances', 'CR Orthophonie', 'Notes de suivi'];

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <NavBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>MON CARNET AUDITION</Text>

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
                    <TouchableOpacity onPress={() => setViewMode('timeline')} accessibilityLabel="Vue timeline" accessibilityRole="button">
                      <TimelineIcon width={22} height={22} color={viewMode === 'timeline' ? COLORS.orange : COLORS.border} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewMode('grid')} accessibilityLabel="Vue grille" accessibilityRole="button">
                      <GridIcon width={22} height={22} color={viewMode === 'grid' ? COLORS.orange : COLORS.border} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewMode('list')} accessibilityLabel="Vue liste" accessibilityRole="button">
                      <ListIcon width={22} height={22} color={viewMode === 'list' ? COLORS.orange : COLORS.border} />
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

                {dropdownOpen && (
                  <View style={styles.dropdownList}>
                    {filterOptions.map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={styles.dropdownItem}
                        onPress={() => { setSelectedFilter(opt); setDropdownOpen(false); }}
                      >
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <CTA1
                label="Ajouter un document"
                onPress={() => setIsModalVisible(true)}
              />
            </View>
          </View>

          {/* --- AFFICHAGE DU CONTENU --- */}
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 50 }} />
          ) : (
            <>
              {viewMode === 'timeline' && <CarnetTimelineView documents={documents} />}
              {viewMode === 'grid' && <CarnetGridView documents={documents} />}
              {viewMode === 'list' && <CarnetListView documents={documents} />}
            </>
          )}
        </View>
      </ScrollView>
        {/* --- MODALE D'AJOUT DE DOCUMENT --- */}
              <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>NOUVEAU DOCUMENT</Text>

                    <Text style={styles.inputLabel}>Nom du document</Text>
                    <TextInput style={styles.input} placeholder="Ex: Audiogramme Mars 2026" placeholderTextColor="#999" />

                    <Text style={styles.inputLabel}>Type de document</Text>
                    <TextInput style={styles.input} placeholder="Ex: Ordonnance, CR..." placeholderTextColor="#999" />

                    {/* Bouton d'importation de fichier */}
                    <TouchableOpacity style={styles.uploadButtonModal} onPress={() => Alert.alert("Fichier", "Ouvrir les dossiers du téléphone")}>
                      <Text style={styles.uploadButtonTextModal}>📁 Choisir un fichier (PDF, PNG...)</Text>
                    </TouchableOpacity>

                    {/* Boutons d'action */}
                    <View style={styles.modalActions}>
                        {/* 👉 UTILISATION DU CTA4 POUR ANNULER */}
                        <CTA4
                            label="Annuler"
                            onPress={() => setIsModalVisible(false)}
                        />

                        {/* 👉 UTILISATION DU CTA1 POUR ENREGISTRER */}
                        <CTA1
                            label="Enregistrer"
                            onPress={() => {
                                setIsModalVisible(false);
                                Alert.alert("Succès", "Document ajouté avec succès !");
                            }}
                        />
                    </View>
                  </View>
                </View>
              </Modal>
      <BottomNav />
    </SafeAreaView>
  );
};

export default CarnetAuditionPage;