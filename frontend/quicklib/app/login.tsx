import LoadingScreen from '@/components/LoadingScreen';
import LoginScreen from '@/screens/LoginScreen';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { Redirect, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';

export default function Login() {
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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
  return <LoginScreen />;
}
