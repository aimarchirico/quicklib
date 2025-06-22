import React, { useState } from 'react';
import { ActivityIndicator, Button, View } from 'react-native';
import useLoginWithGoogle from '../hooks/useLoginWithGoogle';

const LoginButton = () => {
  const { signIn, signOut } = useLoginWithGoogle();
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
      setLoggedIn(true);
    } catch (e) {
      // handle error if needed
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setLoggedIn(false);
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
      {loggedIn ? (
        <Button title="Sign Out" onPress={handleSignOut} />
      ) : (
        <Button title="Sign In with Google" onPress={handleSignIn} />
      )}
    </View>
  );
};

export default LoginButton;