import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { clearAuthData, getStoredAuthData } from '../utils/authUtils';

export const useAuth = () => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authData = await getStoredAuthData();

      if (authData) {
        setUser({ username: authData.username, email: authData.email });
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    checkAuthStatus,
  };
};