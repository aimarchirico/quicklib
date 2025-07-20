import LoadingScreen from '@/components/loading-screen';
import { getAuth, onAuthStateChanged } from '@/config/firebase';
import { Redirect, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { Image, StyleSheet, Text, View } from 'react-native';
import SignInButton from '@/features/google-sign-in/components/sign-in-button';
import { Colors } from '@/styles/colors';
import { FontFamily } from '@/styles/fonts';

const LoginScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      console.log('Login page auth state changed:', currentUser ? 'User logged in' : 'No user');
      setUser(currentUser);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {    
      const auth = getAuth();
      console.log('Login page focused, current user:', auth.currentUser ? 'logged in' : 'not logged in');
      setUser(auth.currentUser);
      setAuthChecked(true);
    }, [])
  );
  
  // Don't redirect until we've checked auth state
  if (!authChecked) {
    return <LoadingScreen />; // Show loading while checking auth
  }
  
  // If logged in, redirect to tabs
  if (user) {
    console.log('User is logged in, redirecting to tabs');
    return <Redirect href="./(tabs)" />;
  }
  
  console.log('No user, showing login screen');
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
            />
          </View>
          
          <Text style={styles.title}>QuickLib</Text>
          <Text style={styles.subtitle}>Your personal library</Text>
          
          <View style={styles.buttonContainer}>
            <SignInButton />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'dark'].background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    marginBottom: 8,
    color: Colors[colorScheme ?? 'dark'].text,
    width: '100%', 
    textAlign: 'center', 
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: Colors[colorScheme ?? 'dark'].icon,
    width: '100%',
    fontFamily: FontFamily.regular,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
  },
});

export default LoginScreen;