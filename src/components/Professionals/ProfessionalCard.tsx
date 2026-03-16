import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../../screens/Professionals/ProfessionalsScreen.styles';
import { Professional } from '../../services/professionalsService';

interface ProfessionalCardProps {
  professional: Professional;
  onToggleFavorite: () => void;
  onResendInvitation: () => void;
  onViewProfile: () => void;
}

/**
 * Composant affichant une carte d'un professionnel de santé.
 * Inclut l'avatar, les informations de contact, et les actions disponibles.
 */
const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onToggleFavorite,
  onResendInvitation,
  onViewProfile,
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
        <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
          <Text style={styles.favoriteText}>
            {professional.isFavorite ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nom du professionnel */}
      <Text style={styles.cardName}>{professional.firstName} {professional.lastName}</Text>

      {/* Séparatrice */}
      <View style={styles.separator} />

      {/* Informations de contact */}
      <View style={styles.contactInfo}>
        <View style={styles.contactIcon}>
          <Text style={{ fontSize: 16 }}>📱</Text>
        </View>
        <Text style={styles.contactText}>{professional.phone}</Text>
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactIcon}>
          <Text style={{ fontSize: 16 }}>✉️</Text>
        </View>
        <Text style={styles.contactText}>{professional.email}</Text>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={onViewProfile}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
            Voir la fiche
          </Text>
        </TouchableOpacity>
      </View>

      {/* Avertissement d'invitation en attente */}
      {professional.isInvitationPending && (
        <View>
          <View style={styles.invitationWarning}>
            <Text style={styles.invitationWarningText}>
              <Text style={styles.invitationWarningTextBold}>
                L'invitation n'a pas encore été validée.{'\n'}
              </Text>
              Vous ne pouvez pas utiliser la messagerie avec cet utilisateur.
            </Text>
          </View>

          <TouchableOpacity style={styles.resendInvitationButton} onPress={onResendInvitation}>
            <Text style={styles.resendInvitationButtonText}>Renvoyer l'invitation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default React.memo(ProfessionalCard);
