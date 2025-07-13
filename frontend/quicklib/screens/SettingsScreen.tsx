import ConfirmationModal from '@/components/ConfirmationModal';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import { useBooksContext } from '@/context/BooksContext';
import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import useLoginWithGoogle from '@/hooks/useLoginWithGoogle';
import { getAuth } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  const { signOut, deleteAccount } = useLoginWithGoogle();
  const auth = getAuth();
  const user = auth.currentUser;
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const router = useRouter();
  const { books, loading } = useBooksContext();

  const readCount = books.filter(b => b.collection === 'READ').length;
  const unreadCount = books.filter(b => b.collection === 'UNREAD').length;
  const wishlistCount = books.filter(b => b.collection === 'WISHLIST').length;

  const handleSignout = async () => {
    try {
      console.log('Attempting to sign out from settings');
      await signOut();
      console.log('Successfully signed out, redirecting to login');
      
      // Explicitly navigate to login screen after signing out
      setTimeout(() => {
        router.replace('/login');
      }, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
      console.error(error);
    }
  };

  const handleShowDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('Attempting to delete account');
      // Delete account from backend and Firebase Auth
      await deleteAccount();
      console.log('Account deleted successfully, redirecting to login');
      
      setIsDeleteModalVisible(false);
      
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header title="Settings" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.brand.green} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="Settings" />
      <View style={styles.contentContainer}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Account</Text>
            {user && (
              <View style={styles.card}>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userName}>{user.displayName}</Text>
              </View>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Stats</Text>
            <View style={styles.card}>
              <Text style={styles.statsText}>
                {loading ? '' : `Read: ${readCount} book${readCount === 1 ? '' : 's'}`}
              </Text>
              <Text style={styles.statsText}>
                {loading ? '' : `Unread: ${unreadCount} book${unreadCount === 1 ? '' : 's'}`}
              </Text>
              <Text style={styles.statsText}>
                {loading ? '' : `Wishlist: ${wishlistCount} book${wishlistCount === 1 ? '' : 's'}`}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <Text style={styles.versionTitle}>QuickLib</Text>
              <Text style={styles.versionText}>Version {Constants.expoConfig?.extra?.appVersion}</Text>
            </View>
          </View>
        </ScrollView>

          <Button 
            title="Sign Out" 
            variant="primary" 
            onPress={handleSignout}
            fullWidth
          />
          <Button 
            title="Delete Account" 
            variant="danger" 
            onPress={handleShowDeleteModal}
            fullWidth
          />
      </View>
      
      {/* Confirmation Modal for Account Deletion */}
      <ConfirmationModal 
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account"
        message="This action cannot be undone. Please enter your email address to confirm deletion."
        confirmText="Delete"
        confirmationValue={user?.email || ''}
        confirmationPlaceholder="Enter your email address"
        confirmationErrorText="Please enter your email address correctly to confirm"
      />
    </ScreenWrapper>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme ?? 'light'].background,
    paddingBottom: 10, 
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors[colorScheme ?? 'light'].text,
    marginBottom: 16,
  },
  actions: {
    paddingVertical: 16,
  },
  card: {
    padding: 16,
    backgroundColor: Colors[colorScheme ?? 'light'].card,
    borderRadius: 20,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors[colorScheme ?? 'light'].text,
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors[colorScheme ?? 'light'].icon,
  },
  versionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors[colorScheme ?? 'light'].text,
    marginBottom: 6,
  },
  versionText: {
    fontSize: 16,
    color: Colors.brand.green,
    marginBottom: 8,
    fontFamily: FontFamily.regular,
  },
  versionDescription: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors[colorScheme ?? 'light'].icon,
  },
  statsText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors[colorScheme ?? 'light'].text,
    marginBottom: 4,
  },
});

export default SettingsScreen;
