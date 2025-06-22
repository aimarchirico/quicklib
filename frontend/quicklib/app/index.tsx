import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import LoginButton from "../components/LoginButton";
import RevokeAccessButton from "../components/RevokeAccessButton";

export default function Index() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <LoginButton user={user} />
      <RevokeAccessButton />
      {user && (
        <Text style={{ marginTop: 16 }}>
          Logged in as: {user.email}
        </Text>
      )}
    </View>
  );
}
