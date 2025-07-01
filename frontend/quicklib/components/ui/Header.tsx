import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderRightButton {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  buttonRef?: React.RefObject<View | null>;
  loading?: boolean;
  disabled?: boolean;
}

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  RightComponent?: React.ReactNode;
  rightButton?: HeaderRightButton;
  rightButtons?: HeaderRightButton[];
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false, 
  onBackPress, 
  RightComponent,
  rightButton,
  rightButtons
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={handleBackPress} 
            style={styles.backButton}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={Colors.brand.red} 
            />
          </TouchableOpacity>
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      {(RightComponent || rightButton || rightButtons) && (
        <View style={styles.rightSection}>
          {RightComponent}
          {rightButtons && rightButtons.map((button, index) => (
            <TouchableOpacity 
              key={index}
              onPress={button.onPress} 
              style={[styles.iconButton, index > 0 && styles.iconButtonSpacing]}
              ref={button.buttonRef}
              disabled={button.disabled || button.loading}
            >
              {button.loading ? (
                <ActivityIndicator size={24} color={Colors.brand.green} />
              ) : (
                <Ionicons 
                  name={button.icon} 
                  size={24} 
                  color={Colors.brand.red} 
                />
              )}
            </TouchableOpacity>
          ))}
          {rightButton && (
            <TouchableOpacity 
              onPress={rightButton.onPress} 
              style={styles.iconButton}
              ref={rightButton.buttonRef}
              disabled={rightButton.disabled || rightButton.loading}
            >
              {rightButton.loading ? (
                <ActivityIndicator size={24} color={Colors.brand.green} />
              ) : (
                <Ionicons 
                  name={rightButton.icon} 
                  size={24} 
                  color={Colors.brand.red} 
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: Colors[colorScheme ?? 'light'].background,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 30,
    backgroundColor: Colors[colorScheme ?? 'light'].card,
  },
  title: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    color: Colors[colorScheme ?? 'light'].text,
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: Colors[colorScheme ?? 'light'].card,
  },
  iconButtonSpacing: {
    marginLeft: 8,
  },
});

export default Header;
