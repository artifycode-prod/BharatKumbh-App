/**
 * Socket.IO Service
 * Handles real-time communication with the backend
 */

import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/api';

let socket = null;

/**
 * Initialize Socket.IO connection
 */
export const initSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(API_CONFIG.BASE_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    auth: token ? { token } : undefined,
  });

  socket.on('connect', () => {
    console.log('Socket.IO connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket.IO disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });

  return socket;
};

/**
 * Get the current socket instance
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect Socket.IO
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Listen for SOS alerts
 */
export const onSOSAlert = (callback) => {
  if (socket) {
    socket.on('sos-alert', callback);
  }
};

/**
 * Remove SOS alert listener
 */
export const offSOSAlert = (callback) => {
  if (socket) {
    socket.off('sos-alert', callback);
  }
};

/**
 * Listen for emergency notifications
 */
export const onEmergencyNotification = (callback) => {
  if (socket) {
    socket.on('emergency-notification', callback);
  }
};

/**
 * Remove emergency notification listener
 */
export const offEmergencyNotification = (callback) => {
  if (socket) {
    socket.off('emergency-notification', callback);
  }
};

/**
 * Emit SOS alert
 */
export const emitSOSAlert = (data) => {
  if (socket) {
    socket.emit('sos-alert', data);
  }
};

/**
 * Emit emergency notification
 */
export const emitEmergencyNotification = (data) => {
  if (socket) {
    socket.emit('emergency-notification', data);
  }
};

