import { BookRequest } from '@/api/generated';
import BookForm from '@/components/BookForm';
import { useBooks } from '@/hooks/useBooks';
import { router } from 'expo-router';
import React from 'react';

const AddBookScreen = () => {
  const { add } = useBooks();
  const handleSubmit = async (data: BookRequest) => {
    try {
      const result = await add(data);
      router.push({ pathname: '/(tabs)/(books)/bookInfo', params: { id: result.id } });
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };

  // Show loading while fetching book details for ISBN
  if (isLoading) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header title="Add Book" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brand.green} />
          <Text style={styles.loadingText}>Looking up book details...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <BookForm
      isEditing={false}
      onSubmit={handleSubmit}
      headerTitle="Add Book"
      initialData={initialData}
    />
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
  loadingText: {
    color: Colors[colorScheme ?? 'light'].text,
    fontSize: 16,
    fontFamily: FontFamily.regular,
    marginTop: 16,
  },
});

export default AddBookScreen;
