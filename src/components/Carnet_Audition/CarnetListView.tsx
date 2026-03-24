import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { AuditionDocument } from '../../services/carnetauditionService';

import EyeIcon from '../../assets/images/eye.svg';
import DownloadIcon from '../../assets/images/download.svg';
import TrashIcon from '../../assets/images/trash.svg';

interface Props {
  documents: AuditionDocument[];
}

export const CarnetListView: React.FC<Props> = ({ documents }) => {
  // --- ÉTATS POUR LA MODALE DE DÉTAILS ---
  const [selectedDocument, setSelectedDocument] = useState<AuditionDocument | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  // --- FONCTIONS POUR OUVRIR/FERMER LA MODALE ---
  const openDetailsModal = (doc: AuditionDocument) => {
    setSelectedDocument(doc); // On mémorise le document cliqué
    setIsDetailsModalVisible(true); // On ouvre la fenêtre
  };

  const closeDetailsModal = () => {
    setIsDetailsModalVisible(false);
    setSelectedDocument(null);
  };

  return (
    <View style={localStyles.container}>

      {/* --- EN-TÊTE DU TABLEAU --- */}
      <View style={localStyles.headerRow}>
        <Text style={[localStyles.headerText, localStyles.flex3]}>NOM DU DOCUMENT</Text>
        <Text style={[localStyles.headerText, localStyles.flex25]}>TYPE DE DOCUMENT</Text>
        <Text style={[localStyles.headerText, localStyles.flex15Left]}>DATE</Text>
        <Text style={[localStyles.headerText, localStyles.flex15Center]}>ACTIONS</Text>
      </View>

      {/* --- LIGNES DU TABLEAU --- */}
      {documents.map((doc) => (
        <View key={String(doc.id)} style={localStyles.row}>

         <View style={localStyles.col1}>
            <TouchableOpacity
              style={localStyles.eyeCircle}
              onPress={() => openDetailsModal(doc)}
              accessibilityLabel={`Voir ${doc.title ?? doc.type}`}
              accessibilityRole="button"
            >
              <EyeIcon width={14} height={14} color="#333" />
            </TouchableOpacity>

            <View style={{ flex: 1, paddingLeft: 8 }}>
              <Text style={localStyles.nameText} numberOfLines={1}>
                  {doc.title ? doc.title : doc.type}
              </Text>
            </View>
          </View>

          <View style={localStyles.col2}>
            <Text style={localStyles.rowText} numberOfLines={1}>
              {doc.type}
            </Text>
          </View>

          <View style={localStyles.col3}>
            <Text style={localStyles.dateText}>
              {doc.date ? doc.date.replace('2024', '24').replace('2025', '25') : ''}
            </Text>
          </View>

          <View style={localStyles.col4}>
            <View style={localStyles.actionsContainer}>
              <TouchableOpacity accessibilityLabel="Télécharger" accessibilityRole="button">
                <DownloadIcon width={14} height={14} color="#333" />
              </TouchableOpacity>
              <View style={localStyles.spacer} />
              <TouchableOpacity accessibilityLabel="Supprimer" accessibilityRole="button">
                <TrashIcon width={14} height={14} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      ))}

      {/* --- MODALE DE DÉTAILS DYNAMIQUE --- */}
      <Modal visible={isDetailsModalVisible} animationType="fade" transparent={true}>
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>

            {/* En-tête de la modale */}
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitle}>VOTRE CARNET AUDITION</Text>
              <TouchableOpacity onPress={closeDetailsModal} style={localStyles.closeBtn}>
                <Text style={localStyles.closeBtnText}>X</Text>
              </TouchableOpacity>
            </View>

            {/* Détails du document */}
            {selectedDocument && (
              <View style={localStyles.detailTable}>
                <View style={localStyles.detailRow}>
                                  <Text style={localStyles.detailLabel}>PATIENT</Text>
                                  <Text style={localStyles.detailValue}>
                                    {selectedDocument.patientName ? selectedDocument.patientName : 'Non renseigné'}
                                  </Text>
                                </View>

                {/* DONNÉES DYNAMIQUES ICI */}
                <View style={localStyles.detailRow}>
                                  <Text style={localStyles.detailLabel}>NOM DU DOCUMENT</Text>
                                  <Text style={localStyles.detailValue}>
                                    {selectedDocument.title ? selectedDocument.title : selectedDocument.type}
                                  </Text>
                                </View>
                <View style={localStyles.detailRow}>
                  <Text style={localStyles.detailLabel}>TYPE DE DOCUMENT</Text>
                  <Text style={localStyles.detailValue}>{selectedDocument.type}</Text>
                </View>
                <View style={localStyles.detailRow}>
                  <Text style={localStyles.detailLabel}>DATE</Text>
                  <Text style={localStyles.detailValue}>{selectedDocument.date}</Text>
                </View>

                {/* Actions */}
                <View style={localStyles.actionsSection}>
                  <Text style={localStyles.actionsLabel}>ACTIONS</Text>
                  <View style={localStyles.bigActionsRow}>
                    <TouchableOpacity style={localStyles.bigActionButton}>
                      <EyeIcon width={28} height={28} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={localStyles.bigActionButton}>
                      <DownloadIcon width={28} height={28} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={localStyles.bigActionButton}>
                      <TrashIcon width={28} height={28} color="#333" />
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
};

const localStyles = StyleSheet.create({
  // ... Styles du tableau ...
  container: { marginTop: 15 },
  headerRow: { flexDirection: 'row', backgroundColor: '#F0F0F0', paddingVertical: 12, paddingHorizontal: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  headerText: { fontSize: 9, fontFamily: 'Montserrat-Bold', color: '#888', fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: 'white' },
  rowText: { fontSize: 11, fontFamily: 'Montserrat-Medium', color: '#333' },
  nameText: { fontSize: 11, fontFamily: 'Montserrat-Medium', color: '#333' },
  dateText: { fontSize: 10, fontFamily: 'Montserrat-Medium', color: '#333' },
  eyeCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center' },
  actionsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 6, paddingHorizontal: 8, backgroundColor: '#EAEAEA', borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 1, shadowOffset: { width: 0, height: 1 } },
  spacer: { width: 8 },
  flex3: { flex: 3 }, flex25: { flex: 2.5 }, flex15Left: { flex: 1.5, paddingLeft: 10 }, flex15Center: { flex: 1.5, textAlign: 'center' },
  col1: { flex: 3, flexDirection: 'row', alignItems: 'center', paddingRight: 5 }, col2: { flex: 2.5, justifyContent: 'center', paddingRight: 5 }, col3: { flex: 1.5, justifyContent: 'center', paddingLeft: 10 }, col4: { flex: 1.5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },

  // --- Styles de la Modale ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#002C5B', // Bleu foncé style Audya
    fontWeight: 'bold',
  },
  closeBtn: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: '#002C5B',
    justifyContent: 'center', alignItems: 'center'
  },
  closeBtnText: {
    fontSize: 12, color: '#002C5B', fontWeight: 'bold'
  },
  detailTable: {
    borderTopWidth: 1, borderTopColor: '#DDD',
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: '#EEE',
  },
  detailLabel: {
    fontSize: 11, fontFamily: 'Montserrat-Medium', color: '#555', flex: 1,
  },
  detailValue: {
    fontSize: 12, fontFamily: 'Montserrat-Medium', color: '#000', flex: 1.5, textAlign: 'left',
  },
  actionsSection: {
    marginTop: 15, paddingVertical: 10,
  },
  actionsLabel: {
    fontSize: 11, fontFamily: 'Montserrat-Medium', color: '#555', marginBottom: 15,
  },
  bigActionsRow: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
  },
  bigActionButton: {
    width: 65, height: 65, backgroundColor: '#EAEAEA', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }
  },
});