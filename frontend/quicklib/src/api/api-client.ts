import { getAuth } from '@/config/firebase';
import axios from 'axios';
import { BookControllerApi, Configuration, TestAuthControllerApi, UserControllerApi } from './generated';
import Constants from 'expo-constants';

// Use config variables for API base path
const basePath = Constants.expoConfig?.extra?.apiUrl;

// Function to get the current access token from Firebase Auth
const getAccessToken = async () => {
  console.log('getAccessToken called, getting current user');
  const auth = getAuth();
  console.log('Auth state:', auth.currentUser ? 'User is logged in' : 'No user logged in');
  
  const user = auth.currentUser;
  if (user) {
    try {
      console.log('User found, getting ID token');
      const token = await user.getIdToken(); // Force refresh token
      console.log('Token retrieved successfully:', token.substring(0, 10) + '...');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      throw error;
    }
  }
  console.error('No authenticated user found');
  throw new Error('No authenticated user found. Access token is required.');
};

// Create a custom axios instance that will handle the auth header
const customAxiosInstance = axios.create({
  baseURL: basePath
});

// Add auth token to every request
customAxiosInstance.interceptors.request.use(async config => {
  try {
    const token = await getAccessToken();
    if (token) {
      console.log('Setting Authorization header with token');
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error setting auth header:', error);
  }
  return config;
}, error => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor to handle auth errors
customAxiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Authentication error:', error.response?.status, error.response?.data);
    }
    return Promise.reject(error);
  }
);

const config = new Configuration({
});

// Create API instances with our custom axios instance
export const bookApi = new BookControllerApi(config, basePath, customAxiosInstance);
export const userApi = new UserControllerApi(config, basePath, customAxiosInstance);
export const testAuthApi = new TestAuthControllerApi(config, basePath, customAxiosInstance);

