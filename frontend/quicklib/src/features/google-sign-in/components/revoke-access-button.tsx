import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useGoogleSignIn } from '@/features/google-sign-in/hooks/use-google-sign-in';
import { Button } from '@/components/ui/button';

export const RevokeAccessButton = () => {
  const { deleteAccount } = useGoogleSignIn();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteAccount();
    } catch (e) {
      console.error('Error deleting account:', e);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Delete Account" 
        onPress={handleDeleteAccount} 
        variant="danger"
        loading={loading}
      />
    </View>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    marginTop: 8,
  },
});