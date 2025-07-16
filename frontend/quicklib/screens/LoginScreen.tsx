import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LoginButton from '../components/LoginButton';

type Props = {};

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
            />
          </View>
          
          <Text style={styles.title}>QuickLib</Text>
          <Text style={styles.subtitle}>Your personal library</Text>
          
          <View style={styles.buttonContainer}>
            <LoginButton />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'dark'].background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    marginBottom: 8,
    color: Colors[colorScheme ?? 'dark'].text,
    width: '100%', 
    textAlign: 'center', 
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: Colors[colorScheme ?? 'dark'].icon,
    width: '100%',
    fontFamily: FontFamily.regular,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
  },
});

export default LoginScreen;
