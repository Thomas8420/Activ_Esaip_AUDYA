import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuditionDocument } from '../../services/carnetauditionService';
import { COLORS, FONT_REGULAR, FONT_SEMIBOLD, FONT_BOLD } from '../../screens/Home/HomeScreen.styles';

interface Props {
  documents: AuditionDocument[];
  onView: (doc: AuditionDocument) => void;
}

export const CarnetListView: React.FC<Props> = ({ documents, onView }) => (
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
            onPress={() => onView(doc)}
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

  </View>
);

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
});
