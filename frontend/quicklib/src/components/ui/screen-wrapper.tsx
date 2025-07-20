import { Colors } from '@/styles/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

/**
 * A wrapper component that provides consistent styling for all screens
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
}) => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme ?? 'dark'].background,
          paddingHorizontal: 16,
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: Platform.OS !== 'web' ? -25 : 0,
  }
});
