import { bookApi } from '@/api/ApiClient';
import { BookRequest, BookRequestCollectionEnum } from '@/api/generated';
import { Colors } from '@/globals/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  series: z.string().optional(),
  sequenceNumber: z.coerce.number().optional(),
  language: z.string().min(1, 'Language is required'),
  isbn: z.string().optional(),
  collection: z.nativeEnum(BookRequestCollectionEnum),
});

const AddBookScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<BookRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      collection: BookRequestCollectionEnum.Library,
    },
  });

  const onSubmit = async (data: BookRequest) => {
    try {
      const response = await bookApi.addBook(data);
      router.push({ pathname: './(tabs)/add', params: { id: response.data.id } });
    } catch (error) {
      Alert.alert('Error', 'Failed to add book');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

      <Text style={styles.label}>Author</Text>
      <Controller
        control={control}
        name="author"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.author && <Text style={styles.error}>{errors.author.message}</Text>}

      <Text style={styles.label}>Language</Text>
      <Controller
        control={control}
        name="language"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.language && <Text style={styles.error}>{errors.language.message}</Text>}

      <Button title="Add Book" onPress={handleSubmit(onSubmit)} color={Colors.brand.green} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.dark.background,
  },
  label: {
    color: Colors.dark.text,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: Colors.dark.text,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default AddBookScreen;
