import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuditionDocument } from '../../services/carnetauditionService';
import { COLORS, FONT_REGULAR, FONT_SEMIBOLD, FONT_BOLD } from '../../screens/Home/HomeScreen.styles';

interface Props {
  documents: AuditionDocument[];
}

export const CarnetListView: React.FC<Props> = ({ documents }) => {
  // --- ÉTATS POUR LA MODALE DE DÉTAILS ---
  const [selectedDocument, setSelectedDocument] = useState<AuditionDocument | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  // --- FONCTIONS POUR OUVRIR/FERMER LA MODALE ---
  const openDetailsModal = (doc: AuditionDocument) => {
    setSelectedDocument(doc);
    setIsDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalVisible(false);
    setSelectedDocument(null);
  };

  return (
    <View style={localStyles.tableWrapper}>

      {/* --- EN-TÊTE DU TABLEAU --- */}
      <View style={localStyles.headerRow}>
        <Text style={[localStyles.headerCell, localStyles.flex3]}>NOM DU DOCUMENT</Text>
        <Text style={[localStyles.headerCell, localStyles.flex25]}>TYPE</Text>
        <Text style={[localStyles.headerCell, localStyles.flex15]}>ACTIONS</Text>
      </View>

      {/* --- LIGNES DU TABLEAU --- */}
      {documents.map((doc, index) => (
        <View key={String(doc.id)} style={[localStyles.row, index % 2 !== 0 && localStyles.rowAlternate]}>

          <View style={localStyles.col1}>
            <Text style={localStyles.cellPrimary} numberOfLines={1} ellipsizeMode="tail">
              {doc.title ? doc.title : doc.type}
            </Text>
          </View>

          <View style={localStyles.col2}>
            <Text style={localStyles.cellSecondary} numberOfLines={1} ellipsizeMode="tail">{doc.type}</Text>
          </View>

          <View style={localStyles.col4}>
            <TouchableOpacity
              style={[localStyles.actionButton, localStyles.actionButtonPrimary]}
              onPress={() => openDetailsModal(doc)}
              accessibilityLabel={`Voir ${doc.title ?? doc.type}`}
              accessibilityRole="button"
            >
              <Icon name="eye-outline" size={18} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={localStyles.actionButton}
              accessibilityLabel="Télécharger"
              accessibilityRole="button"
            >
              <Icon name="download-outline" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={localStyles.actionButton}
              accessibilityLabel="Supprimer"
              accessibilityRole="button"
            >
              <Icon name="trash-outline" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
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
              <TouchableOpacity
                onPress={closeDetailsModal}
                style={localStyles.closeBtn}
                accessibilityLabel="Fermer"
                accessibilityRole="button"
              >
                <Icon name="close" size={14} color={COLORS.text} />
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
                    <TouchableOpacity style={localStyles.bigActionButton} accessibilityLabel="Voir" accessibilityRole="button">
                      <Icon name="eye-outline" size={26} color={COLORS.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity style={localStyles.bigActionButton} accessibilityLabel="Télécharger" accessibilityRole="button">
                      <Icon name="download-outline" size={26} color={COLORS.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity style={localStyles.bigActionButton} accessibilityLabel="Supprimer" accessibilityRole="button">
                      <Icon name="trash-outline" size={26} color={COLORS.textLight} />
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
  tableWrapper: {
    marginTop: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },

  // ── En-tête ──────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.orange,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  headerCell: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 10,
    color: COLORS.white,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  // ── Lignes ───────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  rowAlternate: {
    backgroundColor: COLORS.offWhite,
  },

  // ── Cellules ─────────────────────────────────────────────────────────────
  cellPrimary: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  cellSecondary: {
    fontFamily: FONT_REGULAR,
    fontSize: 11,
    color: COLORS.text,
    textAlign: 'center',
  },
  // ── Boutons d'action ─────────────────────────────────────────────────────
  actionButton: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
    borderRadius: 13,
  },

  // ── Colonnes ─────────────────────────────────────────────────────────────
  flex3: { flex: 3 },
  flex25: { flex: 2 },
  flex15: { flex: 2 },
  col1: { flex: 3, flexShrink: 1, minWidth: 0, alignItems: 'center', paddingRight: 4 },
  col2: { flex: 2, flexShrink: 1, minWidth: 0, alignItems: 'center', paddingRight: 4 },
  col4: { flex: 2, flexDirection: 'row', gap: 4, justifyContent: 'center', alignItems: 'center' },

  // ── Modale ───────────────────────────────────────────────────────────────
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
    padding: 24,
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
    fontSize: 12,
    fontFamily: FONT_SEMIBOLD,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailValue: {
    flex: 1.5,
    fontSize: 13,
    fontFamily: FONT_REGULAR,
    color: COLORS.text,
  },
  actionsSection: {
    marginTop: 20,
    paddingVertical: 10,
  },
  actionsLabel: {
    fontSize: 12,
    fontFamily: FONT_BOLD,
    color: COLORS.textLight,
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bigActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  bigActionButton: {
    width: 65,
    height: 65,
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});
