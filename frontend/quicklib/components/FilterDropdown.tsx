import { BookResponseCollectionEnum } from '@/api/generated';
import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilterDropdownProps {
  visible: boolean;
  collectionFilter: BookResponseCollectionEnum | null;
  position: { top: number; right: number; width?: number };
  onClose: () => void;
  onSelectFilter: (collection: BookResponseCollectionEnum | null) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  visible,
  collectionFilter,
  position,
  onClose,
  onSelectFilter
}) => {
  const colorScheme = useColorScheme();
  
  const styles = makeStyles(colorScheme);
  
  return (
    <Modal
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View 
          style={[
            styles.dropdownContainer, 
            { 
              top: position.top, 
              right: position.right,
              width: 220
            }
          ]}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          <View style={styles.dropdownArrow} />
          
          <View style={styles.dropdownContent}>
            <Text style={styles.dropdownTitle}>Filter by collection</Text>
            
            <TouchableOpacity
              style={[
                styles.filterOption,
                collectionFilter === null && styles.selectedOption
              ]}
              onPress={() => onSelectFilter(null)}
            >
              <Ionicons 
                name="book-outline" 
                size={24} 
                color={collectionFilter === null ? Colors[colorScheme ?? 'light'].card : Colors.brand.red}
              />
              <Text style={[
                styles.filterOptionText,
                collectionFilter === null && styles.selectedOptionText
              ]}>All Books</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterOption,
                collectionFilter === BookResponseCollectionEnum.Library && styles.selectedOption
              ]}
              onPress={() => onSelectFilter(BookResponseCollectionEnum.Library)}
            >
              <Ionicons 
                name="library-outline" 
                size={24} 
                color={collectionFilter === BookResponseCollectionEnum.Library ? Colors[colorScheme ?? 'light'].card : Colors.brand.red}
              />
              <Text style={[
                styles.filterOptionText,
                collectionFilter === BookResponseCollectionEnum.Library && styles.selectedOptionText
              ]}>Library</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterOption,
                collectionFilter === BookResponseCollectionEnum.Wishlist && styles.selectedOption
              ]}
              onPress={() => onSelectFilter(BookResponseCollectionEnum.Wishlist)}
            >
              <Ionicons 
                name="heart-outline" 
                size={24} 
                color={collectionFilter === BookResponseCollectionEnum.Wishlist ? Colors[colorScheme ?? 'light'].card : Colors.brand.red}
              />
              <Text style={[
                styles.filterOptionText,
                collectionFilter === BookResponseCollectionEnum.Wishlist && styles.selectedOptionText
              ]}>Wishlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  dropdownContainer: {
    position: 'absolute',
    alignItems: 'flex-end',
  },
  dropdownArrow: {
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors[colorScheme ?? 'light'].card,
    marginRight: 16,
  },
  dropdownContent: {
    backgroundColor: Colors[colorScheme ?? 'light'].card,
    borderRadius: 20,
    width: '100%',
    padding: 16,
  },
  dropdownTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors[colorScheme ?? 'light'].text,
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 20,
  },
  selectedOption: {
    backgroundColor: Colors.brand.green,
  },
  filterOptionText: {
    fontSize: 16,
    color: Colors[colorScheme ?? 'light'].text,
    marginLeft: 12,
  },
  selectedOptionText: {
    color: Colors[colorScheme ?? 'light'].card,
    fontFamily: FontFamily.bold,
  },
});

export default FilterDropdown;
