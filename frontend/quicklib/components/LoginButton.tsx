import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { getAuth, signOut } from '@react-native-firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Button, View } from 'react-native';
import useLoginWithGoogle from '../hooks/useLoginWithGoogle'; 

type Props = {
  user: FirebaseAuthTypes.User | null;
};

const LoginButton = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const { signIn, revokeAccess } = useLoginWithGoogle();

  const handlePress = async () => {
    const auth = getAuth();
    setLoading(true);
    try {
      if (user) {
        await signOut(auth);
      } else {
        await signIn()
      }
    } catch (e) {
      // handle error if needed
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Button
        title={user ? 'Sign out' : 'Sign in'}
        onPress={handlePress}
      />
    </View>
  );
};

export default LoginButton;