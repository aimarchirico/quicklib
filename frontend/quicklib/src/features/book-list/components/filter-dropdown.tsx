import { BookResponseCollectionEnum } from '@/api/generated';
import { Colors } from '@/styles/colors';
import { FontFamily } from '@/styles/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
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

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
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
                color={collectionFilter === null ? Colors[colorScheme ?? 'dark'].card : Colors.brand.red}
              />
              <Text style={[
                styles.filterOptionText,
                collectionFilter === null && styles.selectedOptionText
              ]}>All Books</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                collectionFilter === BookResponseCollectionEnum.Read && styles.selectedOption
              ]}
              onPress={() => onSelectFilter(BookResponseCollectionEnum.Read)}
            >
              <Ionicons 
                name="checkmark-done-outline" 
                size={24} 
                color={collectionFilter === BookResponseCollectionEnum.Read ? Colors[colorScheme ?? 'dark'].card : Colors.brand.red}
              />
              <Text style={[
                styles.filterOptionText,
                collectionFilter === BookResponseCollectionEnum.Read && styles.selectedOptionText
              ]}>Read</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                collectionFilter === BookResponseCollectionEnum.Unread && styles.selectedOption
              ]}
              onPress={() => onSelectFilter(BookResponseCollectionEnum.Unread)}
            >
              <Ionicons 
                name="book-outline" 
                size={24} 
                color={collectionFilter === BookResponseCollectionEnum.Unread ? Colors[colorScheme ?? 'dark'].card : Colors.brand.red}
              />
              <Text style={[
                styles.filterOptionText,
                collectionFilter === BookResponseCollectionEnum.Unread && styles.selectedOptionText
              ]}>Unread</Text>
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
                color={collectionFilter === BookResponseCollectionEnum.Wishlist ? Colors[colorScheme ?? 'dark'].card : Colors.brand.red}
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
    borderBottomColor: Colors[colorScheme ?? 'dark'].card,
    marginRight: 16,
  },
  dropdownContent: {
    backgroundColor: Colors[colorScheme ?? 'dark'].card,
    borderRadius: 20,
    width: '100%',
    padding: 16,
  },
  dropdownTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors[colorScheme ?? 'dark'].text,
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
    color: Colors[colorScheme ?? 'dark'].text,
    marginLeft: 12,
    fontFamily: FontFamily.regular,
  },
  selectedOptionText: {
    color: Colors[colorScheme ?? 'dark'].card,
    fontFamily: FontFamily.bold,
  },
});
