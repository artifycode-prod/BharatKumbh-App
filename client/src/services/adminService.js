/**
 * Admin Service
 * Handles admin-related API calls
 */

import api from './api';

/**
 * Get admin dashboard statistics
 */
export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data.dashboard;
};

/**
 * Get all users
 */
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data.users;
};

/**
 * Activate a user
 */
export const activateUser = async (userId) => {
  const response = await api.put(
    `/admin/users/${userId}/activate`
  );
  return response.data.user;
};

/**
 * Deactivate a user
 */
export const deactivateUser = async (userId) => {
  const response = await api.put(
    `/admin/users/${userId}/deactivate`
  );
  return response.data.user;
};

