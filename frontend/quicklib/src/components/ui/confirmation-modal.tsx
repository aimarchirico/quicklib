import Button from '@/components/ui/button';
import { Colors } from '@/styles/colors';
import { FontFamily } from '@/styles/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View, } from 'react-native';

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
  showCancelButton?: boolean;
  loading?: boolean;
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
  confirmationErrorText = 'Please enter the correct value to confirm',
  showCancelButton = true,
  loading = false
}) => {
  const colorScheme = useColorScheme();
  const { width: windowWidth } = useWindowDimensions();
  const styles = useMemo(() => makeStyles(colorScheme, windowWidth), [colorScheme, windowWidth]);
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
                placeholderTextColor={Colors[colorScheme ?? 'dark'].icon}
                autoCapitalize="none"
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </>
          )}
          
          <View style={[
            styles.buttonContainer,
            !showCancelButton && styles.singleButtonContainer
          ]}>
            {showCancelButton && (
              <Button
                title="Cancel"
                onPress={handleClose}
                variant="tertiary"
                style={styles.button}
                disabled={loading}
              />
            )}
            <Button
              title={confirmText}
              onPress={handleConfirm}
              variant="danger"
              style={[styles.button, !showCancelButton && styles.singleButton]}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null, windowWidth: number) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: windowWidth > 600 ? '40%' : '80%',
    backgroundColor: Colors[colorScheme ?? 'dark'].card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    marginBottom: 12,
    textAlign: 'center',
    color: Colors[colorScheme ?? 'dark'].text,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    color: Colors[colorScheme ?? 'dark'].text,
    fontFamily: FontFamily.regular,
  },
  input: {
    width: '100%',
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: Colors[colorScheme ?? 'dark'].background,
    color: Colors[colorScheme ?? 'dark'].text,
    fontFamily: FontFamily.regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginHorizontal: 0, 
    paddingHorizontal: 0, 
  },
  singleButtonContainer: {
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
  },
  singleButton: {
    flex: 1,
    width: '100%',
  },
  error: {
    color: Colors.brand.red,
    marginBottom: 8,
    fontSize: 14,
    alignSelf: 'flex-start',
    fontFamily: FontFamily.regular,
  },
});

export default ConfirmationModal;
