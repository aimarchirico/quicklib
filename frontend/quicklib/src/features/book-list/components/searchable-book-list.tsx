import { BookResponse } from '@/api/generated';
import { Colors } from '@/styles/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getLanguageDisplayName } from '@/utils/language-utils';
import React, { useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import BookList from './book-list';
import { FontFamily } from '@/styles/fonts';

interface SearchableBookListProps {
  books: BookResponse[];
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  title?: string; 
}

const SearchableBookList: React.FC<SearchableBookListProps> = ({ books, onRefresh, refreshing }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.series?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getLanguageDisplayName(book.language).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title, author, series, or language"
        placeholderTextColor={Colors[colorScheme ?? 'dark'].icon}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <BookList books={filteredBooks} refreshControl={
        onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> as any : undefined
      } />
    </View>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'dark'].background,
  },
  searchInput: {
    backgroundColor: Colors[colorScheme ?? 'dark'].card,
    color: Colors[colorScheme ?? 'dark'].text,
    padding: 15,
    marginVertical: 16,
    borderRadius: 20,
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});

export default SearchableBookList;
