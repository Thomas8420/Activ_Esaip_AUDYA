import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuditionDocument } from '../../services/carnetauditionService';

import EyeIcon from '../../assets/images/eye.svg';
import DownloadIcon from '../../assets/images/download.svg';
import TrashIcon from '../../assets/images/trash.svg';

interface Props {
  documents: AuditionDocument[];
}

export const CarnetListView: React.FC<Props> = ({ documents }) => {
  return (
    <View style={localStyles.container}>

      <View style={localStyles.headerRow}>
        <Text style={[localStyles.headerText, localStyles.flex3]}>NOM DU DOCUMENT</Text>
        <Text style={[localStyles.headerText, localStyles.flex25]}>TYPE DE DOCUMENT</Text>
        <Text style={[localStyles.headerText, localStyles.flex15Left]}>DATE</Text>
        <Text style={[localStyles.headerText, localStyles.flex15Center]}>ACTIONS</Text>
      </View>

      {documents.map((doc, index) => (
        <View key={doc.id || index} style={localStyles.row}>

          <View style={localStyles.col1}>
            <View style={localStyles.eyeCircle}>
              <EyeIcon width={14} height={14} fill="#333" />
            </View>
            <Text style={localStyles.nameText} numberOfLines={1}>
              {doc.name}
            </Text>
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
              <TouchableOpacity>
                <DownloadIcon width={14} height={14} fill="#333" />
              </TouchableOpacity>
              <View style={localStyles.spacer} />
              <TouchableOpacity>
                <TrashIcon width={14} height={14} fill="#333" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      ))}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 9,
    fontFamily: 'Montserrat-Bold',
    color: '#888',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: 'white',
  },
  rowText: {
    fontSize: 11,
    fontFamily: 'Montserrat-Medium',
    color: '#333',
  },
  nameText: {
    fontSize: 10,
    fontFamily: 'Montserrat-Medium',
    color: '#333',
    //flex: 1,
    flexShrink: 1,
    marginLeft: 8,
  },
  dateText: {
    fontSize: 10,
    fontFamily: 'Montserrat-Medium',
    color: '#333',
  },
  eyeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  spacer: {
    width: 8,
  },
  flex3: { flex: 3 },
  flex25: { flex: 2.5 },
  flex15Left: { flex: 1.5, paddingLeft: 10 },
  flex15Center: { flex: 1.5, textAlign: 'center' },
  col1: { flex: 3, flexDirection: 'row', alignItems: 'center', paddingRight: 5 },
  col2: { flex: 2.5, justifyContent: 'center', paddingRight: 5 },
  col3: { flex: 1.5, justifyContent: 'center', paddingLeft: 10 },
  col4: { flex: 1.5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }
});