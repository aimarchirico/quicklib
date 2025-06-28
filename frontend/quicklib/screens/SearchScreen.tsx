import BookList from '@/components/BookList';
import { Colors } from '@/globals/colors';
import { useBooks } from '@/hooks/useBooks';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

const SearchScreen = () => {
  const { books, loading } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.series?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title, author, series, or language"
        placeholderTextColor={Colors.dark.icon}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color={Colors.brand.green} />
      ) : (
        <BookList books={filteredBooks} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  searchInput: {
    height: 40,
    borderColor: Colors.dark.icon,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    color: Colors.dark.text,
  },
});

export default SearchScreen;
