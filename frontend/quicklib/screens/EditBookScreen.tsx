import { BookRequest, BookResponse } from '@/api/generated';
import BookForm from '@/components/BookForm';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import Header from '@/components/ui/Header';
import { Colors } from '@/globals/colors';
import { useBooksContext } from '@/context/BooksContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const EditBookScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { fetch, update } = useBooksContext();
  const [book, setBook] = useState<BookResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (id) {
          const bookData = await fetch(Number(id));
          setBook(bookData);
        }
      } catch (error) {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBook();
    }
  }, [id, fetch]);

  const handleSubmit = async (data: BookRequest) => {
    try {
      if (id) {
        await update(Number(id), data);
        router.push({ pathname: '/(tabs)/(books)/bookInfo', params: { id } });
      }
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="Edit Book" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brand.green} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!book) {
    return (
      <ScreenWrapper>
        <Header title="Edit Book" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Book not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Convert BookResponse to BookRequest format for the form
  const bookRequestData: BookRequest = {
    title: book.title,
    author: book.author,
    language: book.language,
    collection: book.collection,
    series: book.series ?? '',
    sequenceNumber: book.sequenceNumber,
    isbn: book.isbn ?? '',
  };

  return (
    <BookForm
      initialData={bookRequestData}
      isEditing={true}
      onSubmit={handleSubmit}
      headerTitle="Edit Book"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.brand.red,
    fontSize: 16,
  },
});

export default EditBookScreen;
