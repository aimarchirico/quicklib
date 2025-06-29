import { BookResponseCollectionEnum } from '@/api/generated';
import FilterDropdown from '@/components/FilterDropdown';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import SearchableBookList from '@/components/SearchableBookList';
import Header from '@/components/ui/Header';
import { Colors } from '@/globals/colors';
import { BooksFilter, useBooks } from '@/hooks/useBooks';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';

const BooksScreen = () => {
  const { filter: paramFilter, value: paramValue, fromBookInfo } = 
    useLocalSearchParams<{ filter?: string; value?: string; fromBookInfo?: string }>();
  const colorScheme = useColorScheme();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState<BookResponseCollectionEnum | null>(null);
  const [filterButtonPosition, setFilterButtonPosition] = useState({ top: 0, right: 0, width: 0 });
  const filterButtonRef = useRef<View | null>(null);
  
  // Create filter object based on route params and collection filter
  const filterObject: BooksFilter = useMemo(() => {
    const baseFilter: BooksFilter = {};
    
    // Add collection filter if selected from filter dropdown
    if (collectionFilter) {
      baseFilter.collection = collectionFilter;
    }
    
    if (!paramFilter || !paramValue) return baseFilter;
    
    // Add attribute filters from params
    switch (paramFilter) {
      case 'author':
        return { ...baseFilter, author: paramValue };
      case 'series':
        return { ...baseFilter, series: paramValue };
      case 'language':
        return { ...baseFilter, language: paramValue };
      case 'collection':
        // If collection comes from route params, it takes precedence over the filter dropdown
        return { ...baseFilter, collection: paramValue as BookResponseCollectionEnum };
      default:
        return baseFilter;
    }
  }, [paramFilter, paramValue, collectionFilter]);

  // Set initial collection filter based on route params if available
  useEffect(() => {
    if (paramFilter === 'collection' && paramValue) {
      setCollectionFilter(paramValue as BookResponseCollectionEnum);
    }
  }, [paramFilter, paramValue]);

  const { books, loading, error } = useBooks(filterObject);
  
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  
  // Generate appropriate title based on filter
  const title = useMemo(() => {
    // If navigated from BookInfo screen, just show the filter value
    if (fromBookInfo === 'true' && paramFilter && paramValue) {
      switch (paramFilter) {
        case 'author':
          return paramValue; // Just the author name
        case 'series':
          return paramValue; // Just the series name
        case 'language':
          return paramValue; // Just the language
        case 'collection':
          // Collection should still show Library or Wishlist
          return paramValue === BookResponseCollectionEnum.Library ? 'Library' : 'Wishlist';
        default:
          return 'Books';
      }
    }
    
    // Standard title generation for regular navigation
    let baseTitle = 'Books';
    
    // Add collection to title if filtered
    if (collectionFilter === BookResponseCollectionEnum.Library || 
        (paramFilter === 'collection' && paramValue === BookResponseCollectionEnum.Library)) {
      baseTitle = 'Library';
    } else if (collectionFilter === BookResponseCollectionEnum.Wishlist || 
              (paramFilter === 'collection' && paramValue === BookResponseCollectionEnum.Wishlist)) {
      baseTitle = 'Wishlist';
    }
    
    // Add attribute filters to title for regular navigation
    if (paramFilter && paramValue && fromBookInfo !== 'true') {
      switch (paramFilter) {
        case 'author':
          return `${paramValue}'s ${baseTitle}`;
        case 'series':
          return `${paramValue} Series`;
        case 'language':
          return `${paramValue} ${baseTitle}`;
        case 'collection':
          return baseTitle; // Collection is already handled above
        default:
          return baseTitle;
      }
    }
    
    return baseTitle;
  }, [paramFilter, paramValue, collectionFilter, fromBookInfo]);

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

  if (loading) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header 
          title={title}
          showBackButton={!!(fromBookInfo === 'true')} // Show back button when navigated from BookInfo
          rightButton={{
            icon: 'filter-outline',
            onPress: toggleFilterDropdown,
            buttonRef: filterButtonRef
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brand.red} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header 
          title={title}
          showBackButton={!!(fromBookInfo === 'true')} 
          rightButton={{
            icon: 'filter-outline',
            onPress: toggleFilterDropdown,
            buttonRef: filterButtonRef
          }} 
        />
        <Text style={styles.error}>
          {error}
        </Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <Header 
        title={title}
        showBackButton={!!(fromBookInfo === 'true')} 
        rightButton={{
          icon: 'filter-outline',
          onPress: toggleFilterDropdown,
          buttonRef: filterButtonRef
        }}
      />
      <SearchableBookList books={books} />
      
      {/* Filter Dropdown */}
      <FilterDropdown 
        visible={isDropdownVisible}
        collectionFilter={collectionFilter}
        position={filterButtonPosition}
        onClose={() => setIsDropdownVisible(false)}
        onSelectFilter={applyCollectionFilter}
      />
    </ScreenWrapper>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'light'].background,
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
  }
});

export default BooksScreen;
