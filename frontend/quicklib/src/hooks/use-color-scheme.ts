import { useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorScheme() {
  const nativeScheme = useNativeColorScheme();
  const [scheme, setScheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setScheme(nativeScheme ?? 'dark');
  }, [nativeScheme]);

  return scheme;
}