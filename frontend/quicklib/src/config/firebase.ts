import { Platform } from 'react-native';
import webConfig from '@/config/google-services-web';

// Web Firebase imports
import { initializeApp } from 'firebase/app';
import {
  getAuth as getWebAuth,
  GoogleAuthProvider as WebGoogleAuthProvider,
  signInWithPopup as webSignInWithPopup,
  signOut as webSignOut,
  onAuthStateChanged as webOnAuthStateChanged,
  signInWithCredential as webSignInWithCredential
} from 'firebase/auth';

// Mobile Firebase imports
import {
  getAuth as getMobileAuth,
  GoogleAuthProvider as MobileGoogleAuthProvider,
  signOut as mobileSignOut,
  onAuthStateChanged as mobileOnAuthStateChanged,
  signInWithCredential as mobileSignInWithCredential
} from '@react-native-firebase/auth';

let firebaseAuth: any;
let firebaseGoogleProvider: any;
let firebaseGoogleAuthProvider: any;
let firebaseSignInWithPopup: any;
let firebaseSignInWithCredential: any;
let firebaseSignOut: any;
let firebaseOnAuthStateChanged: any;

if (Platform.OS === 'web') {
  const app = initializeApp(webConfig);
  firebaseAuth = getWebAuth(app);
  firebaseGoogleProvider = new WebGoogleAuthProvider();
  firebaseGoogleProvider.addScope('email');
  firebaseGoogleProvider.addScope('profile');
  firebaseGoogleAuthProvider = WebGoogleAuthProvider;
  firebaseSignInWithPopup = webSignInWithPopup;
  firebaseSignInWithCredential = webSignInWithCredential;
  firebaseSignOut = webSignOut;
  firebaseOnAuthStateChanged = webOnAuthStateChanged;
} else {
  firebaseAuth = getMobileAuth();
  firebaseGoogleAuthProvider = MobileGoogleAuthProvider;
  firebaseSignInWithCredential = mobileSignInWithCredential;
  firebaseSignOut = mobileSignOut;
  firebaseOnAuthStateChanged = mobileOnAuthStateChanged;
}

export const getAuth = () => firebaseAuth;
export const GoogleAuthProvider = firebaseGoogleAuthProvider;
export const googleProvider = firebaseGoogleProvider;
export const signInWithPopup = firebaseSignInWithPopup;
export const signInWithCredential = firebaseSignInWithCredential;
export const signOut = firebaseSignOut;
export const onAuthStateChanged = firebaseOnAuthStateChanged;
export { webConfig };
