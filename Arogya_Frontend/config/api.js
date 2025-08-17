import { Platform } from 'react-native';

// API Configuration
const getApiUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://127.0.0.1:8000';
  }
  
  // For physical devices, use your computer's IP address
  // Based on Expo output, your IP is 192.168.1.73
  return 'http://192.168.1.73:8000';
};

export const API_BASE_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login/`,
  SIGNUP: `${API_BASE_URL}/api/signup/`,
  COMPLAINS: `${API_BASE_URL}/api/complains/`,
  HEALTH: `${API_BASE_URL}/api/health/`,
};

export default API_BASE_URL;
