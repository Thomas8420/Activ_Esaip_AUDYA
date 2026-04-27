import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles, COLORS } from '../../screens/Professionals/ProfessionalsScreen.styles';
import { Professional } from '../../services/professionalsService';
import CTA1 from '../common/Button/CTA1';

interface ProfessionalCardProps {
  professional: Professional;
  onToggleFavorite: () => void;
  onResendInvitation: () => void;
  onViewProfile: () => void;
  onMessage: () => void;
}

/**
 * Composant affichant une carte d'un professionnel de santé.
 * Inclut l'avatar, les informations de contact, et les actions disponibles.
 */
const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onToggleFavorite,
  onResendInvitation: _onResendInvitation,
  onViewProfile,
  onMessage,
}) => {
  const initials = (professional.firstName[0] + professional.lastName[0]).toUpperCase();

  return (
    <View style={styles.professionalCard}>
      {/* Header: Avatar + Info + Favorite */}
      <View style={styles.cardHeader}>
        <View style={styles.cardAvatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.avatarProfession}>{professional.role}</Text>
            <Text style={styles.avatarCompany}>{professional.company}</Text>
          </View>
        </View>

        {/* Bouton Favoris */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
          accessibilityLabel={professional.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          accessibilityRole="button"
        >
          <Icon
            name={professional.isFavorite ? 'star' : 'star-outline'}
            size={20}
            color={professional.isFavorite ? COLORS.orange : COLORS.textLight}
          />
        </TouchableOpacity>
      </View>

      {/* Nom du professionnel */}
      <Text style={styles.cardName}>{professional.firstName} {professional.lastName}</Text>

      {/* Séparatrice */}
      <View style={styles.separator} />

      {/* Informations de contact */}
      <View style={styles.contactInfo}>
        <View style={styles.contactIcon}>
          <Icon name="call-outline" size={16} color={COLORS.textLight} />
        </View>
        <Text style={styles.contactText}>{professional.phone}</Text>
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactIcon}>
          <Icon name="mail-outline" size={16} color={COLORS.textLight} />
        </View>
        <Text style={styles.contactText}>{professional.email}</Text>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onMessage}
          accessibilityLabel={`Envoyer un message à ${professional.firstName} ${professional.lastName}`}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        <CTA1
          label="Voir la fiche"
          onPress={onViewProfile}
          style={{ flex: 1, paddingVertical: 12, minWidth: 0 }}
          textStyle={{ fontSize: 14 }}
        />
      </View>

    </View>
  );
};

export default React.memo(ProfessionalCard, (prev, next) =>
  prev.professional === next.professional &&
  prev.onToggleFavorite === next.onToggleFavorite &&
  prev.onResendInvitation === next.onResendInvitation &&
  prev.onViewProfile === next.onViewProfile &&
  prev.onMessage === next.onMessage,
);
