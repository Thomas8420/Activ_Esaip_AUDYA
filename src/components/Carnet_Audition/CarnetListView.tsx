import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../screens/Carnet_Audition/CarnetAuditionScreen.styles';
import EyeIcon from '../../assets/images/eye.svg';
import DownloadIcon from '../../assets/images/download.svg';
import TrashIcon from '../../assets/images/trash.svg';

export const CarnetListView = ({ documents }: any) => (
  <View style={styles.tableContainer}>
    {/* Header Gris */}
    <View style={styles.tableHeader}>
      <Text style={[styles.headerText, {flex: 0.5}]}></Text>
      <Text style={[styles.headerText, {flex: 2}]}>NOM DU DOCUMENT</Text>
      <Text style={[styles.headerText, {flex: 2}]}>TYPE DE DOCUMENT</Text>
      <Text style={[styles.headerText, {flex: 1}]}>DATE</Text>
      <Text style={[styles.headerText, {flex: 1.5, textAlign: 'center'}]}>ACTIONS</Text>
    </View>

    {/* Lignes du tableau */}
    {documents.map((doc: any) => (
      <View key={doc.id} style={styles.tableRow}>
        <TouchableOpacity style={{flex: 0.5}}>
          <View style={styles.eyeCircle}><EyeIcon width={14} height={14} stroke="#000" /></View>
        </TouchableOpacity>
        <Text style={[styles.rowText, {flex: 2, fontWeight: '500'}]} numberOfLines={1}>{doc.title || doc.type}</Text>
        <Text style={[styles.rowText, {flex: 2, color: '#666'}]}>{doc.type}</Text>
        <Text style={[styles.rowText, {flex: 1}]}>{doc.date}</Text>
        <View style={[styles.rowActions, {flex: 1.5}]}>
           <TouchableOpacity><DownloadIcon width={20} height={20} stroke="#000" /></TouchableOpacity>
           <TouchableOpacity><TrashIcon width={20} height={20} stroke="#000" /></TouchableOpacity>
        </View>
      </View>
    ))}
  </View>
);