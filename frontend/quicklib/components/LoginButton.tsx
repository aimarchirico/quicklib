import { useColorScheme } from '@/hooks/useColorScheme';
import { getAuth, onAuthStateChanged } from '@/config/firebase';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import useLoginWithGoogle from '../hooks/useLoginWithGoogle';
import Button from './ui/Button';

type Props = {};

const LoginButton = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { signIn, signOut } = useLoginWithGoogle();
  const colorScheme = useColorScheme();
  const router = useRouter();
  // Create styles based on the current color scheme
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handlePress = async () => {
    setLoading(true);
    try {
      if (user) {
        await signOut();
        router.replace('/login');
      } else {
        await signIn();
        
        // Wait a bit for auth state to propagate
        setTimeout(() => {
          const auth = getAuth();
          if (auth.currentUser) {
            router.replace('/(tabs)' as any);
          } else {
            console.error('Sign in appeared to succeed but no user found');
          }
        }, 500);
      }
    } catch (e) {
      console.error('Authentication error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
        title={user ? 'Sign out' : 'Sign in with Google'}
        onPress={handlePress}
        variant={user ? 'danger' : 'primary'}
        loading={loading}
      />
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
});

export default LoginButton;