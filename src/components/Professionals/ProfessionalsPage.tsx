import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
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
import { useLanguage } from '../../context/LanguageContext';
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

// ─── Sous-composant ligne invitation en attente (module-level) ────────────────

interface PendingRowProps {
  professional: Professional;
  onPress: () => void;
}

const PendingRow = ({ professional, onPress }: PendingRowProps) => {
  const initials = (professional.firstName[0] + professional.lastName[0]).toUpperCase();
  return (
    <TouchableOpacity
      style={styles.pendingRow}
      onPress={onPress}
      accessibilityLabel={`Invitation en attente — ${professional.firstName} ${professional.lastName}`}
      accessibilityRole="button"
    >
      <View style={styles.pendingRowAvatar}>
        <Text style={styles.pendingRowAvatarText}>{initials}</Text>
      </View>
      <View style={styles.pendingRowInfo}>
        <Text style={styles.pendingRowName}>{professional.firstName} {professional.lastName}</Text>
        <Text style={styles.pendingRowRole}>{professional.role}</Text>
      </View>
      <Icon name="time-outline" size={16} color={COLORS.textLight} />
    </TouchableOpacity>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────

/**
 * ProfessionalsPage — Orchestrateur de l'écran Mes Professionnels.
 * Sépare les professionnels en deux catégories :
 *   - Invitations en attente (section compacte + modal détail)
 *   - Professionnels actifs (liste/grille filtrée)
 */
const ProfessionalsPage = () => {
  const { navigateToProfile, navigateToMessagingChat, navigateToAdd } = useNavigation();
  const { t } = useLanguage();
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
  const [pendingModalPro, setPendingModalPro] = useState<Professional | null>(null);

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

  // Invitations en attente — toujours affichées, hors filtres
  const pendingProfessionals = useMemo(() =>
    professionals.filter(p => p.isInvitationPending),
  [professionals]);

  // Professionnels actifs — filtrés et paginés
  const filteredProfessionals = useMemo(() =>
    professionals
      .filter(p => {
        if (p.isInvitationPending) { return false; }
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

      <NavBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Titre */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{t('screen.professionals')}</Text>
        </View>

        {/* Filtres et recherche */}
        <ProfessionalsFilters
          filters={filters}
          onFiltersChange={setFilters}
          specialties={SPECIALTIES}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddProfessional={navigateToAdd}
        />

        {/* Chargement */}
        {isLoading && (
          <ActivityIndicator size="large" color={COLORS.orange} style={{ marginTop: 40 }} />
        )}

        {/* Section invitations en attente */}
        {!isLoading && pendingProfessionals.length > 0 && (
          <View style={styles.pendingSection}>
            <View style={styles.pendingSectionHeader}>
              <Icon name="time-outline" size={16} color={COLORS.textLight} />
              <Text style={styles.pendingSectionTitle}>
                Invitations en attente ({pendingProfessionals.length})
              </Text>
            </View>
            {pendingProfessionals.map(p => (
              <PendingRow key={p.id} professional={p} onPress={() => setPendingModalPro(p)} />
            ))}
          </View>
        )}

        {/* Vue cartes — professionnels actifs */}
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

        {/* Vue tableau — professionnels actifs */}
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

      {/* Modal détail invitation en attente */}
      {pendingModalPro !== null && (
        <Modal
          visible
          animationType="fade"
          transparent
          onRequestClose={() => setPendingModalPro(null)}
        >
          <View style={styles.pendingModalOverlay}>
            <View style={styles.pendingModalContent}>
              <View style={styles.pendingModalHeader}>
                <Text style={styles.pendingModalTitle}>Invitation en attente</Text>
                <TouchableOpacity
                  onPress={() => setPendingModalPro(null)}
                  style={styles.pendingCloseBtn}
                  accessibilityLabel="Fermer"
                  accessibilityRole="button"
                >
                  <Icon name="close" size={14} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.pendingDetailRow}>
                <Text style={styles.pendingDetailLabel}>Nom</Text>
                <Text style={styles.pendingDetailValue}>
                  {pendingModalPro.firstName} {pendingModalPro.lastName}
                </Text>
              </View>
              <View style={styles.pendingDetailRow}>
                <Text style={styles.pendingDetailLabel}>Spécialité</Text>
                <Text style={styles.pendingDetailValue}>{pendingModalPro.role}</Text>
              </View>
              <View style={styles.pendingDetailRow}>
                <Text style={styles.pendingDetailLabel}>Établissement</Text>
                <Text style={styles.pendingDetailValue}>{pendingModalPro.company}</Text>
              </View>
              <View style={styles.pendingDetailRow}>
                <Text style={styles.pendingDetailLabel}>E-mail</Text>
                <Text style={styles.pendingDetailValue}>{pendingModalPro.email}</Text>
              </View>
              <View style={styles.pendingDetailRow}>
                <Text style={styles.pendingDetailLabel}>Téléphone</Text>
                <Text style={styles.pendingDetailValue}>{pendingModalPro.phone}</Text>
              </View>

              <TouchableOpacity
                style={styles.pendingResendButton}
                onPress={() => {
                  handleResendInvitation(pendingModalPro.id);
                  setPendingModalPro(null);
                }}
                accessibilityLabel="Renvoyer l'invitation"
                accessibilityRole="button"
              >
                <Text style={styles.pendingResendButtonText}>Renvoyer l'invitation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <BottomNav />
    </SafeAreaView>
  );
};

export default ProfessionalsPage;
