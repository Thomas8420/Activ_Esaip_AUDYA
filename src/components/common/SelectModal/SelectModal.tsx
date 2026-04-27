import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheetModal from '../BottomSheetModal/BottomSheetModal';
import { COLORS, FONT_REGULAR, FONT_SEMIBOLD } from '../../../screens/Home/HomeScreen.styles';

const LIST_MAX_HEIGHT = Dimensions.get('window').height * 0.55;

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
}

/**
 * SelectModal — Bottom sheet de sélection unique, identique au système Ma Santé.
 * Handle, titre, liste scrollable avec checkmark orange sur la valeur sélectionnée.
 */
const SelectModal: React.FC<Props> = ({ visible, onClose, title, options, value, onSelect }) => (
  <BottomSheetModal visible={visible} onClose={onClose}>
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <Text style={styles.title}>{title}</Text>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false} bounces={false}>
        {options.map(option => {
          const selected = option === value;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.item, selected && styles.itemSelected]}
              onPress={() => { onSelect(option); onClose(); }}
              accessibilityLabel={option}
              accessibilityRole="button"
            >
              <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                {option}
              </Text>
              {selected && <Icon name="checkmark" size={18} color={COLORS.orange} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  </BottomSheetModal>
);

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONT_SEMIBOLD,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  list: {
    maxHeight: LIST_MAX_HEIGHT,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  itemSelected: {
    backgroundColor: '#FFF5F0',
  },
  itemText: {
    fontFamily: FONT_REGULAR,
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  itemTextSelected: {
    color: COLORS.orange,
    fontFamily: FONT_SEMIBOLD,
  },
});

export default SelectModal;
