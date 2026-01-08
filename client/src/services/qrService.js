/**
 * QR Registration Service
 * Handles QR code registration and crowd analytics
 */

import api from './api';

/**
 * Register group via QR code scan
 */
export const registerQR = async (data) => {
  try {
    console.log('📤 Registering QR:', { 
      qrCodeId: data.qrCodeId, 
      entryPoint: data.entryPoint,
      groupSize: data.groupSize 
    });
    
    const response = await api.post('/api/qr/register', data);
    console.log('✅ QR registration response:', response.data);
    
    // Handle different response formats
    if (response.data.success && response.data.registration) {
      return response.data.registration;
    } else if (response.data.registration) {
      return response.data.registration;
    }
    return response.data;
  } catch (error) {
    console.error('❌ QR registration error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Get crowd status for a specific destination
 */
export const getCrowdStatus = async (destination) => {
  try {
    console.log('📤 Getting crowd status for:', destination);
    const response = await api.get(`/api/qr/destinations/${destination}/crowd-status`);
    console.log('✅ Crowd status response:', response.data);
    
    return {
      destination: response.data.destination,
      crowdLevel: response.data.crowdLevel,
      estimatedPeople: response.data.estimatedPeople,
      groupsInLastHour: response.data.groupsInLastHour,
      timestamp: response.data.timestamp
    };
  } catch (error) {
    console.error('❌ Get crowd status error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Get all QR registrations (Admin only)
 */
export const getAllRegistrations = async (page = 1, limit = 20) => {
  try {
    console.log('📤 Getting registrations:', { page, limit });
    const response = await api.get('/api/qr/registrations', {
      params: { page, limit }
    });
    console.log('✅ Get registrations response:', response.data);
    
    return {
      registrations: response.data.registrations || [],
      pagination: response.data.pagination || {}
    };
  } catch (error) {
    console.error('❌ Get registrations error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

