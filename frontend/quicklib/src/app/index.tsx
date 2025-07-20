
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import LoadingScreen from '@/components/loading-screen';
import { getAuth, onAuthStateChanged } from '@/config/firebase';

const HomeScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  if (!authChecked) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Redirect href="./(tabs)" />;
  }

  return <Redirect href="./login" />;
}

export default HomeScreen;