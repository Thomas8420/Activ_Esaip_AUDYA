// src/components/Appareillage/AppareillagePage.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import DeviceCard from './DeviceCard';
import { COLORS, FONT_BOLD, FONT_REGULAR, FONT_SEMIBOLD } from '../../screens/Home/HomeScreen.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../../context/LanguageContext';

export interface AppareilDetails {
  id: number;
  type: string;
  marque: string;
  modele: string;
  date: string;
  serial: string;
  rppsP: string;
  rppsR: string;
  classe: number;
}

// Nos fausses données pour le tableau
const appareilsMock: AppareilDetails[] = [
  { id: 1, type: "Contour d'oreilles", marque: 'Phonak', modele: 'Lumity', date: '04/07/2018', serial: '76543456789', rppsP: '10003439196', rppsR: '12121212121', classe: 1 },
  { id: 2, type: "Contour d'oreilles", marque: 'Starkey', modele: 'Starkey', date: '11/09/2024', serial: '98765432100', rppsP: '20003439196', rppsR: '32323232323', classe: 2 },
];

const AppareillagePage = () => {
  const { t } = useLanguage();
  // --- ÉTATS POUR LA MODALE DE DÉTAILS ---
  const [selectedAppareil, setSelectedAppareil] = useState<AppareilDetails | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  // --- FONCTIONS POUR OUVRIR/FERMER LA MODALE ---
  const openDetailsModal = (appareil: AppareilDetails) => {
    setSelectedAppareil(appareil);
    setIsDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalVisible(false);
    setSelectedAppareil(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <NavBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* --- LE GRAND BLOC BLANC CENTRAL --- */}
        <View style={styles.mainContainer}>
          <Text style={styles.pageTitle}>{t('screen.hearing')}</Text>

          {/* --- CARTES OREILLES --- */}
          <DeviceCard
            side="DROITE"
            data={appareilsMock[0]}
            dotColor={COLORS.orange}
          />
          <DeviceCard
            side="GAUCHE"
            data={appareilsMock[1]}
            dotColor={COLORS.teal}
          />

          <Text style={styles.historyTitle}>HISTORIQUE APPAREILLAGE</Text>

          {/* --- CONTENEUR DU TABLEAU --- */}
          <View style={styles.tableContainer}>

            {/* --- EN-TÊTE DU TABLEAU --- */}
            <View style={styles.headerRow}>
              <Text style={[styles.headerText, styles.flex3]}>TYPE D'APPAREIL</Text>
              <Text style={[styles.headerText, styles.flex25]}>MARQUE</Text>
              <Text style={[styles.headerText, styles.flex15Left]}>DATE</Text>
              <Text style={[styles.headerText, styles.flex15Center]}>ACTION</Text>
            </View>

            {/* --- LIGNES DU TABLEAU --- */}
            {appareilsMock.map((appareil, index) => (
              <View key={String(appareil.id)} style={[styles.row, index % 2 !== 0 && styles.rowAlternate]}>
                <View style={styles.col1}>
                  <Text style={styles.nameText} numberOfLines={1}>{appareil.type}</Text>
                </View>
                <View style={styles.col2}>
                  <Text style={styles.rowText} numberOfLines={1}>{appareil.marque}</Text>
                </View>
                <View style={styles.col3}>
                  <Text style={styles.dateText}>{appareil.date.substring(0, 5)}</Text>
                </View>
                <View style={styles.col4}>
                  <TouchableOpacity
                    style={styles.eyeCircle}
                    onPress={() => openDetailsModal(appareil)}
                    accessibilityLabel={`Voir détails ${appareil.marque}`}
                    accessibilityRole="button"
                  >
                    <Icon name="eye-outline" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* --- MODALE DE DÉTAILS DYNAMIQUE (rendu conditionnel — évite le bug Android) --- */}
      {isDetailsModalVisible && (
        <Modal visible animationType="fade" transparent={true} onRequestClose={closeDetailsModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              {/* En-tête de la modale */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>VOTRE APPAREIL</Text>
                <TouchableOpacity onPress={closeDetailsModal} style={styles.closeBtn} accessibilityLabel="Fermer" accessibilityRole="button">
                  <Icon name="close" size={14} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              {/* Détails du document */}
              {selectedAppareil && (
                <View style={styles.detailTable}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>TYPE</Text>
                    <Text style={styles.detailValue}>{selectedAppareil.type}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>MARQUE</Text>
                    <Text style={styles.detailValue}>{selectedAppareil.marque}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>OREILLE</Text>
                    <Text style={styles.detailValue}>{selectedAppareil.id === appareilsMock[0].id ? 'DROITE' : 'GAUCHE'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>DATE</Text>
                    <Text style={styles.detailValue}>{selectedAppareil.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>N° SÉRIE</Text>
                    <Text style={styles.detailValue}>{selectedAppareil.serial}</Text>
                  </View>

                  {/* Bouton téléchargement */}
                  <TouchableOpacity
                    style={styles.downloadButton}
                    accessibilityLabel={t('device.download')}
                    accessibilityRole="button"
                  >
                    <Text style={styles.downloadButtonText}>{t('device.download')}</Text>
                  </TouchableOpacity>

                </View>
              )}

            </View>
          </View>
        </Modal>
      )}

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // --- FOND PRINCIPAL ---
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 15, paddingBottom: 100 },

  // --- LE GRAND BLOC BLANC CENTRAL ---
  mainContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  pageTitle: {
    fontSize: 20,
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
  },
  historyTitle: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: COLORS.textLight,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 15,
  },

  // --- TABLEAU HISTORIQUE ---
  tableContainer: { marginTop: 5, marginBottom: 10, borderRadius: 8, overflow: 'hidden' },
  headerRow: { flexDirection: 'row', backgroundColor: COLORS.orange, paddingVertical: 10, paddingHorizontal: 12 },
  headerText: { fontFamily: FONT_SEMIBOLD, fontSize: 11, color: COLORS.white, textAlign: 'center', textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.white },
  rowAlternate: { backgroundColor: COLORS.offWhite },
  rowText: { fontFamily: FONT_REGULAR, fontSize: 13, color: COLORS.text, textAlign: 'center' },
  nameText: { fontFamily: FONT_SEMIBOLD, fontSize: 13, color: COLORS.teal, textAlign: 'center' },
  dateText: { fontFamily: FONT_REGULAR, fontSize: 12, color: COLORS.textLight, textAlign: 'center' },
  eyeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- COLONNES DU TABLEAU ---
  flex3: { flex: 3 }, flex25: { flex: 2.5 }, flex15Left: { flex: 1.5 }, flex15Center: { flex: 1.5 },
  col1: { flex: 3, justifyContent: 'center' },
  col2: { flex: 2.5, justifyContent: 'center' },
  col3: { flex: 1.5, justifyContent: 'center' },
  col4: { flex: 1.5, alignItems: 'center', justifyContent: 'center' },

  // --- MODALE ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: COLORS.orange,
    textTransform: 'uppercase',
  },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTable: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONT_SEMIBOLD,
    color: COLORS.textLight,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT_SEMIBOLD,
    color: COLORS.text,
    textAlign: 'left',
  },
  downloadButton: {
    marginTop: 20,
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontFamily: FONT_BOLD,
    fontSize: 14,
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});

export default AppareillagePage;
