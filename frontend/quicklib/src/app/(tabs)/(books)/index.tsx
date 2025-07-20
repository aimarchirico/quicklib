import { BookResponseCollectionEnum } from '@/api/generated';
import BarcodeScanner from '@/components/barcode-scanner';
import FilterDropdown from '@/features/book-list/components/filter-dropdown';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import SearchableBookList from '@/features/book-list/components/searchable-book-list';
import Header from '@/components/ui/header';
import { useBooksContext } from '@/context/books-context';
import { Colors } from '@/styles/colors';
import { FontFamily } from '@/styles/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getLanguageDisplayName } from '@/utils/language-utils';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';

const BooksScreen = () => {
  const { filter: paramFilter, value: paramValue, fromInfo } = 
    useLocalSearchParams<{ filter?: string; value?: string; fromInfo?: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState<BookResponseCollectionEnum | null>(null);
  const [filterButtonPosition, setFilterButtonPosition] = useState({ top: 0, right: 0, width: 0 });
  const filterButtonRef = useRef<View | null>(null);

  // Set initial collection filter based on route params if available
  useEffect(() => {
    if (paramFilter === 'collection' && paramValue) {
      setCollectionFilter(paramValue as BookResponseCollectionEnum);
    }
  }, [paramFilter, paramValue]);

  const { books: allBooks, loading, error, refetch, resetFilters } = useBooksContext();
  const [refreshing, setRefreshing] = useState(false);
  
  // Capture resetFilters in a ref to avoid it being a dependency
  const resetFiltersRef = React.useRef(resetFilters);
  resetFiltersRef.current = resetFilters;
  
  // Apply client-side filtering to books
  const filteredBooks = useMemo(() => {
    let filtered = [...allBooks];
    
    // Apply collection filter from dropdown
    if (collectionFilter) {
      filtered = filtered.filter(book => book.collection === collectionFilter);
    }
    
    // Apply attribute filters from params
    if (paramFilter && paramValue) {
      switch (paramFilter) {
        case 'author':
          filtered = filtered.filter(book => book.author === paramValue);
          break;
        case 'series':
          filtered = filtered.filter(book => book.series === paramValue);
          break;
        case 'language':
          filtered = filtered.filter(book => book.language === paramValue);
          break;
        case 'collection':
          // If collection comes from route params, it takes precedence
          filtered = filtered.filter(book => book.collection === paramValue as BookResponseCollectionEnum);
          break;
      }
    }
    
    // Sort based on filter type
    if (paramFilter === 'series' && paramValue) {
      // When filtering by series, sort by sequence number (ascending)
      return filtered.sort((a, b) => {
        const seqA = a.sequenceNumber ?? Number.MAX_SAFE_INTEGER;
        const seqB = b.sequenceNumber ?? Number.MAX_SAFE_INTEGER;
        return seqA - seqB;
      });
    } else {
      // Default sort by creation date (newest first)
      return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [allBooks, collectionFilter, paramFilter, paramValue]);

  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  
  // Generate appropriate title based on filter
  const title = useMemo(() => {
    // If navigated from BookInfo screen, just show the filter value
    if (fromInfo === 'true' && paramFilter && paramValue) {
      if (paramFilter === 'collection') {
        if (paramValue === BookResponseCollectionEnum.Read) return 'Read';
        if (paramValue === BookResponseCollectionEnum.Unread) return 'Unread';
        if (paramValue === BookResponseCollectionEnum.Wishlist) return 'Wishlist';
      } else if (paramFilter === 'language') {
        return getLanguageDisplayName(paramValue) || paramValue || 'Unknown Language';
      } else { return paramValue || 'Books' }
    }
    else if (collectionFilter === BookResponseCollectionEnum.Read) {
      return 'Read';
    } else if (collectionFilter === BookResponseCollectionEnum.Unread) {
      return 'Unread';
    } else if (collectionFilter === BookResponseCollectionEnum.Wishlist) {
      return 'Wishlist';
    } else return 'Books';
  }, [paramFilter, paramValue, collectionFilter, fromInfo]);

  const toggleFilterDropdown = () => {
    if (!isDropdownVisible && filterButtonRef.current) {
      // Measure the position of the filter button
      filterButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setFilterButtonPosition({ 
          top: pageY + height, 
          right: Dimensions.get('window').width - pageX - width,
          width: width
        });
        setIsDropdownVisible(true);
      });
    } else {
      setIsDropdownVisible(false);
    }
  };

  const applyCollectionFilter = (collection: BookResponseCollectionEnum | null) => {
    setCollectionFilter(collection);
    setIsDropdownVisible(false);
  };

  const toggleScanner = () => {
    setIsScannerVisible(!isScannerVisible);
  };

  const handleBarCodeScanned = async (isbn: string) => {
    setIsScannerVisible(false);
    try {
      // Check if book with this ISBN already exists
      const existingBook = allBooks.find(b => b.isbn === isbn);
      if (existingBook) {
        // If found, navigate to BookInfoScreen for that book
        router.push({ pathname: '/(tabs)/(books)/info', params: { id: existingBook.id } });
        return;
      }
      
      // If not found, navigate to add screen with ISBN prefilled
      router.push({ pathname: '/(tabs)/add', params: { isbn } });
    } catch (error) {
      console.error('Error handling barcode scan:', error);
    }
  };

  // Close scanner when component loses focus
  useFocusEffect(
    React.useCallback(() => {
      // Don't reset any filters when just navigating to books tab
      // Only close scanner if it was open
      return () => {
        setIsScannerVisible(false);
      };
    }, [])
  );

  if (loading) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header 
          title={title || 'Books'}
          showBackButton={!!(fromInfo === 'true')} // Show back button when navigated from BookInfo
          rightButtons={[
            {
              icon: 'barcode-outline',
              onPress: toggleScanner,
            },
            {
              icon: 'filter-outline',
              onPress: toggleFilterDropdown,
              buttonRef: filterButtonRef
            }
          ]}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brand.green} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header 
          title={title || 'Books'}
          showBackButton={!!(fromInfo === 'true')} 
          rightButtons={[
            {
              icon: 'barcode-outline',
              onPress: toggleScanner,
            },
            {
              icon: 'filter-outline',
              onPress: toggleFilterDropdown,
              buttonRef: filterButtonRef
            }
          ]}
        />
        <Text style={styles.error}>
          {error}
        </Text>
      </ScreenWrapper>
    );
  }

  return (
    <>
      {isScannerVisible ? (
        <BarcodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          onClose={() => setIsScannerVisible(false)}
        />
      ) : (
        <ScreenWrapper style={styles.container}>
          <Header 
            title={title || 'Books'}
            showBackButton={!!(fromInfo === 'true')} 
            rightButtons={[
              {
                icon: 'barcode-outline',
                onPress: toggleScanner,
              },
              {
                icon: 'filter-outline',
                onPress: toggleFilterDropdown,
                buttonRef: filterButtonRef
              }
            ]}
          />
          <SearchableBookList 
            books={filteredBooks} 
            onRefresh={async () => {
              setRefreshing(true);
              await refetch();
              setRefreshing(false);
            }}
            refreshing={refreshing}
          />
          
          {/* Filter Dropdown */}
          <FilterDropdown 
            visible={isDropdownVisible}
            collectionFilter={collectionFilter}
            position={filterButtonPosition}
            onClose={() => setIsDropdownVisible(false)}
            onSelectFilter={applyCollectionFilter}
          />
        </ScreenWrapper>
      )}
    </>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'dark'].background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.brand.red,
    fontFamily: FontFamily.regular,
  }
});

export default BooksScreen;
