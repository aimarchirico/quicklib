import { userApi } from '@/api/ApiClient';
import { GoogleAuthProvider, signOut as firebaseSignOut, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import {
  GoogleOneTapSignIn,
} from "@react-native-google-signin/google-signin";

const useLoginWithGoogle = () => {

  const signIn = async () => {
    try {
      GoogleOneTapSignIn.configure({
        webClientId: 'autoDetect'
      });

      await GoogleOneTapSignIn.checkPlayServices();
      const signInResponse = await GoogleOneTapSignIn.signIn();
      if (signInResponse.type === 'success') {
        console.log('Google Sign In successful:', signInResponse);
        const googleCredential = GoogleAuthProvider.credential(signInResponse.data.idToken);
        await signInWithCredential(getAuth(), googleCredential);
        return signInResponse.data;
      } else if (signInResponse.type === 'noSavedCredentialFound') {
        const createResponse = await GoogleOneTapSignIn.createAccount();
        if (createResponse.type === 'success') {
          console.log('Account created successfully:', createResponse);
          const googleCredential = GoogleAuthProvider.credential(createResponse.data.idToken);
          await signInWithCredential(getAuth(), googleCredential);
          return createResponse.data;
        }
      }
    } catch (error) {
      console.error("Google Sign In failed:", error);
      throw error;
    }
  };
  
  const signOut = async (): Promise<void> => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      await GoogleOneTapSignIn.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      // 1. First revoke Google One Tap access
      await GoogleOneTapSignIn.revokeAccess("");
      
      // 2. Delete user from backend 
      await userApi.deleteUser()
      
      // 3. Delete Firebase auth user
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.delete();
      }
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  };

  return {
    signIn,
    signOut,
    deleteAccount,
  };

}

export default useLoginWithGoogle;