import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { Colors } from '@/styles/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const LoadingScreen = () => {
  const colorScheme = useColorScheme();
  
  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'dark'].background }]}>
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

