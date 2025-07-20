import { BookResponse } from '@/api/generated';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import Header from '@/components/ui/header';
import { useBooksContext } from '@/context/books-context';
import { Colors } from '@/styles/colors';
import { FontFamily } from '@/styles/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BookDetailsCard from '@/features/book-info/components/book-details-card';

const InfoScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fetch, remove } = useBooksContext();
  const [book, setBook] = useState<BookResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
        console.error('Error fetching book:', error);
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
        fromInfo: 'true' // Add a flag to indicate this navigation came from BookInfo screen
      }
    });
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="" showBackButton={true} />
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

  return (
    <ScreenWrapper>
      <Header
        title={book.title}
        showBackButton={true}
        RightComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(true)}
              style={{ marginRight: 8, padding: 8, borderRadius: 30, backgroundColor: Colors[colorScheme ?? 'dark'].card }}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator size={24} color={Colors.brand.green} />
              ) : (
                <Ionicons name="trash-outline" size={24} color={Colors.brand.red} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(tabs)/(books)/edit', params: { id: book.id } })}
              style={{ padding: 8, borderRadius: 30, backgroundColor: Colors[colorScheme ?? 'dark'].card }}
              disabled={deleting}
            >
              <Ionicons name="create-outline" size={24} color={Colors.brand.red} />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Details Card */}
          <BookDetailsCard
            book={book}
            colorScheme={colorScheme}
            styles={styles}
            navigateToFilteredBooks={navigateToFilteredBooks}
          />
        </ScrollView>
      </View>
      <ConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={async () => {
          setDeleting(true);
          try {
            await remove(book.id);
            setDeleteModalVisible(false);
            // Navigate to books screen and trigger refresh
            router.push('/(tabs)/(books)');
          } catch (e) {
            console.error('Error deleting book:', e);
          } finally {
            setDeleting(false);
          }
        }}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        confirmText={'Delete'}
        loading={deleting}
      />
    </ScreenWrapper>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'dark'].background,
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
    alignContent: 'flex-end'
  },
  badgeContainer: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
  },
  badgeText: {
    color: 'white',
    fontFamily: FontFamily.bold,
    fontSize: 12,
  },
  card: {
    backgroundColor: Colors[colorScheme ?? 'dark'].card,
    borderRadius: 20,
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
    color: Colors[colorScheme ?? 'dark'].icon,
    marginBottom: 2,
    fontFamily: FontFamily.regular,
  },
  infoValue: {
    fontSize: 16,
    color: Colors[colorScheme ?? 'dark'].text,
    fontFamily: FontFamily.bold,
  },
  clickable: {
    color: Colors[colorScheme ?? 'dark'].text,
  },
  actions: {
    paddingVertical: 16,
  },
  error: {
    color: Colors.brand.red,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: FontFamily.regular,
  },
  text: {
    color: Colors[colorScheme ?? 'dark'].text,
    fontFamily: FontFamily.regular,
  },
});

export default InfoScreen;
