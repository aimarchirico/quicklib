import React, { useMemo, useEffect, useState } from 'react';

import { View, Pressable, Platform, Text, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useSegments, Tabs, useRouter } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/tab-bar-icon';
import * as Font from 'expo-font';
import { Colors } from '@/styles/colors';
import { FontFamily } from '@/styles/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';

const makeStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
    root: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: Colors[colorScheme].background,
    },
    sidebar: {
      width: 250,
      backgroundColor: Colors[colorScheme].card,
      alignItems: 'center',
      paddingTop: 32,
    },
    sidebarButton: {
      paddingLeft: 20,
      marginBottom: 50,
      alignItems: 'center',
      flexDirection: 'row',
      width: '90%',
      justifyContent: 'flex-start',
    },
    sidebarLabel: {
      marginLeft: 16,
      fontFamily: FontFamily.medium,
      fontSize: 16,
    },
    content: {
      flex: 1,
    },
})

export default function TabLayout() {
  const [iconsReady, setIconsReady] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const currentTab = segments[segments.length - 1];
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    async function loadAssets() {
      try {
        // Load icon font used by TabBarIcon (Ionicons)
        await Font.loadAsync({
          Ionicons: require('react-native-vector-icons/Fonts/Ionicons.ttf'),
        });
        setIconsReady(true);
      } catch (e) {
        console.error('Error loading icon font:', e);
        setIconsReady(true); // Fallback: allow render even if font fails
      }
    }
    loadAssets();
  }, []);

  if (!iconsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors[colorScheme].background }}>
        <ActivityIndicator size="large" color={Colors.brand.green} />
      </View>
    );
  }

  // Show sidebar only for web and wide screens
  if (Platform.OS === 'web' && width > 600) {
    return (
      <View style={styles.root}>
        <View style={styles.sidebar}>
          {/* Sidebar navigation icons with labels */}
          <Pressable onPress={() => router.navigate('/(books)' as any)} style={styles.sidebarButton}>
            <TabBarIcon name={'book-outline'} color={(currentTab === '(books)' || currentTab === 'info' || currentTab === 'edit') ? Colors.brand.green : Colors[colorScheme ?? 'dark'].icon} />
            <Text style={[styles.sidebarLabel, { color: (currentTab === '(books)' || currentTab === 'info' || currentTab === 'edit') ? Colors.brand.green : Colors[colorScheme ?? 'dark'].icon }]}>Books</Text>
          </Pressable>
          <Pressable onPress={() => router.navigate('/add')} style={styles.sidebarButton}>
            <TabBarIcon name={'add-circle-outline'} color={currentTab === 'add' ? Colors.brand.green : Colors[colorScheme ?? 'dark'].icon} />
            <Text style={[styles.sidebarLabel, { color: currentTab === 'add' ? Colors.brand.green : Colors[colorScheme ?? 'dark'].icon }]}>Add</Text>
          </Pressable>
          <Pressable onPress={() => router.navigate('/settings')} style={styles.sidebarButton}>
            <TabBarIcon name={'settings-outline'} color={currentTab === 'settings' ? Colors.brand.green : Colors[colorScheme ?? 'dark'].icon} />
            <Text style={[styles.sidebarLabel, { color: currentTab === 'settings' ? Colors.brand.green : Colors[colorScheme ?? 'dark'].icon }]}>Settings</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          {/* Render tab content */}
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: 'none' }, // Hide bottom bar
            }}
          >
            <Tabs.Screen name="(books)" />
            <Tabs.Screen name="add" />
            <Tabs.Screen name="settings" />
          </Tabs>
        </View>
      </View>
    );
  }
  // Mobile: keep bottom bar
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'dark'].card,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: Colors.brand.green, 
        tabBarInactiveTintColor: Colors[colorScheme ?? 'dark'].icon,
        tabBarLabelStyle: {
          fontFamily: FontFamily.medium,
          fontSize: 10,
        },
      }}>
      <Tabs.Screen
        name="(books)"
        options={{
          title: 'Books',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add/index"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
