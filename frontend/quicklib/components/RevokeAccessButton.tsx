import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import useLoginWithGoogle from "../hooks/useLoginWithGoogle";
import CustomButton from "./ui/Button";

const RevokeAccessButton = () => {
  const { deleteAccount, signOut } = useLoginWithGoogle();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteAccount();
    } catch (e) {
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <CustomButton 
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

export default RevokeAccessButton;
