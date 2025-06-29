import LoginScreen from '@/screens/LoginScreen';
import { getAuth } from '@react-native-firebase/auth';
import { Redirect, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';

export default function Login() {
  const [user, setUser] = useState<any>();

  useFocusEffect(
    useCallback(() => {    
      const auth = getAuth();
      setUser(auth.currentUser);
    }, [])
  );
  
  // If logged in, redirect to tabs
  if (user) {
    console.log('User is logged in, redirecting to tabs');
    return <Redirect href="./(tabs)" />;
  }
  
  console.log('No user, showing login screen');
  return <LoginScreen />;
}
