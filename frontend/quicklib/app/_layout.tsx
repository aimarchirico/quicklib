import { Colors } from '@/globals/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getAuth } from '@react-native-firebase/auth';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Load the custom fonts
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('../assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-Bold': require('../assets/fonts/GoogleSans-Bold.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  useEffect(() => {
    // Log the initial auth state
    const auth = getAuth();
    console.log('RootLayout initial auth state:', auth.currentUser ? 'User logged in' : 'No user');
    
    // Only hide the splash screen once fonts are loaded and other initialization is done
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontsLoaded]);

  return (
    <SafeAreaProvider>
      <Slot screenOptions={{ 
        contentStyle: { 
          backgroundColor: Colors[colorScheme ?? 'light'].card,
        } 
      }} />
    </SafeAreaProvider>
  );
}
