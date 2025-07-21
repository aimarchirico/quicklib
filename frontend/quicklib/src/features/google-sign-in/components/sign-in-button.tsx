import { getAuth, onAuthStateChanged } from '@/config/firebase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useGoogleSignIn } from '@/features/google-sign-in/hooks/use-google-sign-in';
import { Button } from '@/components/ui/button';

export const SignInButton = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { signIn, signOut } = useGoogleSignIn();
  const router = useRouter();
  // Create styles based on the current color scheme
 
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
        router.replace('/signin');
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
        title={user ? 'Sign Out' : 'Sign In with Google'}
        onPress={handlePress}
        variant={user ? 'danger' : 'primary'}
        loading={loading}
      />
  );
};
