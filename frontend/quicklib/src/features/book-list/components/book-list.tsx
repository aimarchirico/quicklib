import { BookResponse } from '@/api/generated';
import BookListItem from '@/features/book-list/components/book-list-item';
import { Colors } from '@/styles/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, RefreshControlProps } from 'react-native';

interface BookListProps {
  books: BookResponse[];
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

const BookList: React.FC<BookListProps> = ({ books, refreshControl }) => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookListItem book={item} />}
      keyExtractor={(item) => item.id.toString()}
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    />
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'dark'].background,
  },
  contentContainer: {
    paddingVertical: 0,
  }
});

export default BookList;
