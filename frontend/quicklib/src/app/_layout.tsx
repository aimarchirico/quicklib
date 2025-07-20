import { Colors } from '@/styles/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAuth } from '@/config/firebase';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BooksProvider } from '@/context/books-context';
import UpdateNotificationModal from '@/components/update-notification-modal';

import { View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Load the custom fonts
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('../assets/fonts/google-sans-regular.ttf'),
    'GoogleSans-Medium': require('../assets/fonts/google-sans-medium.ttf'),
    'GoogleSans-Bold': require('../assets/fonts/google-sans-bold.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/space-mono-regular.ttf'),
  });
  
  useEffect(() => {
    // Log the initial auth state
    const auth = getAuth();
    console.log('RootLayout initial auth state:', auth.currentUser ? 'User logged in' : 'No user');

    // Set document title for all screens (web only)
    if (typeof document !== 'undefined') {
      document.title = 'QuickLib';
    }

    // Only hide the splash screen once fonts are loaded and other initialization is done
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontsLoaded]);

  
  return (
    <SafeAreaProvider>
      <BooksProvider>
          <View style={{ width: '100%', flex: 1}}>
            <UpdateNotificationModal />
            <Slot screenOptions={{ 
              contentStyle: { 
                backgroundColor: Colors[colorScheme ?? 'dark'].card,
              } 
            }} />
          </View>
      </BooksProvider>
    </SafeAreaProvider>
  );
}
