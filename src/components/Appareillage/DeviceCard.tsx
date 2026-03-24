// src/components/Appareillage/DeviceCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppareilDetails } from './AppareillagePage';
import { COLORS, FONT_BOLD, FONT_REGULAR, FONT_SEMIBOLD } from '../../screens/Home/HomeScreen.styles';

// Importe tes SVGs ici quand tu les auras !
import OreilleDroiteIcon from '../../assets/images/oreille-droite.svg';
import OreilleGaucheIcon from '../../assets/images/oreille-gauche.svg';
import { useLanguage } from '../../context/LanguageContext';

interface DeviceCardProps {
  readonly side: 'DROITE' | 'GAUCHE';
  readonly data: AppareilDetails;
  readonly dotColor: string;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ side, data, dotColor }) => {
  const { t } = useLanguage();
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t(side === 'DROITE' ? 'device.ear.right' : 'device.ear.left')}</Text>

      {/* --- ZONE POUR TON ICÔNE SVG --- */}
      <View style={styles.iconContainer}>
              {side === 'DROITE' ? (
                 <OreilleDroiteIcon width={60} height={60} />
              ) : (
                 <OreilleGaucheIcon width={60} height={60} />
              )}
            </View>

      {/* --- ENCADRÉ DES DÉTAILS --- */}
      <View style={styles.detailsBox}>
        <Text style={styles.detailText}>
            <Text style={styles.boldLabel}>TYPE : </Text>{data.type}
        </Text>
        <Text style={styles.detailText}>
            <Text style={styles.boldLabel}>MARQUE : </Text>{data.marque}
        </Text>
        <Text style={styles.detailText}>
            <Text style={styles.boldLabel}>MODÈLE : </Text>{data.modele}
        </Text>
        <Text style={styles.detailText}>
            <Text style={styles.boldLabel}>APPAREILLAGE : </Text>{data.date}
        </Text>
      </View>

      {/* --- CLASSE --- */}
      <Text style={styles.classText}>Classe : {data.classe}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F8F8',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    // Ombre légère comme sur le mockup
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: FONT_BOLD, // Si tu as cette police, sinon fontWeight fera le travail
    color: COLORS.text,
    marginBottom: 15,
  },
  iconContainer: {
    marginBottom: 20,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Simulation de l'oreille (à supprimer quand tu auras le SVG)
  earPlaceholder: {
    width: 40,
    height: 55,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  detailsBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.teal,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  detailText: {
    fontSize: 12,
    fontFamily: FONT_REGULAR,
    color: '#1E3A5F', // Texte en Bleu marine
    marginBottom: 4,
    lineHeight: 18,
  },
  boldLabel: {
    fontFamily: FONT_BOLD,
  },
  classText: {
    marginTop: 15,
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: COLORS.text,
  }
});

export default DeviceCard;