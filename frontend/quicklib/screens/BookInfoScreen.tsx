import { BookResponse } from '@/api/generated';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import Header from '@/components/ui/Header';
import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useBooks } from '@/hooks/useBooks';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BookInfoScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fetch } = useBooks();
  const [book, setBook] = useState<BookResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (id) {
          const bookData = await fetch(Number(id));
          setBook(bookData);
        }
      } catch (error) {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id, fetch]);

  // Navigate to filtered books screen
  const navigateToFilteredBooks = (filterType: string, filterValue: string) => {
    router.push({
      pathname: "/(tabs)/(books)",
      params: {
        filter: filterType,
        value: filterValue,
        fromBookInfo: 'true' // Add a flag to indicate this navigation came from BookInfo screen
      }
    });
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="Loading..." showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brand.green} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!book) {
    return (
      <ScreenWrapper>
        <Header title="Book Not Found" showBackButton={true} />
        <View style={styles.errorContainer}>
          <Text style={styles.error}>Book not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Format the timestamp for display
  const formattedDate = book.timestamp 
    ? new Date(book.timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <ScreenWrapper>
      <Header
        title={book.title}
        showBackButton={true}
        rightButton={{
          icon: 'create-outline',
          onPress: () => router.push({ pathname: '/(tabs)/(books)/editBook', params: { id: book.id } })
        }}
      />
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Details Card */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => navigateToFilteredBooks('author', book.author)}
            >
              <Ionicons name="person-outline" size={20} color={Colors[colorScheme ?? 'light'].icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Author</Text>
                <Text style={[styles.infoValue, styles.clickable]}>{book.author}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'light'].icon} />
            </TouchableOpacity>
            
            {book.series && (
              <TouchableOpacity 
                style={styles.infoRow}
                onPress={() => navigateToFilteredBooks('series', book.series!)}
              >
                <Ionicons name="bookmarks-outline" size={20} color={Colors[colorScheme ?? 'light'].icon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Series</Text>
                  <Text style={[styles.infoValue, styles.clickable]}>
                    {book.series}{book.sequenceNumber ? ` (#${book.sequenceNumber})` : ''}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'light'].icon} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => navigateToFilteredBooks('language', book.language)}
            >
              <Ionicons name="globe-outline" size={20} color={Colors[colorScheme ?? 'light'].icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Language</Text>
                <Text style={[styles.infoValue, styles.clickable]}>{book.language}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'light'].icon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => navigateToFilteredBooks('collection', book.collection)}
            >
              <Ionicons 
                name={book.collection === 'LIBRARY' ? "library-outline" : "heart-outline"} 
                size={20} 
                color={Colors[colorScheme ?? 'light'].icon} 
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Collection</Text>
                <Text style={[
                  styles.infoValue, 
                  styles.clickable,
                  { color: Colors[colorScheme ?? 'light'].text }
                ]}>
                  {book.collection === 'LIBRARY' ? 'Library' : 'Wishlist'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors[colorScheme ?? 'light'].icon} />
            </TouchableOpacity>
            
            {book.isbn && (
              <View style={styles.infoRow}>
                <Ionicons name="barcode-outline" size={20} color={Colors[colorScheme ?? 'light'].icon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>ISBN</Text>
                  <Text style={styles.infoValue}>{book.isbn}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={Colors[colorScheme ?? 'light'].icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Added on</Text>
                <Text style={styles.infoValue}>{formattedDate}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'light'].background,
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 0,
  },
  badgeContainer: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 16,
    elevation: 2,
  },
  badgeText: {
    color: 'white',
    fontFamily: FontFamily.bold,
    fontSize: 12,
  },
  card: {
    backgroundColor: Colors[colorScheme ?? 'light'].card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors[colorScheme ?? 'light'].icon,
    marginBottom: 2,
    fontFamily: FontFamily.regular,
  },
  infoValue: {
    fontSize: 16,
    color: Colors[colorScheme ?? 'light'].text,
    fontFamily: FontFamily.bold,
  },
  clickable: {
    color: Colors[colorScheme ?? 'light'].text,
  },
  actions: {
    paddingVertical: 16,
  },
  error: {
    color: Colors.brand.red,
    textAlign: 'center',
    marginTop: 20,
  },
  text: {
    color: Colors[colorScheme ?? 'light'].text,
  },
});

export default BookInfoScreen;
