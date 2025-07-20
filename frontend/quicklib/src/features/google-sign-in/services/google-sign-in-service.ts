import { Platform } from 'react-native';
import { getAuth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '@/config/firebase';
import { GoogleOneTapSignIn } from '@react-native-google-signin/google-signin';

export interface GoogleSignInResult {
  type: 'success' | 'cancelled' | 'error' | 'noSavedCredentialFound';
  data?: {
    idToken?: string;
    accessToken?: string;
    user?: any;
  };
  error?: string;
}

export class GoogleSignInService {
  static async configure(config: any) {
    if (Platform.OS === 'web') {
      // No configuration needed for web
      return;
    } else {
      GoogleOneTapSignIn.configure(config);
    }
  }
  
  static async checkPlayServices() {
    if (Platform.OS === 'web') {
      return true;
    } else {
      return GoogleOneTapSignIn.checkPlayServices();
    }
  }
  
  static async signIn(): Promise<GoogleSignInResult> {
    try {
      if (Platform.OS === 'web') {
        const auth = getAuth();
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        return {
          type: 'success',
          data: {
            idToken,
            user: {
              id: result.user.uid,
              email: result.user.email,
              name: result.user.displayName,
              photo: result.user.photoURL,
            }
          }
        };
      } else {
        const signInResponse = await GoogleOneTapSignIn.signIn();
        if (signInResponse.type === 'success') {
          return {
            type: 'success',
            data: {
              idToken: signInResponse.data.idToken,
              user: signInResponse.data.user
            }
          };
        } else {
          return { type: signInResponse.type };
        }
      }
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      if (Platform.OS === 'web' && (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request')) {
        return { type: 'cancelled' };
      }
      return { 
        type: 'error', 
        error: error.message || 'Sign in failed' 
      };
    }
  }
  
  static async createAccount(): Promise<GoogleSignInResult> {
    if (Platform.OS === 'web') {
      // On web, createAccount is the same as signIn
      return this.signIn();
    } else {
      try {
        const createResponse = await GoogleOneTapSignIn.createAccount();
        if (createResponse.type === 'success') {
          return {
            type: 'success',
            data: {
              idToken: createResponse.data.idToken,
              user: createResponse.data.user
            }
          };
        } else {
          return { type: createResponse.type };
        }
      } catch (error: any) {
        console.error('Mobile Google Create Account error:', error);
        return { 
          type: 'error', 
          error: error.message || 'Account creation failed' 
        };
      }
    }
  }
  
  static async signOut(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        const auth = getAuth();
        await firebaseSignOut(auth);
      } else {
        await GoogleOneTapSignIn.signOut();
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
  
  static async revokeAccess(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await this.signOut();
        // Note: Complete access revocation on web requires additional Google API calls
      } else {
        await GoogleOneTapSignIn.revokeAccess("");
      }
    } catch (error) {
      console.error('Revoke access error:', error);
      throw error;
    }
  }
}
