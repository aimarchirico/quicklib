import { BookResponse } from '@/api/generated';
import BookListItem from '@/components/BookListItem';
import { Colors } from '@/globals/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';

interface BookListProps {
  books: BookResponse[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
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
    />
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'light'].background,
  },
  contentContainer: {
    paddingVertical: 0,
  }
});

export default BookList;
