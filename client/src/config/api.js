/**
 * API Configuration
 * 
 * Configure your backend API base URL here.
 * 
 * Vercel Production URL: https://bharatkumbh-7ca5vnvq7-artifycode-prods-projects.vercel.app
 * 
 * To use local development server, set USE_LOCAL_SERVER to true
 * and update LOCAL_SERVER_URL with your computer's IP address
 */

import { Platform } from 'react-native';

// Configuration: Set to true to use local server, false to use Vercel
const USE_LOCAL_SERVER = false;

// Local server configuration (only used if USE_LOCAL_SERVER is true)
const LOCAL_SERVER_URL = {
  android: 'http://192.168.1.4:5000', // Your computer's IP address for Android
  ios: 'http://localhost:5000', // Localhost for iOS simulator
};

  // Vercel production URL (updated after redeploy)
  const VERCEL_URL = 'https://bharatkumbh.vercel.app';

// Get the base URL based on configuration
const getBaseURL = () => {
  // If using local server in development
  if (USE_LOCAL_SERVER && __DEV__) {
    if (Platform.OS === 'android') {
      return LOCAL_SERVER_URL.android;
    } else {
      return LOCAL_SERVER_URL.ios;
    }
  }
  
  // Default: Use Vercel deployment (works for both dev and production)
  return VERCEL_URL;
};

const API_BASE_URL = getBaseURL();

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds (increased for Vercel cold starts)
};

export default API_CONFIG;

