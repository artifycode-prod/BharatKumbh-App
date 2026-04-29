/**
 * Lost & Found Service
 * Handles lost and found item-related API calls
 */

import api from './api';

/**
 * Report a lost or found item
 */
export const reportItem = async (data) => {
  try {
    console.log('📤 Reporting item:', { type: data.type, itemName: data.itemName });
    const response = await api.post('/lost-found', data);
    console.log('✅ Report response:', response.data);
    
    // Handle different response formats
    if (response.data.success && response.data.lostFound) {
      return response.data.lostFound;
    } else if (response.data.success && response.data.item) {
      return response.data.item;
    } else if (response.data.lostFound) {
      return response.data.lostFound;
    } else if (response.data.item) {
      return response.data.item;
    }
    return response.data;
  } catch (error) {
    console.error('❌ Report item error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Get all lost/found items
 */
export const getAllItems = async () => {
  try {
    console.log('📤 Fetching all items');
    const response = await api.get('/lost-found');
    console.log('✅ Get items response:', response.data);
    
    // Handle different response formats
    if (response.data.success && response.data.items) {
      return response.data.items;
    } else if (response.data.items) {
      return response.data.items;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('❌ Get all items error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Get user's own reports
 */
export const getMyReports = async () => {
  try {
    console.log('📤 Fetching my reports');
    const response = await api.get('/lost-found/my-reports');
    console.log('✅ Get my reports response:', response.data);
    
    // Handle different response formats
    if (response.data.success && response.data.items) {
      return response.data.items;
    } else if (response.data.items) {
      return response.data.items;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('❌ Get my reports error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

/**
 * Match a lost item with a found item
 */
export const matchItems = async (lostId, foundId) => {
  try {
    console.log('📤 Matching items:', { lostId, foundId });
    const response = await api.put(`/lost-found/${lostId}/match`, {
      matchedWithId: foundId,
    });
    console.log('✅ Match response:', response.data);
    
    // Handle different response formats
    if (response.data.success && response.data.item) {
      return response.data.item;
    } else if (response.data.item) {
      return response.data.item;
    }
    return response.data;
  } catch (error) {
    console.error('❌ Match items error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

