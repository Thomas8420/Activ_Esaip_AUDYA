import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../screens/Professionals/ProfessionalsScreen.styles';
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
      <Text style={styles.listCellSpecialty} numberOfLines={1}>
        {professional.specialty}
      </Text>
      <Text style={styles.listCellName} numberOfLines={1}>
        {professional.lastName}
      </Text>
      <Text style={styles.listCellName} numberOfLines={1}>
        {professional.firstName}
      </Text>
      <View style={styles.listCellActions}>
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.listActionButton}
        >
          <Text style={styles.listActionIcon}>
            {professional.isFavorite ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onViewProfile}
          style={[styles.listActionButton, styles.listActionButtonPrimary]}
        >
          <Text style={styles.listActionIcon}>👁</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(ProfessionalListRow);
