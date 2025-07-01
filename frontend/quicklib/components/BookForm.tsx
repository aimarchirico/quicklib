import { BookRequest, BookRequestCollectionEnum } from '@/api/generated';
import BarcodeScanner from '@/components/BarcodeScanner';
import ConfirmationModal from '@/components/ConfirmationModal';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import Header from '@/components/ui/Header';
import { useBooksContext } from '@/context/BooksContext';
import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { isbnService } from '@/services/ISBNService';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
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

const BookForm = ({
  initialData,
  isEditing,
  onSubmit,
  headerTitle,
}: BookFormProps) => {
  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<BookRequest>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      collection: BookRequestCollectionEnum.Unread,
    },
  });
  const colorScheme = useColorScheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isLoadingIsbn, setIsLoadingIsbn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalConfirmText, setModalConfirmText] = useState('OK');
  const [showCancelButton, setShowCancelButton] = useState(true);
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
    } catch (error) {
      showModal('Error', isEditing ? 'Failed to update book' : 'Failed to add book', 'Close', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBarCodeScanned = async (isbn: string) => {
    setIsScannerVisible(false);
    setValue('isbn', isbn);
    setIsLoadingIsbn(true);
    try {
      // Check if book with this ISBN already exists
      const existingBook = books.find(b => b.isbn === isbn);
      if (existingBook) {
        // If found, navigate to BookInfoScreen for that book
        router.push({ pathname: '/(tabs)/(books)/bookInfo', params: { id: existingBook.id } });
        return;
      }        const bookData = await isbnService.getBookByISBN(isbn);
      if (bookData) {
        setValue('title', bookData.title);
        setValue('author', bookData.author);
        setValue('language', bookData.language);
        showModal('Book Found', `Found "${bookData.title}" by ${bookData.author}. Please check the details and add any missing information.`, 'Close', false);
      } else {
        showModal('Book Not Found', 'Could not find book details for this ISBN. Please enter the details manually.', 'Close', false);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setIsLoadingIsbn(false);
    }
  };

  const toggleScanner = () => {
    setIsScannerVisible(!isScannerVisible);
  };

  // Handler for header save icon
  const handleHeaderSave = handleSubmit(handleFormSubmit);

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
            rightButton={{
              icon: 'save-outline',
              onPress: handleHeaderSave,
              loading: isSubmitting,
              disabled: isSubmitting,
            }}
          />
          <KeyboardAvoidingView
            behavior="height"
            style={styles.contentContainer}
            keyboardVerticalOffset={0}
          >
            {isLoadingIsbn ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Looking up book details...</Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
              >
                <View style={styles.formContainer}>
                  <View style={styles.isbnContainer}>
                    <Text style={styles.label}>ISBN</Text>
                    <View style={styles.isbnInputContainer}>
                      <Controller
                        control={control}
                        name="isbn"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={styles.isbnInput}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Enter ISBN"
                            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                            keyboardType="numeric"
                          />
                        )}
                      />
                      <TouchableOpacity
                        style={styles.scanButton}
                        onPress={toggleScanner}
                        // removed disabled={isEditing} to allow scanning in edit mode
                      >
                        <Ionicons name="barcode-outline" size={24} color={Colors.brand.red} />
                      </TouchableOpacity>
                    </View>
                  </View>

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
                        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
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
                        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                      />
                    )}
                  />
                  {errors.author && <Text style={styles.error}>{errors.author.message}</Text>}

                  <Text style={styles.label}>Language</Text>
                  <Controller
                    control={control}
                    name="language"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Language"
                        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                      />
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
                        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
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
                        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                        keyboardType="numeric"
                      />
                    )}
                  />

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
                </View>
              </ScrollView>
            )}

            
          </KeyboardAvoidingView>
        </ScreenWrapper>
      )}
    </>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'light'].background,
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors[colorScheme ?? 'light'].text,
    fontSize: 16,
    fontFamily: FontFamily.regular,
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
    color: Colors[colorScheme ?? 'light'].text,
    marginBottom: 15,
    marginTop: 10,
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  input: {
    backgroundColor: Colors[colorScheme ?? 'light'].card,
    color: Colors[colorScheme ?? 'light'].text,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  isbnContainer: {
    marginBottom: 15,
  },
  isbnInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  isbnInput: {
    backgroundColor: Colors[colorScheme ?? 'light'].card,
    color: Colors[colorScheme ?? 'light'].text,
    padding: 20,
    borderRadius: 20,
    flex: 1,
    fontSize: 14,
  },
  scanButton: {
    backgroundColor: Colors[colorScheme ?? 'light'].card,
    padding: 12,
    borderRadius: 30,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  collectionCardBg: {
    backgroundColor: Colors[colorScheme ?? 'light'].card,
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
    color: Colors[colorScheme ?? 'light'].text,
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

export default BookForm;
