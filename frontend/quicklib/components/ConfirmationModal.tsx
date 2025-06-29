import Button from '@/components/ui/Button';
import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmationValue?: string;
  confirmationPlaceholder?: string;
  confirmationErrorText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmationValue,
  confirmationPlaceholder,
  confirmationErrorText = 'Please enter the correct value to confirm'
}) => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  
  const handleConfirm = () => {
    if (confirmationValue && inputValue !== confirmationValue) {
      setError(confirmationErrorText);
      return;
    }
    setError('');
    onConfirm();
    setInputValue('');
  };

  const handleClose = () => {
    setInputValue('');
    setError('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
    >
      <TouchableOpacity 
        style={styles.centeredView} 
        activeOpacity={1} 
        onPress={handleClose}
      >
        <View 
          style={styles.modalView}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {confirmationValue && (
            <>
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={(text) => {
                  setInputValue(text);
                  setError('');
                }}
                placeholder={confirmationPlaceholder || 'Confirm'}
                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                autoCapitalize="none"
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </>
          )}
          
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={handleClose}
              variant="tertiary"
              style={styles.button}
            />
            <Button
              title={confirmText}
              onPress={handleConfirm}
              variant="danger"
              style={styles.button}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: Colors[colorScheme ?? 'light'].card,
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    marginBottom: 12,
    textAlign: 'center',
    color: Colors[colorScheme ?? 'light'].text,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'left',
    color: Colors[colorScheme ?? 'light'].text,
  },
  input: {
    width: '100%',
    borderRadius: 15,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: Colors[colorScheme ?? 'light'].background,
    color: Colors[colorScheme ?? 'light'].text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 15,
  },
  error: {
    color: Colors.brand.red,
    marginBottom: 8,
    fontSize: 14,
    alignSelf: 'flex-start',
  },
});

export default ConfirmationModal;
