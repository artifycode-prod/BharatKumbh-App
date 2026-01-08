/**
 * Medical Service
 * Handles medical case-related API calls
 */

import api from './api';

/**
 * Create a new medical case
 */
export const createCase = async (data) => {
  const response = await api.post('/api/medical/cases', data);
  return response.data.medicalCase;
};

/**
 * Get all medical cases (for medical staff/admin)
 */
export const getAllCases = async () => {
  const response = await api.get('/api/medical/cases');
  return response.data.cases || [];
};

/**
 * Get user's own medical cases
 */
export const getMyCases = async () => {
  const response = await api.get('/api/medical/cases/my-cases');
  return response.data.cases || [];
};

/**
 * Assign a case to medical staff
 */
export const assignCase = async (caseId, staffId) => {
  const response = await api.put(`/api/medical/cases/${caseId}/assign`, {
    assignedTo: staffId,
  });
  return response.data.medicalCase;
};

/**
 * Add a note to a medical case
 */
export const addNote = async (caseId, note) => {
  const response = await api.put(`/api/medical/cases/${caseId}/add-note`, {
    note,
  });
  return response.data.medicalCase;
};

/**
 * Resolve a medical case
 */
export const resolveCase = async (caseId) => {
  const response = await api.put(`/api/medical/cases/${caseId}/resolve`);
  return response.data.medicalCase;
};

