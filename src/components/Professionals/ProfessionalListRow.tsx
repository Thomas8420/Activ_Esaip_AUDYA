import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles, COLORS } from '../../screens/Professionals/ProfessionalsScreen.styles';
import { Professional } from '../../services/professionalsService';

interface ProfessionalListRowProps {
  professional: Professional;
  onToggleFavorite: () => void;
  onViewProfile: () => void;
  isAlternate: boolean;
}

/**
 * Composant affichant une ligne dans la vue tableau des professionnels.
 * Colonnes: Spécialité, Nom, Prénom, Actions (favoris + voir fiche).
 */
const ProfessionalListRow: React.FC<ProfessionalListRowProps> = ({
  professional,
  onToggleFavorite,
  onViewProfile,
  isAlternate,
}) => {
  return (
    <View style={[styles.listRow, isAlternate && styles.listRowAlternate]}>
      <Text style={styles.listCellSpecialty} numberOfLines={1} ellipsizeMode="tail">
        {professional.specialty}
      </Text>
      <Text style={styles.listCellName} numberOfLines={1} ellipsizeMode="tail">
        {professional.lastName}
      </Text>
      <Text style={styles.listCellName} numberOfLines={1} ellipsizeMode="tail">
        {professional.firstName}
      </Text>
      <View style={styles.listCellActions}>
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.listActionButton}
          accessibilityLabel={professional.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          accessibilityRole="button"
        >
          <Icon
            name={professional.isFavorite ? 'star' : 'star-outline'}
            size={14}
            color={professional.isFavorite ? COLORS.orange : COLORS.textLight}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onViewProfile}
          style={[styles.listActionButton, styles.listActionButtonPrimary]}
          accessibilityLabel={`Voir la fiche de ${professional.firstName} ${professional.lastName}`}
          accessibilityRole="button"
        >
          <Icon name="eye-outline" size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(ProfessionalListRow, (prev, next) =>
  prev.professional === next.professional &&
  prev.isAlternate === next.isAlternate &&
  prev.onToggleFavorite === next.onToggleFavorite &&
  prev.onViewProfile === next.onViewProfile,
);
