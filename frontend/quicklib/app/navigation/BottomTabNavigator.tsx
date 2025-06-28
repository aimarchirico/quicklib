import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Colors } from '@/globals/colors';

// Import your screens here
import AddBookScreen from '@/screens/AddBookScreen';
import LibraryScreen from '@/screens/LibraryScreen';
import SearchScreen from '@/screens/SearchScreen';
import WishlistScreen from '@/screens/WishlistScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'alert-circle-outline';

          if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Add Book') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.brand.green,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTitleStyle: {
          color: Colors.dark.text,
        },
      })}
    >
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add Book" component={AddBookScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
