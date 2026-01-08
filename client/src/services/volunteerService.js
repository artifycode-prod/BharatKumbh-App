/**
 * Volunteer Service
 * Handles volunteer-related API calls
 */

import api from './api';

/**
 * Get volunteer dashboard data
 */
export const getVolunteerDashboard = async () => {
  const response = await api.get('/api/volunteer/dashboard');
  return response.data.dashboard;
};

/**
 * Get assigned tasks
 */
export const getAssignedTasks = async () => {
  const response = await api.get('/api/volunteer/assigned-tasks');
  return response.data.tasks;
};

