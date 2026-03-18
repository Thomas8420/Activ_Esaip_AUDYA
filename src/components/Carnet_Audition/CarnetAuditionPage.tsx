import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Navigation & Communs
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';

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
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger les documents.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f3ef' }} edges={['top']}>
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
                <SearchIcon width={16} height={16} fill="#999" style={{ marginRight: 8 }} />
                <TextInput placeholder="Rechercher" style={styles.searchInput} placeholderTextColor="#999" />
              </View>
              <View style={styles.rightControl}>
                <Text style={styles.displayText}>Affichage</Text>
                <View style={styles.displayIcons}>
                  <TouchableOpacity onPress={() => setViewMode('timeline')}>
                    <TimelineIcon width={22} height={22} fill={viewMode === 'timeline' ? '#F15A24' : '#D3D3D3'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setViewMode('grid')}>
                    <GridIcon width={22} height={22} fill={viewMode === 'grid' ? '#F15A24' : '#D3D3D3'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setViewMode('list')}>
                    <ListIcon width={22} height={22} fill={viewMode === 'list' ? '#F15A24' : '#D3D3D3'} />
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

              <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert("Ajouter", "Ouvrir le formulaire")}>
                <Text style={styles.addButtonText}>Ajouter un document</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* --- AFFICHAGE DU CONTENU --- */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#F15A24" style={{ marginTop: 50 }} />
          ) : (
            <>
              {viewMode === 'timeline' && <CarnetTimelineView documents={documents} />}
              {viewMode === 'grid' && <CarnetGridView documents={documents} />}
              {viewMode === 'list' && <CarnetListView documents={documents} />}
            </>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav currentScreenName="Mon Carnet Audition" />
    </SafeAreaView>
  );
};

export default CarnetAuditionPage;