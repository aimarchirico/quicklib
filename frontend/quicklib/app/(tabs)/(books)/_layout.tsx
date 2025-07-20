import { Colors } from '@/globals/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
import React from 'react';

export default function BooksStack() {
  const colorScheme = useColorScheme();
  
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { 
          backgroundColor: Colors[colorScheme ?? 'dark'].background 
        },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="bookInfo" />
      <Stack.Screen name="editBook" />
    </Stack>
  );
}
