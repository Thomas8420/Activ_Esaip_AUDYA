import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../../screens/Carnet_Audition/CarnetAuditionScreen.styles';

export const CarnetGridView = ({ documents }: any) => (
  <View style={styles.gridContainer}>
    {documents.map((doc: any) => (
      <View key={doc.id} style={styles.gridItem}>
        {/* Ici on simule l'image de ton schéma */}
        <View style={styles.imagePlaceholder}>
           <Text style={{color: '#CCC'}}>IMAGE SCHÉMA</Text>
        </View>
        <View style={styles.gridCaption}>
          <Text style={styles.captionLabel}>NOM DE L'IMAGE</Text>
          <Text style={styles.captionValue}>{doc.title || "image.png"}</Text>
        </View>
      </View>
    ))}
  </View>
);