import auth from '@react-native-firebase/auth';
import { BookControllerApi, Configuration, TestAuthControllerApi, UserControllerApi } from './generated';


// Use environment variable for backend base URL, fallback to localhost
const basePath = process.env.EXPO_PUBLIC_API_BASEPATH || 'http://localhost:8080';

// Function to get the current access token from Firebase Auth
const getAccessToken = async () => {
  const user = auth().currentUser;
  if (user) {
    return user.getIdToken();
  }
  throw new Error('No authenticated user found. Access token is required.');
};

const config = new Configuration({
  basePath,
  accessToken: getAccessToken, // This will be called before each request
});

export const bookApi = new BookControllerApi(config);
export const userApi = new UserControllerApi(config);
export const testAuthApi = new TestAuthControllerApi(config);

