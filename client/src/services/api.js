/**
 * API Service - Axios instance with interceptors
 * Handles authentication tokens and error responses
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

const TOKEN_KEY = 'auth_token';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        tokenLength: token?.length
      });
    } else {
      console.log('⚠️ No token found for request:', {
        url: config.url,
        method: config.method,
        requiresAuth: config.url?.includes('/api/') && !config.url?.includes('/api/auth/login') && !config.url?.includes('/api/auth/register')
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear stored token
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem('user_role');
      await AsyncStorage.removeItem('user_name');
      
      // You can dispatch a logout action here if using Redux
      // For now, the app will handle this in the component
    }

    // Return error with better formatting
    const errorMessage = error.response?.data?.message || error.message || 'Network error occurred';
    
    // Provide more specific error messages
    if (!error.response && error.request) {
      // Network error - no response from server
      return Promise.reject({
        message: `Cannot connect to server at ${API_CONFIG.BASE_URL}. Please check:\n1. Backend server is running\n2. Correct API URL\n3. Network connection`,
        status: 0,
        request: error.request,
        response: null,
      });
    }
    
    // Log detailed error for debugging
    console.error('❌ API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
      isHTML: typeof error.response?.data === 'string' && error.response.data.includes('<!doctype html>')
    });
    
    // Check if response is HTML (deployment protection)
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!doctype html>')) {
      return Promise.reject({
        message: 'Deployment protection is enabled. Please disable it in Vercel settings.',
        status: error.response?.status,
        data: 'HTML response detected - deployment protection is ON',
        response: error.response,
        request: error.request,
      });
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      response: error.response,
      request: error.request,
    });
  }
);

export default api;

