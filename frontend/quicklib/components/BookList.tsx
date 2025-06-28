import { BookResponse } from '@/api/generated';
import BookListItem from '@/components/BookListItem';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

interface BookListProps {
  books: BookResponse[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookListItem book={item} />}
      keyExtractor={(item) => item.id.toString()}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#151718',
  },
});

export default BookList;
