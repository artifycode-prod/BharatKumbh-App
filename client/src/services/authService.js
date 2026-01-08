/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

/**
 * Register a new user
 */
export const register = async (data) => {
  const response = await api.post('/api/auth/register', data);
  
  if (response.data.success && response.data.token) {
    await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Login user
 */
export const login = async (data) => {
  try {
    console.log('🔐 Login attempt with:', { email: data.email, password: '***' });
    const response = await api.post('/api/auth/login', data);
    console.log('✅ Login response:', { success: response.data.success, hasToken: !!response.data.token, user: response.data.user });
    
    if (response.data.success && response.data.token) {
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      // Also store role and name separately for compatibility
      if (response.data.user.role) {
        await AsyncStorage.setItem('user_role', response.data.user.role);
      }
      if (response.data.user.name) {
        await AsyncStorage.setItem('user_name', response.data.user.name);
      }
      console.log('💾 User data stored in AsyncStorage');
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Login error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data.user;
};

/**
 * Update user location
 */
export const updateLocation = async (location) => {
  const response = await api.put(
    '/api/auth/update-location',
    location
  );
  return response.data.user;
};

/**
 * Logout user (clear local storage)
 */
export const logout = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
  await AsyncStorage.removeItem('user_role');
  await AsyncStorage.removeItem('user_name');
};

/**
 * Get stored token
 */
export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

/**
 * Get stored user data
 */
export const getStoredUser = async () => {
  const userData = await AsyncStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Get user name from AsyncStorage
 */
export const getUserName = async () => {
  const storedUser = await getStoredUser();
  if (storedUser && storedUser.name) {
    return storedUser.name;
  }
  return await AsyncStorage.getItem('user_name');
};

/**
 * Get user role from AsyncStorage
 */
export const getUserRole = async () => {
  const storedUser = await getStoredUser();
  if (storedUser && storedUser.role) {
    return storedUser.role;
  }
  return await AsyncStorage.getItem('user_role');
};

/**
 * Test if token is valid by calling /api/auth/me
 */
export const testToken = async () => {
  try {
    console.log('🧪 Testing token validity...');
    const token = await getToken();
    console.log('🔑 Token exists:', !!token, 'Length:', token?.length);
    
    if (!token) {
      console.error('❌ No token found in storage');
      return { valid: false, error: 'No token found' };
    }
    
    const response = await api.get('/api/auth/me');
    console.log('✅ Token is valid, user:', response.data.user);
    return { valid: true, user: response.data.user };
  } catch (error) {
    console.error('❌ Token test failed:', error.response?.status, error.message);
    return { 
      valid: false, 
      error: error.message,
      status: error.response?.status 
    };
  }
};

/**
 * Sign out user (alias for logout)
 */
export const signOut = async () => {
  return await logout();
};

/**
 * Sign in user (wrapper for login)
 */
export const signIn = async (identifier, password, role) => {
  try {
    // Support email or phone login
    // Normalize the email to match server expectations
    let email = (identifier || '').trim().toLowerCase();
    const normalizedPassword = (password || '').trim();
    
    if (!email.includes('@')) {
      email = `${email}@kumbh.com`;
    }
    
    const loginData = {
      email: email,
      password: normalizedPassword,
    };

    console.log('🚀 SignIn called with:', { 
      identifier, 
      email, 
      role,
      passwordLength: normalizedPassword.length 
    });
    const response = await login(loginData);
    
    // Store user data in AsyncStorage for compatibility
    if (response.success && response.user) {
      await AsyncStorage.setItem('user_role', response.user.role);
      await AsyncStorage.setItem('user_name', response.user.name || response.user.email || response.user.phone || identifier);
      console.log('✅ SignIn successful, user data stored');
    }
    
    return { token: response.token, role: response.user.role };
  } catch (error) {
    console.error('❌ SignIn error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
    throw new Error(errorMessage);
  }
};

