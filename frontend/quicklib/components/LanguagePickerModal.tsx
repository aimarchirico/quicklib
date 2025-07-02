import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getLanguageOptions } from '@/utils/languageUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LanguagePickerModalProps {
  visible: boolean;
  selectedLanguage: string;
  onSelect: (languageCode: string) => void;
  onClose: () => void;
}

const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  visible,
  selectedLanguage,
  onSelect,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  const languageOptions = getLanguageOptions();

  const handleSelect = (languageCode: string) => {
    onSelect(languageCode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modalContainer} 
          activeOpacity={1} 
          onPress={() => {}} // Prevent event bubbling
        >
          <View style={styles.header}>
            <Text style={styles.title}>Select Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={languageOptions}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  selectedLanguage === item.code && styles.languageOptionSelected
                ]}
                onPress={() => handleSelect(item.code)}
              >
                <Text style={[
                  styles.languageText,
                  selectedLanguage === item.code && styles.languageTextSelected
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors[colorScheme ?? 'light'].background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors[colorScheme ?? 'light'].text,
  },
  closeButton: {
    padding: 4,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 15,
  },
  languageOptionSelected: {
    backgroundColor: Colors.brand.green,
    
  },
  languageText: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    color: Colors[colorScheme ?? 'light'].text,
  },
  languageTextSelected: {
    color: 'white',
    fontFamily: FontFamily.bold,
  },
});

export default LanguagePickerModal;
