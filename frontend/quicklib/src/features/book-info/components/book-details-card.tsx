import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLanguageDisplayName } from '@/utils/language-utils';
import { Colors } from '@/styles/colors';

export interface BookDetailsCardProps {
  book: any;
  colorScheme: 'light' | 'dark' | null;
  styles: any;
  navigateToFilteredBooks: (filterType: string, filterValue: string) => void;
}

export const BookDetailsCard: React.FC<BookDetailsCardProps> = ({ book, colorScheme, styles, navigateToFilteredBooks }) => {
  const formattedDate = book.createdAt 
    ? new Date(book.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.infoRow}
        onPress={() => navigateToFilteredBooks('author', book.author)}
      >
        <Ionicons name="person-outline" size={20} color={Colors[colorScheme ?? 'dark'].icon} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>Author</Text>
          <Text style={[styles.infoValue, styles.clickable]}>{book.author}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'dark'].icon} />
      </TouchableOpacity>
      {book.series && (
        <TouchableOpacity 
          style={styles.infoRow}
          onPress={() => navigateToFilteredBooks('series', book.series)}
        >
          <Ionicons name="bookmarks-outline" size={20} color={Colors[colorScheme ?? 'dark'].icon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Series</Text>
            <Text style={[styles.infoValue, styles.clickable]}>
              {book.series}{book.sequenceNumber ? ` (#${book.sequenceNumber})` : ''}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'dark'].icon} />
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={styles.infoRow}
        onPress={() => navigateToFilteredBooks('language', book.language)}
      >
        <Ionicons name="globe-outline" size={20} color={Colors[colorScheme ?? 'dark'].icon} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>Language</Text>
          <Text style={[styles.infoValue, styles.clickable]}>{getLanguageDisplayName(book.language)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'dark'].icon} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.infoRow}
        onPress={() => navigateToFilteredBooks('collection', book.collection)}
      >
        <Ionicons 
          name={
            book.collection === 'READ'
              ? 'checkmark-done-outline'
              : book.collection === 'UNREAD'
              ? 'book-outline'
              : 'heart-outline'
          }
          size={20} 
          color={Colors[colorScheme ?? 'dark'].icon} 
        />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>Collection</Text>
          <Text style={[
            styles.infoValue, 
            styles.clickable,
            { color: Colors[colorScheme ?? 'dark'].text }
          ]}>
            {book.collection === 'READ'
              ? 'Read'
              : book.collection === 'UNREAD'
              ? 'Unread'
              : 'Wishlist'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'dark'].icon} />
      </TouchableOpacity>
      {book.isbn && (
        <View style={styles.infoRow}>
          <Ionicons name="barcode-outline" size={20} color={Colors[colorScheme ?? 'dark'].icon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>ISBN</Text>
            <Text style={styles.infoValue}>{book.isbn}</Text>
          </View>
        </View>
      )}
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={20} color={Colors[colorScheme ?? 'dark'].icon} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>Added on</Text>
          <Text style={styles.infoValue}>{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
};
