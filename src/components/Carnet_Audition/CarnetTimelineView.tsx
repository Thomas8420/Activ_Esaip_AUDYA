import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../screens/Carnet_Audition/CarnetAuditionScreen.styles';
import { AuditionDocument } from '../../services/carnetauditionService';

// Imports des icônes
import FileIcon from '../../assets/images/dossier-patient.svg';
import EyeIcon from '../../assets/images/eye.svg';
import DownloadIcon from '../../assets/images/download.svg';
import TrashIcon from '../../assets/images/trash.svg';

interface Props { documents: AuditionDocument[]; }

export const CarnetTimelineView = ({ documents }: Props) => (
  <View style={styles.timelineContainer}>
    <View style={styles.verticalLine} />
    {documents.map((doc) => (
      <View key={doc.id} style={[styles.timelineItem, doc.side === 'left' ? styles.leftItem : styles.rightItem]}>
        <View style={[styles.timelineIconWrapper, doc.side === 'left' ? styles.iconLeft : styles.iconRight]}>
           <FileIcon width={16} height={16} fill={doc.side === 'left' ? '#F15A24' : '#3ABFBF'} />
        </View>
        {/* ✅ ICI : C'était un <div>, c'est devenu un <View> */}
        <View style={styles.itemContent}>
          <Text style={styles.author}>{doc.author}</Text>
          <Text style={styles.dateText}>le {doc.date} - 11:24</Text>
          {!!doc.patientName && (
            <Text style={{fontSize: 11, marginBottom: 4}}>
              <Text style={{fontWeight: 'bold'}}>Patient : </Text>{doc.patientName}
            </Text>
          )}
          <Text style={styles.docTitle}>{doc.title || doc.type}</Text>
          <View style={styles.actionIcons}>
            <TouchableOpacity><EyeIcon width={22} height={22} fill="none" stroke="#000" strokeWidth={1.5} /></TouchableOpacity>
            <TouchableOpacity><DownloadIcon width={22} height={22} fill="none" stroke="#000" strokeWidth={1.5} /></TouchableOpacity>
            <TouchableOpacity><TrashIcon width={22} height={22} fill="none" stroke="#000" strokeWidth={1.5} /></TouchableOpacity>
          </View>
        </View>
      </View>
    ))}
  </View>
);