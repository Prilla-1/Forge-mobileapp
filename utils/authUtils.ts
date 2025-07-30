import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  name: string;
  email: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
      } catch {
        errorMessage = `HTTP ${response.status} - ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Validate response data
    if (!data.token || !data.name) {
      throw new Error('Invalid response from server');
    }

    return {
      token: data.token,
      name: data.name,
      email: data.email || credentials.email,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    } else if (error instanceof TypeError && error.message.includes('Network request failed')) {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export const storeAuthData = async (authData: LoginResponse): Promise<void> => {
  await AsyncStorage.setItem('token', authData.token);
  await AsyncStorage.setItem('username', authData.name);
  await AsyncStorage.setItem('email', authData.email);
};

export const clearAuthData = async (): Promise<void> => {
  await AsyncStorage.multiRemove(['token', 'username', 'email']);
};

export const getStoredAuthData = async (): Promise<{ token: string; username: string; email: string } | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const username = await AsyncStorage.getItem('username');
    const email = await AsyncStorage.getItem('email');

    if (token && username && email) {
      return { token, username, email };
    }
    return null;
  } catch (error) {
    console.error('Error getting stored auth data:', error);
    return null;
  }
};