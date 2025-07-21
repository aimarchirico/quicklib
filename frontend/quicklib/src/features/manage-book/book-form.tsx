import { BookRequest, BookRequestCollectionEnum } from '@/api/generated';
import { BarcodeScanner } from '@/components/barcode-scanner';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { LanguagePickerModal } from '@/features/manage-book/language-picker-modal';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { Header } from '@/components/ui/header';
import { useBooksContext } from '@/context/books-context';
import { Colors } from '@/styles/colors';
import { FontFamily } from '@/styles/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getLanguageDisplayName } from '@/utils/language-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  series: z.string().optional(),
  sequenceNumber: z.coerce.number().optional(),
  language: z.string().min(1, 'Language is required'),
  isbn: z.string().optional(),
  collection: z.nativeEnum(BookRequestCollectionEnum),
});

interface BookFormProps {
  initialData?: BookRequest;
  isEditing: boolean;
  onSubmit: (data: BookRequest) => Promise<void>;
  headerTitle: string;
}

export const BookForm = ({
  initialData,
  isEditing,
  onSubmit,
  headerTitle,
}: BookFormProps) => {
  const { control, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<BookRequest>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      collection: BookRequestCollectionEnum.Unread,
    },
  });
  const colorScheme = useColorScheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalConfirmText, setModalConfirmText] = useState('OK');
  const [showCancelButton, setShowCancelButton] = useState(true);
  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);
  const { books } = useBooksContext();
  const router = useRouter();
  
  // Create styles based on the current color scheme
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  const showModal = (title: string, message: string, confirmText = 'OK', showCancelButton = true) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalConfirmText(confirmText);
    setShowCancelButton(showCancelButton);
    setModalVisible(true);
  };

  const handleFormSubmit = async (data: BookRequest) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      // If this is the add mode (not editing), reset form fields after successful submission
      if (!isEditing) {
        reset({
          title: '',
          author: '',
          series: '',
          sequenceNumber: undefined,
          language: '',
          isbn: '',
          collection: BookRequestCollectionEnum.Unread,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showModal('Error', isEditing ? 'Failed to update book' : 'Failed to add book', 'Close', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBarCodeScanned = async (isbn: string) => {
    setIsScannerVisible(false);
    try {
      // Check if book with this ISBN already exists
      const existingBook = books.find(b => b.isbn === isbn);
      if (existingBook) {
        // If found, navigate to BookInfoScreen for that book
        router.push({ pathname: '/(tabs)/(books)/info', params: { id: existingBook.id } });
        return;
      }
      
      // If not found, navigate to add screen with ISBN prefilled
      router.push({ pathname: '/(tabs)/add', params: { isbn } });
    } catch (error) {
      console.error('Error handling barcode scan:', error);
    }
  };

  const toggleScanner = () => {
    setIsScannerVisible(!isScannerVisible);
  };

  // Handler for header save icon
  const handleHeaderSave = handleSubmit(handleFormSubmit);

  // Close scanner when component loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setIsScannerVisible(false);
      };
    }, [])
  );

  return (
    <>
      <ConfirmationModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setShowCancelButton(true);
        }}
        onConfirm={() => {
          setModalVisible(false);
          setShowCancelButton(true);
        }}
        title={modalTitle}
        message={modalMessage}
        confirmText={modalConfirmText}
        showCancelButton={showCancelButton}
      />
      <LanguagePickerModal
        visible={languagePickerVisible}
        selectedLanguage={watch('language')}
        onSelect={(languageCode) => setValue('language', languageCode)}
        onClose={() => setLanguagePickerVisible(false)}
      />
      {isScannerVisible ? (
        <BarcodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          onClose={() => setIsScannerVisible(false)}
        />
      ) : (
        <ScreenWrapper>
          <Header
            title={headerTitle}
            showBackButton={isEditing}
            rightButtons={[
              {
                icon: 'barcode-outline',
                onPress: toggleScanner,
              },
              {
                icon: 'save-outline',
                onPress: handleHeaderSave,
                loading: isSubmitting,
                disabled: isSubmitting,
              }
            ]}
          />
          <KeyboardAvoidingView
            behavior="height"
            style={styles.contentContainer}
            keyboardVerticalOffset={0}
          >
            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
            >
                <View style={styles.formContainer}>
                  <Text style={styles.label}>Collection</Text>
                  <Controller
                    control={control}
                    name="collection"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.collectionCardBg}>
                        <View style={styles.collectionContainer}>
                          <TouchableOpacity
                            style={[
                              styles.collectionButton,
                              value === BookRequestCollectionEnum.Read && styles.collectionButtonActive,
                            ]}
                            onPress={() => onChange(BookRequestCollectionEnum.Read)}
                          >
                            <Text style={[
                              styles.collectionButtonText,
                              value === BookRequestCollectionEnum.Read && styles.collectionButtonTextActive,
                            ]}>Read</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.collectionButton,
                              value === BookRequestCollectionEnum.Unread && styles.collectionButtonActive,
                            ]}
                            onPress={() => onChange(BookRequestCollectionEnum.Unread)}
                          >
                            <Text style={[
                              styles.collectionButtonText,
                              value === BookRequestCollectionEnum.Unread && styles.collectionButtonTextActive,
                            ]}>Unread</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.collectionButton,
                              value === BookRequestCollectionEnum.Wishlist && styles.collectionButtonActive,
                            ]}
                            onPress={() => onChange(BookRequestCollectionEnum.Wishlist)}
                          >
                            <Text style={[
                              styles.collectionButtonText,
                              value === BookRequestCollectionEnum.Wishlist && styles.collectionButtonTextActive,
                            ]}>Wishlist</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />

                  <Text style={styles.label}>Title</Text>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Book Title"
                        placeholderTextColor={Colors[colorScheme ?? 'dark'].icon}
                      />
                    )}
                  />
                  {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

                  <Text style={styles.label}>Author</Text>
                  <Controller
                    control={control}
                    name="author"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Author Name"
                        placeholderTextColor={Colors[colorScheme ?? 'dark'].icon}
                      />
                    )}
                  />
                  {errors.author && <Text style={styles.error}>{errors.author.message}</Text>}

                  <Text style={styles.label}>Language</Text>
                  <Controller
                    control={control}
                    name="language"
                    render={({ field: { onChange, value } }) => (
                      <TouchableOpacity
                        style={styles.input}
                        onPress={() => setLanguagePickerVisible(true)}
                      >
                        <Text style={[
                          styles.inputText,
                          !value && styles.placeholderText
                        ]}>
                          {value ? getLanguageDisplayName(value) : 'Select Language'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                  {errors.language && <Text style={styles.error}>{errors.language.message}</Text>}

                  <Text style={styles.label}>Series (Optional)</Text>
                  <Controller
                    control={control}
                    name="series"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Series Name"
                        placeholderTextColor={Colors[colorScheme ?? 'dark'].icon}
                      />
                    )}
                  />

                  <Text style={styles.label}>Sequence Number (Optional)</Text>
                  <Controller
                    control={control}
                    name="sequenceNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={(text) => onChange(text ? Number(text) : undefined)}
                        value={value !== undefined && value != null ? String(value) : ''}
                        placeholder="1, 2, 3, etc."
                        placeholderTextColor={Colors[colorScheme ?? 'dark'].icon}
                        keyboardType="numeric"
                      />
                    )}
                  />

                  
                </View>
              </ScrollView>

            
          </KeyboardAvoidingView>
        </ScreenWrapper>
      )}
    </>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'dark'].background,
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  formContainer: {
    paddingBottom: 16,
  },
  label: {
    color: Colors[colorScheme ?? 'dark'].text,
    marginBottom: 15,
    marginTop: 10,
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  input: {
    backgroundColor: Colors[colorScheme ?? 'dark'].card,
    color: Colors[colorScheme ?? 'dark'].text,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  inputText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors[colorScheme ?? 'dark'].text,
  },
  placeholderText: {
    color: Colors[colorScheme ?? 'dark'].icon,
  },
  collectionCardBg: {
    backgroundColor: Colors[colorScheme ?? 'dark'].card,
    borderRadius: 20,
    marginBottom: 15,
  },
  collectionContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  collectionButton: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'transparent', // Remove card color from individual buttons
  },
  collectionButtonActive: {
    backgroundColor: Colors.brand.green,
  },
  collectionButtonText: {
    color: Colors[colorScheme ?? 'dark'].text,
    fontFamily: FontFamily.bold,
    fontSize: 14,
  },
  collectionButtonTextActive: {
    color: 'white',
    fontFamily: FontFamily.bold,
  },
  error: {
    color: Colors.brand.red,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: FontFamily.regular,
  },
  saveButton: {
    backgroundColor: Colors.brand.red,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
});
