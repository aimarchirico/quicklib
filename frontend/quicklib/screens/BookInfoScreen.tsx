import { bookApi } from '@/api/ApiClient';
import { BookResponse } from '@/api/generated';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { Colors } from '@/globals/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text } from 'react-native';

const BookInfoScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState<BookResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookApi.getBookById(Number(id));
        setBook(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaWrapper>
        <ActivityIndicator size="large" color={Colors.brand.green} />
      </SafeAreaWrapper>
    );
  }

  if (!book) {
    return (
      <SafeAreaWrapper>
        <Text style={styles.error}>Book not found</Text>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <Button 
        title="Edit Book" 
        onPress={() => router.push({ pathname: './book/bookInfo', params: { id: book.id } })} 
        color={Colors.brand.green} 
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    color: Colors.dark.icon,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  text: {
    color: '#ECEDEE',
  },
});

export default BookInfoScreen;
