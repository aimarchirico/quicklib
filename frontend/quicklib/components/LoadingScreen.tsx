import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Colors } from '@/globals/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingScreen = () => {
  const colorScheme = useColorScheme();
  
  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ActivityIndicator size="large" color={Colors.brand.green} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
