// src/components/Appareillage/AppareillagePage.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from '../common/NavBar/NavBar';
import BottomNav from '../common/BottomNav/BottomNav';
import DeviceCard from './DeviceCard';
import { COLORS } from '../../screens/Home/HomeScreen.styles';

import EyeIcon from '../../assets/images/eye.svg';
import DownloadIcon from '../../assets/images/download.svg';
import TrashIcon from '../../assets/images/trash.svg';

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

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* --- LE GRAND BLOC BLANC CENTRAL --- */}
        <View style={styles.mainContainer}>
          <Text style={styles.pageTitle}>MON APPAREILLAGE</Text>

          {/* --- CARTES OREILLES --- */}
          <DeviceCard
            side="DROITE"
            data={appareilsMock[0]}
            dotColor="#FF0000"
          />
          <DeviceCard
            side="GAUCHE"
            data={appareilsMock[1]}
            dotColor="#00AFA3"
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
            {appareilsMock.map((appareil) => (
              <View key={String(appareil.id)} style={styles.row}>
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
                    <EyeIcon width={14} height={14} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Espace vide à la fin pour ne pas que le BottomNav cache le dernier élément */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- MODALE DE DÉTAILS DYNAMIQUE --- */}
      <Modal visible={isDetailsModalVisible} animationType="fade" transparent={true} onRequestClose={closeDetailsModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* En-tête de la modale */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>VOTRE APPAREIL</Text>
              <TouchableOpacity onPress={closeDetailsModal} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>X</Text>
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
                  {/* Simulation de l'oreille selon la donnée mockée (ici en dur pour l'exemple) */}
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

                {/* Actions */}
                <View style={styles.actionsSection}>
                  <Text style={styles.actionsLabel}>ACTIONS</Text>
                  <View style={styles.bigActionsRow}>
                    <TouchableOpacity style={styles.bigActionButton}>
                      <EyeIcon width={28} height={28} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bigActionButton}>
                      <DownloadIcon width={28} height={28} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bigActionButton}>
                      <TrashIcon width={28} height={28} color="#333" />
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            )}

          </View>
        </View>
      </Modal>

      {/* --- BOTTOM NAV FLOTTANT --- */}
      <View style={styles.bottomNavContainer}>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
};

// --- STYLES REPRIS DU CARNET AUDITION ---
const styles = StyleSheet.create({
  // --- FOND PRINCIPAL ---
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flex: 1 },

  // --- LE GRAND BLOC BLANC CENTRAL ---
  mainContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    marginHorizontal: '5%',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    // Ombre pour l'effet "carte flottante"
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  pageTitle: { fontSize: 18, fontFamily: 'Montserrat-Bold', fontWeight: 'bold', color: COLORS.orange, textAlign: 'center', marginBottom: 25 },
  historyTitle: { fontSize: 14, fontFamily: 'Montserrat-Bold', fontWeight: 'bold', color: '#002C5B', textAlign: 'center', marginTop: 10, marginBottom: 15 },

  // --- TABLEAU HISTORIQUE ---
  tableContainer: { width: '90%', alignSelf: 'center', marginTop: 5, marginBottom: 10 },
  headerRow: { flexDirection: 'row', backgroundColor: '#F0F0F0', paddingVertical: 12, paddingHorizontal: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  headerText: { fontSize: 9, fontFamily: 'Montserrat-Bold', color: '#555', fontWeight: 'bold', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: 'white' },
  rowText: { fontSize: 11, fontFamily: 'Montserrat-Medium', color: '#333', textAlign: 'center' },
  nameText: { fontSize: 11, fontFamily: 'Montserrat-Bold', color: '#333', fontWeight: 'bold', textAlign: 'center' },
  dateText: { fontSize: 10, fontFamily: 'Montserrat-Medium', color: '#333', textAlign: 'center' },
  eyeCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center' },

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
    padding: 20
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#002C5B',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#002C5B',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeBtnText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    color: '#002C5B',
    fontWeight: 'bold'
  },
  detailTable: {
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  detailLabel: {
      flex: 1, // Prend exactement 50% de la largeur
      fontSize: 11,
      fontFamily: 'Montserrat-Medium',
      color: '#666',
      textTransform: 'uppercase'
    },
    detailValue: {
      flex: 1, // Prend les autres 50% de la largeur
      fontSize: 13,
      fontFamily: 'Montserrat-Medium',
      color: '#111',
      textAlign: 'left', // Le texte commence donc pile au centre !
      fontWeight: '500'
    },
  actionsSection: {
    marginTop: 20,
    paddingVertical: 10
  },
  actionsLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat-Medium',
    color: '#666',
    marginBottom: 15,
    textTransform: 'uppercase'
  },
  bigActionsRow: {
      flexDirection: 'row',
      justifyContent: 'center', // Centre les boutons horizontalement
      alignItems: 'center',
      gap: 20 // Espacement propre entre chaque bouton
    },
  bigActionButton: {
    width: 65,
    height: 65,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 }
  },

  // --- POUR LA NAVIGATION ---
  bottomNavContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});

export default AppareillagePage;