import { userApi } from '@/api/api-client';
import { GoogleSignInService } from '@/features/google-sign-in/services/google-sign-in-service';
import { getAuth, signInWithCredential, signOut as firebaseSignOut, GoogleAuthProvider } from '@/config/firebase';

const useGoogleSignIn = () => {

  const signIn = async () => {
    try {
      await GoogleSignInService.configure({
        webClientId: 'autoDetect'
      });

      await GoogleSignInService.checkPlayServices();
      
      const signInResult = await GoogleSignInService.signIn();
      if (signInResult.type === 'success' && signInResult.data?.idToken) {
        console.log('Google Sign In successful:', signInResult);
        const googleCredential = GoogleAuthProvider.credential(signInResult.data.idToken);
        await signInWithCredential(getAuth(), googleCredential);
        return signInResult.data;
      } else if (signInResult.type === 'noSavedCredentialFound') {
        const createResponse = await GoogleSignInService.createAccount();
        if (createResponse.type === 'success' && createResponse.data?.idToken) {
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
      await GoogleSignInService.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      // 1. First revoke Google access
      await GoogleSignInService.revokeAccess();
      
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

export default useGoogleSignIn;