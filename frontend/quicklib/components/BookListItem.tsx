import { BookResponse } from '@/api/generated';
import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BookListItemProps {
  book: BookResponse;
}

const BookListItem: React.FC<BookListItemProps> = ({ book }) => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  // Create styles based on the current color scheme
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  
  const handlePress = () => {
    router.push({
      pathname: "/(tabs)/(books)/bookInfo",
      params: { id: book.id }
    });
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View>
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {book.title}
        </Text>
        <Text style={styles.author}>{book.author}</Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors[colorScheme ?? 'light'].card,
  },
  title: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors[colorScheme ?? 'light'].text,
  },
  author: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: FontFamily.regular,
    color: Colors[colorScheme ?? 'light'].icon,
  },
});

export default BookListItem;
