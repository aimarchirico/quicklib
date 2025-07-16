import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { ReactNode, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  fullWidth = false,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);

  // Determine button and text colors based on variant
  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'tertiary':
        baseStyle.push(styles.tertiaryButton);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButton);
        break;
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.text];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'tertiary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'danger':
        baseStyle.push(styles.dangerText);
        break;
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator 
            color={variant === 'primary' ? '#fff' : Colors[colorScheme ?? 'light'].text} 
            size="small" 
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  fullWidth: {
    width: '100%',
    flex: 1,
    
  },
  primaryButton: {
    backgroundColor: Colors.brand.green,
  },
  secondaryButton: {
    backgroundColor: Colors[colorScheme ?? 'light'].card,
  },
  tertiaryButton: {
    backgroundColor: Colors[colorScheme ?? 'light'].background,
  },
  dangerButton: {
    backgroundColor: Colors.brand.red,
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
    flexShrink: 0, 
    width: '100%',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: Colors[colorScheme ?? 'light'].text,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabledText: {
    opacity: 0.8,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default Button;
