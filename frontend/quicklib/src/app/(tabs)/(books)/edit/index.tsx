import { BookRequest, BookResponse } from '@/api/generated';
import BookForm from '@/features/manage-book/book-form';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import Header from '@/components/ui/header';
import { Colors } from '@/styles/colors';
import { FontFamily } from '@/styles/fonts';
import { useBooksContext } from '@/context/books-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const EditScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
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
        console.error('Error fetching book:', error);
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
        router.back();
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
    sequenceNumber: book.sequenceNumber ?? undefined,
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
    fontFamily: FontFamily.regular,
  },
});

export default EditScreen;
