import { BookRequest, BookRequestCollectionEnum } from '@/api/generated';
import BookForm from '@/features/manage-book/book-form';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import Header from '@/components/ui/header';
import { useBooksContext } from '@/context/books-context';
import { Colors } from '@/styles/colors';
import { FontFamily } from '@/styles/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isbnService } from '@/services/isbn-service';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const AddScreen = () => {
  const { isbn } = useLocalSearchParams<{ isbn?: string }>();
  const { add } = useBooksContext();
  const [initialData, setInitialData] = useState<BookRequest | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  // Fetch book details when ISBN is provided
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!isbn) {
        setInitialData(undefined);
        return;
      }

      setIsLoading(true);
      try {
        const bookData = await isbnService.getBookByISBN(isbn);
        if (bookData) {
          setInitialData({
            isbn,
            title: bookData.title,
            author: bookData.author,
            language: bookData.language,
            collection: BookRequestCollectionEnum.Unread,
          } as BookRequest);
        } else {
          // If no book data found, just prefill ISBN
          setInitialData({
            isbn,
            collection: BookRequestCollectionEnum.Unread,
          } as BookRequest);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        // On error, just prefill ISBN
        setInitialData({
          isbn,
          collection: BookRequestCollectionEnum.Unread,
        } as BookRequest);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [isbn]);
  
  const handleSubmit = async (data: BookRequest) => {
    try {
      const result = await add(data);
      router.push({ pathname: '/(tabs)/(books)/info', params: { id: result.id } });
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  // Show loading while fetching book details for ISBN
  if (isLoading) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header title="Add Book" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brand.green} />
          <Text style={styles.loadingText}>Looking up book details...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <BookForm
      isEditing={false}
      onSubmit={handleSubmit}
      headerTitle="Add Book"
      initialData={initialData}
    />
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'dark'].background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors[colorScheme ?? 'dark'].text,
    fontSize: 16,
    fontFamily: FontFamily.regular,
    marginTop: 16,
  },
});

export default AddScreen;
