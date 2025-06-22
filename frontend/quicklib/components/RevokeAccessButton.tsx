import React, { useState } from "react";
import { ActivityIndicator, Button, View } from "react-native";
import useLoginWithGoogle from "../hooks/useLoginWithGoogle";
import { getAuth, signOut } from "@react-native-firebase/auth";

const RevokeAccessButton = () => {
  const { revokeAccess } = useLoginWithGoogle();
  const [loading, setLoading] = useState(false);

  const handleRevoke = async () => {
    const auth = getAuth();
    setLoading(true);
    try {
      await signOut(auth);
      await revokeAccess();
    } catch (e) {
      // handle error if needed
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ marginTop: 8 }}>
      <Button title="Revoke Access" onPress={handleRevoke} />
    </View>
  );
};

export default RevokeAccessButton;
