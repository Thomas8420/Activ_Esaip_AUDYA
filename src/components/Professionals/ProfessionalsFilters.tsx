import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../screens/Professionals/ProfessionalsScreen.styles';
export interface Filters {
  searchQuery: string;
  itemsPerPage: number;
  specialty: string;
  zipCode: string;
  city: string;
}

interface ProfessionalsFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  specialties: string[];
  viewMode: 'card' | 'list';
  onViewModeChange: (mode: 'card' | 'list') => void;
  readonly onAddProfessional?: () => void;
}

/**
 * Composant de filtres pour les professionnels.
 * Permet la recherche avancée avec 4 critères:
 * 1. Nombre d'items à afficher
 * 2. Spécialité
 * 3. Code postal
 * 4. Ville
 */
const ProfessionalsFilters: React.FC<ProfessionalsFiltersProps> = ({
  filters,
  onFiltersChange,
  specialties,
  viewMode,
  onViewModeChange,
  onAddProfessional,
}) => {
  const [specialtyOpen, setSpecialtyOpen] = React.useState(false);
  const [itemsPerPageOpen, setItemsPerPageOpen] = React.useState(false);

  const itemsPerPageOptions = [4, 8, 16, 32];

  const handleSearchChange = (text: string) => {
    onFiltersChange({ ...filters, searchQuery: text });
  };

  const handleItemsPerPageChange = (value: number) => {
    onFiltersChange({ ...filters, itemsPerPage: value });
    setItemsPerPageOpen(false);
  };

  const handleSpecialtyChange = (value: string) => {
    onFiltersChange({ ...filters, specialty: value });
    setSpecialtyOpen(false);
  };

  const handleZipCodeChange = (text: string) => {
    onFiltersChange({ ...filters, zipCode: text });
  };

  const handleCityChange = (text: string) => {
    onFiltersChange({ ...filters, city: text });
  };

  return (
    <View style={styles.filtersContainer}>
      {/* En-tête: "Filtres" + Mode selector */}
      <View style={styles.filtersHeader}>
        <Text style={styles.filtersTitle}>Filtres</Text>
        <View style={styles.filtersModeSelector}>
          <TouchableOpacity
            style={[styles.modeIcon, viewMode === 'card' && styles.modeIconActive]}
            onPress={() => onViewModeChange('card')}
            accessibilityLabel="Vue grille"
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === 'card' }}
          >
            <Icon
              name="grid-outline"
              size={20}
              color={viewMode === 'card' ? '#E8622A' : '#999999'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeIcon, viewMode === 'list' && styles.modeIconActive]}
            onPress={() => onViewModeChange('list')}
            accessibilityLabel="Vue liste"
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === 'list' }}
          >
            <Icon
              name="list-outline"
              size={20}
              color={viewMode === 'list' ? '#E8622A' : '#999999'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre de recherche principale */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom ou spécialité"
        placeholderTextColor="#999"
        value={filters.searchQuery}
        onChangeText={handleSearchChange}
      />

      {/* Ligne 1: Nombre d'items + Spécialité */}
      <View style={styles.filterRow}>
        {/* Dropdown: Nombre d'items à afficher */}
        <View style={[styles.filterDropdownWrapper, { marginRight: 8 }]}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setItemsPerPageOpen(!itemsPerPageOpen)}
          >
            <Text style={styles.filterButtonText}>{filters.itemsPerPage} items</Text>
            <Text style={styles.filterDropdownChevron}>▼</Text>
          </TouchableOpacity>
          {itemsPerPageOpen && (
            <View style={styles.filterDropdownMenuOverlay}>
              {itemsPerPageOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleItemsPerPageChange(option)}
                  style={styles.filterDropdownItem}
                >
                  <Text style={styles.filterButtonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Dropdown: Spécialité */}
        <View style={styles.filterDropdownWrapper}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSpecialtyOpen(!specialtyOpen)}
          >
            <Text style={styles.filterButtonText}>
              {filters.specialty || 'Spécialité'}
            </Text>
            <Text style={styles.filterDropdownChevron}>▼</Text>
          </TouchableOpacity>
          {specialtyOpen && (
            <View style={[styles.filterDropdownMenuOverlay, { maxHeight: 200 }]}>
              <TouchableOpacity
                onPress={() => handleSpecialtyChange('')}
                style={styles.filterDropdownItem}
              >
                <Text style={styles.filterButtonText}>Tous</Text>
              </TouchableOpacity>
              <ScrollView style={{ maxHeight: 150 }}>
                {specialties.map(specialty => (
                  <TouchableOpacity
                    key={specialty}
                    onPress={() => handleSpecialtyChange(specialty)}
                    style={styles.filterDropdownItem}
                  >
                    <Text style={styles.filterButtonText}>{specialty}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Ligne 2: Code Postal + Ville */}
      <View style={styles.filterRow}>
        <TextInput
          style={[styles.searchInput, { flex: 1, marginRight: 8, marginBottom: 0 }]}
          placeholder="Code postal"
          placeholderTextColor="#999"
          value={filters.zipCode}
          onChangeText={handleZipCodeChange}
          keyboardType="number-pad"
        />
        <TextInput
          style={[styles.searchInput, { flex: 1, marginBottom: 0 }]}
          placeholder="Ville"
          placeholderTextColor="#999"
          value={filters.city}
          onChangeText={handleCityChange}
        />
      </View>

      {/* Bouton Ajouter un professionnel */}
      <TouchableOpacity style={styles.addProfessionalButton} onPress={onAddProfessional}>
        <Text style={styles.addProfessionalButtonText}>
          Ajouter un{'\n'}professionnel de santé
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfessionalsFilters;
