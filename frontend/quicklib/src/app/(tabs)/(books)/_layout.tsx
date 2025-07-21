import { Colors } from '@/styles/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
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
      <Stack.Screen name="(books)" />
      <Stack.Screen name="info/index" />
      <Stack.Screen name="edit/index" />
    </Stack>
  );
}
