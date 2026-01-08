/**
 * Location utility for getting user's current position
 * Handles errors gracefully and provides fallback
 */

import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';

/**
 * Request location permissions (Android)
 */
const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bharat Kumbh App needs access to your location for emergency services and navigation.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  }
  // iOS permissions are handled via Info.plist
  return true;
};

/**
 * Get current position with error handling
 */
export const getCurrentPosition = async () => {
  return new Promise(async (resolve) => {
    try {
      // Request permissions first
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        console.warn('Location permission denied, using fallback location');
        resolve({
          latitude: 19.9975, // Nashik coordinates
          longitude: 73.7898,
        });
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to Nashik Kumbh Mela location if geolocation fails
          // This ensures the app still works even if location is unavailable
          resolve({
            latitude: 19.9975, // Nashik coordinates
            longitude: 73.7898,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          showLocationDialog: true,
          forceRequestLocation: true,
        }
      );
    } catch (err) {
      console.error('Geolocation not available:', err);
      // Fallback location
      resolve({
        latitude: 19.9975, // Nashik coordinates
        longitude: 73.7898,
      });
    }
  });
};

