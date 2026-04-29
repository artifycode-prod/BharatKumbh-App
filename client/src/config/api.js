/**
 * Centralized API - Single source for all API calls
 *
 * Production: https://kumbh-app.vercel.app/api
 * Local: http://localhost:5000/api (set USE_LOCAL_SERVER = true)
 *
 * All services (auth, SOS, medical, lost-found, QR, admin, volunteer) use this file.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';

// ─── API URL Configuration ───────────────────────────────────────────────
// Production API: https://kumbh-app.vercel.app/api
const USE_LOCAL_SERVER = false;
const PRODUCTION_API = 'https://kumbh-app.vercel.app';
const ANDROID_HOST_IP = '192.168.1.6';

const getBaseURL = () => {
  if (!USE_LOCAL_SERVER) return PRODUCTION_API;
  if (Platform.OS === 'android') return `http://${ANDROID_HOST_IP}:5000`;
  return 'http://localhost:5000';
};

const BASE_URL = getBaseURL();
const API_BASE = `${BASE_URL}/api`;
const SERVER_ROOT = BASE_URL;

export const API_CONFIG = {
  BASE_URL: API_BASE,
  SERVER_ROOT,
  TIMEOUT: 30000,
};

// ─── Axios Instance (used by all services) ────────────────────────────────
// baseURL = http://localhost:5000/api so /users/login -> http://localhost:5000/api/users/login
const api = axios.create({
  baseURL: API_BASE,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem('user_role');
      await AsyncStorage.removeItem('user_name');
    }
    const errorMessage = error.response?.data?.message || error.message || 'Network error occurred';
    if (!error.response && error.request) {
      return Promise.reject({
        message: `Cannot connect to server at ${API_CONFIG.BASE_URL}. Check: 1) Backend running (cd server && npm run dev) 2) API URL 3) Network`,
        status: 0,
        request: error.request,
        response: null,
      });
    }
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!doctype html>')) {
      return Promise.reject({
        message: 'Deployment protection enabled. Disable in Vercel settings.',
        status: error.response?.status,
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
export { api };
