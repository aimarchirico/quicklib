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

  return (
    <BookForm
      isEditing={false}
      onSubmit={handleSubmit}
      headerTitle="Add Book"
    />
  );
};

export default AddBookScreen;
