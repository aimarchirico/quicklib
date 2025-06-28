import { BookResponseCollectionEnum } from '@/api/generated';
import BookList from '@/components/BookList';
import { Colors } from '@/globals/colors';
import { useBooks } from '@/hooks/useBooks';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LibraryScreen = () => {
  const { books, loading, error } = useBooks(BookResponseCollectionEnum.Library);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.brand.green} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <BookList books={books} />
    </View>
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
