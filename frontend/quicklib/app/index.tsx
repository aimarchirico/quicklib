import LoginButton from "@/components/LoginButton";
import RevokeAccessButton from "@/components/RevokeAccessButton";
import TestAuthButton from "@/components/TestAuthButton";
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    console.log("start")
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit apps/index.tsx to edit this screen.</Text>
      <TestAuthButton/>
      <LoginButton user={user} />
      <RevokeAccessButton />
    </View>
  );
}
