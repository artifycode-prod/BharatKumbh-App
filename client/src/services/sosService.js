/**
 * SOS Service
 * Handles SOS alert-related API calls
 */

import api from './api';

/**
 * Create a new SOS alert
 */
export const createSOS = async (data) => {
  const response = await api.post('/api/sos', data);
  return response.data.sos;
};

/**
 * Get all SOS alerts (for volunteers/admin/medical)
 */
export const getAllSOS = async (filters) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  
  const queryString = params.toString();
  const url = `/api/sos${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);
  return response.data.sosAlerts;
};

/**
 * Get user's own SOS alerts
 */
export const getMySOS = async () => {
  const response = await api.get('/api/sos/my-sos');
  return response.data.sosAlerts;
};

/**
 * Acknowledge an SOS alert
 */
export const acknowledgeSOS = async (sosId) => {
  const response = await api.put(`/api/sos/${sosId}/acknowledge`);
  return response.data.sos;
};

/**
 * Resolve an SOS alert
 */
export const resolveSOS = async (sosId) => {
  const response = await api.put(`/api/sos/${sosId}/resolve`);
  return response.data.sos;
};

