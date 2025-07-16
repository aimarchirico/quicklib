import { Platform } from 'react-native';

// Web Firebase configuration
import firebaseConfig from '@/google-services-web.json';


let firebaseAuth: any;
let firebaseGoogleProvider: any;
let firebaseGoogleAuthProvider: any;
let firebaseSignInWithPopup: any;
let firebaseSignInWithCredential: any;
let firebaseSignOut: any;
let firebaseOnAuthStateChanged: any;

if (Platform.OS === 'web') {
  // Web Firebase imports and initialization
  const { initializeApp } = require('firebase/app');
  const { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged, 
    signInWithCredential 
  } = require('firebase/auth');
  

  // Initialize Firebase for web
  const app = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(app);
  
  // Create Google provider for web
  firebaseGoogleProvider = new GoogleAuthProvider();
  firebaseGoogleProvider.addScope('email');
  firebaseGoogleProvider.addScope('profile');
  
  // Assign web functions
  firebaseGoogleAuthProvider = GoogleAuthProvider;
  firebaseSignInWithPopup = signInWithPopup;
  firebaseSignInWithCredential = signInWithCredential;
  firebaseSignOut = signOut;
  firebaseOnAuthStateChanged = onAuthStateChanged;
  
} else {
  // Mobile Firebase imports (react-native-firebase)
  const { 
    getAuth, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged, 
    signInWithCredential 
  } = require('@react-native-firebase/auth');
  
  // Assign mobile functions
  firebaseAuth = getAuth();
  firebaseGoogleAuthProvider = GoogleAuthProvider;
  firebaseSignInWithCredential = signInWithCredential;
  firebaseSignOut = signOut;
  firebaseOnAuthStateChanged = onAuthStateChanged;
}

// Export unified interface
export const getAuth = () => firebaseAuth;
export const GoogleAuthProvider = firebaseGoogleAuthProvider;
export const googleProvider = firebaseGoogleProvider;
export const signInWithPopup = firebaseSignInWithPopup;
export const signInWithCredential = firebaseSignInWithCredential;
export const signOut = firebaseSignOut;
export const onAuthStateChanged = firebaseOnAuthStateChanged;
export { firebaseConfig };
