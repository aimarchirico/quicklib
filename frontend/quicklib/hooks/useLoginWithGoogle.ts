import {
  GoogleOneTapSignIn,
} from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';

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
        return signInResponse.data;
      } else if (signInResponse.type === 'noSavedCredentialFound') {
        const createResponse = await GoogleOneTapSignIn.createAccount();
        if (createResponse.type === 'success') {
          console.log('Account created successfully:', createResponse);
          const googleCredential = GoogleAuthProvider.credential(createResponse.data.idToken);
          signInWithCredential(getAuth(), googleCredential);
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
      await GoogleOneTapSignIn.revokeAccess("");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return {
    signIn,
    signOut,
  };

}

export default useLoginWithGoogle;