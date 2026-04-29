/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

/**
 * Register a new user (POST /api/auth/register)
 */
export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  
  if (response.data.success && response.data.token) {
    await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    if (response.data.user?.role) {
      await AsyncStorage.setItem('user_role', response.data.user.role);
    }
    if (response.data.user?.name) {
      await AsyncStorage.setItem('user_name', response.data.user.name);
    }
  }
  
  return response.data;
};

/**
 * Login user (by email or user id + password)
 */
export const login = async (data) => {
  try {
    const payload = data.id
      ? { id: data.id, password: data.password }
      : { email: data.email, password: data.password };
    console.log('🔐 Login attempt with:', { email: data.email || data.id, password: '***' });
    const response = await api.post('/auth/login', payload);
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
  const response = await api.get('/auth/me');
  return response.data.user;
};

/**
 * Update user location
 */
export const updateLocation = async (location) => {
  const response = await api.put(
    '/auth/update-location',
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
 * Test if token is valid by calling /auth/me
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
    
    const response = await api.get('/auth/me');
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
 * Get users from /api/users (for quick login - staff roles)
 * Seeded users have password = role (admin, volunteer, medical)
 */
export const getUsersForLogin = async () => {
  try {
    const response = await api.get('/users');
    const users = response?.data?.users || response?.data || [];
    const list = Array.isArray(users) ? users : [];
    return list.filter((u) => u && ['admin', 'volunteer', 'medical'].includes(u.role));
  } catch (err) {
    return [];
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
 * Fetches user details from database via /api/auth/login
 */
export const signIn = async (identifier, password, role) => {
  try {
    const idOrEmail = (identifier || '').trim();
    const normalizedPassword = (password || '').trim();
    const roleMap = { admin: 'admin@kumbh.com', volunteer: 'volunteer@kumbh.com', medical: 'medical@kumbh.com' };

    // Build login payload: id (UUID) or email
    const loginData = idOrEmail.includes('@')
      ? { email: idOrEmail.toLowerCase(), password: normalizedPassword }
      : roleMap[idOrEmail.toLowerCase()]
        ? { email: roleMap[idOrEmail.toLowerCase()], password: normalizedPassword }
        : { id: idOrEmail, password: normalizedPassword };

    console.log('🚀 SignIn called with:', { identifier: idOrEmail, role });
    const response = await login(loginData);
    
    // Store full user from database in AsyncStorage
    if (response.success && response.user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      await AsyncStorage.setItem('user_role', response.user.role);
      await AsyncStorage.setItem('user_name', response.user.name || response.user.email || response.user.phone || identifier);
      console.log('✅ SignIn successful, user from DB stored:', { id: response.user.id, role: response.user.role, name: response.user.name });
    }
    
    return { token: response.token, user: response.user, role: response.user.role };
  } catch (error) {
    console.error('❌ SignIn error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
    throw new Error(errorMessage);
  }
};

