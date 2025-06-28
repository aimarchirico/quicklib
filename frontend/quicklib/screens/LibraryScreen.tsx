import { BookResponseCollectionEnum } from '@/api/generated';
import BookList from '@/components/BookList';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { Colors } from '@/globals/colors';
import { useBooks } from '@/hooks/useBooks';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

const LibraryScreen = () => {
  const { books, loading, error } = useBooks(BookResponseCollectionEnum.Library);

  if (loading) {
    return (
      <SafeAreaWrapper>
        <ActivityIndicator size="large" color={Colors.brand.green} />
      </SafeAreaWrapper>
    );
  }

  if (error) {
    return (
      <SafeAreaWrapper>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <BookList books={books} />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LibraryScreen;
