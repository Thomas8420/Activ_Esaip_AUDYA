import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../screens/Carnet_Audition/CarnetAuditionScreen.styles';
import { COLORS } from '../../screens/Home/HomeScreen.styles';
import { AuditionDocument } from '../../services/carnetauditionService';

interface Props {
  documents: AuditionDocument[];
  onView: (doc: AuditionDocument) => void;
}

export const CarnetTimelineView = ({ documents, onView }: Props) => (
  <View style={styles.timelineContainer}>
    <View style={styles.verticalLine} />
    {documents.map((doc) => (
      <View key={doc.id} style={[styles.timelineItem, doc.side === 'left' ? styles.leftItem : styles.rightItem]}>
        <View style={[styles.timelineIconWrapper, doc.side === 'left' ? styles.iconLeft : styles.iconRight]}>
          <Icon
            name="document-text-outline"
            size={20}
            color={doc.side === 'left' ? COLORS.orange : COLORS.teal}
          />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.author}>{doc.author}</Text>
          <Text style={styles.dateText}>le {doc.date} - 11:24</Text>
          {!!doc.patientName && (
            <Text style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 4 }}>
              Patient : {doc.patientName}
            </Text>
          )}
          <Text style={styles.docTitle}>{doc.title || doc.type}</Text>
          <View style={styles.actionIcons}>
            <TouchableOpacity
              style={styles.timelineActionBtn}
              onPress={() => onView(doc)}
              accessibilityLabel="Voir"
              accessibilityRole="button"
            >
              <Icon name="eye-outline" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timelineActionBtn}
              accessibilityLabel="Télécharger"
              accessibilityRole="button"
            >
              <Icon name="download-outline" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timelineActionBtn}
              accessibilityLabel="Supprimer"
              accessibilityRole="button"
            >
              <Icon name="trash-outline" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ))}
  </View>
);
