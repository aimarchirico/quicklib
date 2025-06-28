import { BookResponse } from '@/api/generated';
import { Colors } from '@/globals/colors';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BookListItemProps {
  book: BookResponse;
}

const BookListItem: React.FC<BookListItemProps> = ({ book }) => {
  return (
    <Link href={{ pathname: './(tabs)/add', params: { id: book.id } }} asChild>
      <TouchableOpacity style={styles.container}>
        <View>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  author: {
    fontSize: 14,
    color: Colors.dark.icon,
  },
});

export default BookListItem;
