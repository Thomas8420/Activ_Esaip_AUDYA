import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles, COLORS } from '../../screens/Professionals/ProfessionalsScreen.styles';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import ProfessionalsFilters, { Filters } from './ProfessionalsFilters';
import ProfessionalCard from './ProfessionalCard';
import ProfessionalListRow from './ProfessionalListRow';
import {
  Professional,
  fetchMyProfessionals,
  USE_PROFESSIONALS_API,
} from '../../services/professionalsService';
import { useNavigation } from '../../context/NavigationContext';
import { SPECIALTIES } from '../../constants';

/**
 * Données mock utilisées tant que l'endpoint JSON n'est pas disponible.
 * ⚠️  À supprimer dès que GET /api/patient/professionals est opérationnel.
 */
const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    firstName: 'Pierre',
    lastName: 'Wurtig',
    role: 'Audioprothésiste',
    company: 'Compte Audya',
    phone: '06 68 18 98 47',
    email: 'professionnal.audya@gmail.com',
    isFavorite: false,
    isInvitationPending: true,
    specialty: 'Audioprothésiste',
    zipCode: '75001',
    city: 'Paris',
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Dupont',
    role: 'ORL',
    company: 'Clinique Medicale',
    phone: '06 12 34 56 78',
    email: 'marie.dupont@email.com',
    isFavorite: false,
    isInvitationPending: false,
    specialty: 'ORL',
    zipCode: '75002',
    city: 'Paris',
  },
  {
    id: '3',
    firstName: 'Jean',
    lastName: 'Martin',
    role: 'Cardiologue',
    company: 'Cabinet Medical',
    phone: '06 98 76 54 32',
    email: 'jean.martin@email.com',
    isFavorite: false,
    isInvitationPending: false,
    specialty: 'Cardiologie',
    zipCode: '69000',
    city: 'Lyon',
  },
];


/**
 * Composant principal qui assemble les différentes parties de l'écran des professionnels.
 * Il intègre la barre de navigation, le filtre, la grille de professionnels et le bouton d'action flottant.
 */
const ProfessionalsPage = () => {
  const { navigateToProfile, navigateToMessagingChat } = useNavigation();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    itemsPerPage: 8,
    specialty: '',
    zipCode: '',
    city: '',
  });

  useEffect(() => {
    const load = async () => {
      if (USE_PROFESSIONALS_API) {
        try {
          const data = await fetchMyProfessionals();
          setProfessionals(data);
        } catch {
          // Erreur silencieuse en production — l'UI reste sur les données précédentes
        }
      } else {
        setProfessionals(MOCK_PROFESSIONALS);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setProfessionals(prev =>
      prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p),
    );
  }, []);

  const handleResendInvitation = useCallback((_id: string) => {
    // TODO: Implémenter l'appel API de renvoi d'invitation
  }, []);

  const handleMessage = useCallback((professional: Professional) => {
    navigateToMessagingChat({
      id: null,
      subject: `Conversation avec ${professional.firstName} ${professional.lastName}`,
      correspondentId: professional.id,
      correspondentName: `${professional.firstName} ${professional.lastName}`,
      correspondentPhone: professional.phone,
      correspondentEmail: professional.email,
      correspondentCity: professional.city,
      correspondentZip: professional.zipCode,
      status: 'pending',
    });
  }, [navigateToMessagingChat]);

  const filteredProfessionals = useMemo(() =>
    professionals
      .filter(p => {
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
        const matchesSearch =
          fullName.includes(filters.searchQuery.toLowerCase()) ||
          p.role.toLowerCase().includes(filters.searchQuery.toLowerCase());
        const matchesSpecialty = !filters.specialty || p.specialty === filters.specialty;
        const matchesZipCode = !filters.zipCode || p.zipCode.includes(filters.zipCode);
        const matchesCity = !filters.city || p.city.toLowerCase().includes(filters.city.toLowerCase());
        return matchesSearch && matchesSpecialty && matchesZipCode && matchesCity;
      })
      .slice(0, filters.itemsPerPage),
  [professionals, filters]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Affiche la barre de navigation */}
      <NavBar />

      {/* Le contenu principal est dans un ScrollView pour permettre le défilement */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Titre */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>MES PROFESSIONNELS</Text>
        </View>

        {/* Filtres et recherche */}
        <ProfessionalsFilters
          filters={filters}
          onFiltersChange={setFilters}
          specialties={SPECIALTIES}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Chargement */}
        {isLoading && (
          <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 40 }} />
        )}

        {/* Vue cartes */}
        {!isLoading && viewMode === 'card' && (
          filteredProfessionals.length > 0 ? (
            filteredProfessionals.map(professional => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                onToggleFavorite={() => handleToggleFavorite(professional.id)}
                onResendInvitation={() => handleResendInvitation(professional.id)}
                onViewProfile={() => navigateToProfile(professional)}
                onMessage={() => handleMessage(professional)}
              />
            ))
          ) : (
            <View style={styles.professionalCard}>
              <Text style={styles.cardName}>Aucun professionnel trouvé</Text>
            </View>
          )
        )}

        {/* Vue tableau */}
        {!isLoading && viewMode === 'list' && (
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderCellSpecialty}>Spécialité</Text>
              <Text style={styles.listHeaderCellName}>Nom</Text>
              <Text style={styles.listHeaderCellName}>Prénom</Text>
              <Text style={styles.listHeaderCellActions}>Actions</Text>
            </View>
            {filteredProfessionals.length > 0 ? (
              filteredProfessionals.map((professional, index) => (
                <ProfessionalListRow
                  key={professional.id}
                  professional={professional}
                  onToggleFavorite={() => handleToggleFavorite(professional.id)}
                  onViewProfile={() => navigateToProfile(professional)}
                  isAlternate={index % 2 === 1}
                />
              ))
            ) : (
              <View style={styles.listRow}>
                <Text style={styles.listCellName}>Aucun professionnel trouvé</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Barre de navigation inférieure (inclut le bouton chat) */}
      <BottomNav />
    </SafeAreaView>
  );
};

export default ProfessionalsPage;
