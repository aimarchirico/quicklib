import { BookResponse } from '@/api/generated';
import { Colors } from '@/globals/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import BookList from './BookList';

interface SearchableBookListProps {
  books: BookResponse[];
  title?: string; 
}

const SearchableBookList: React.FC<SearchableBookListProps> = ({ books }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

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
        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <BookList books={filteredBooks} />
    </View>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'light'].background,
  },
  searchInput: {
    backgroundColor: Colors[colorScheme ?? 'light'].card,
    color: Colors[colorScheme ?? 'light'].text,
    padding: 12,
    marginVertical: 16,
    borderRadius: 15,
    fontSize: 16,
  },
});

export default SearchableBookList;
