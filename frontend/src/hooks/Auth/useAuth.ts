import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      // Try to get user data from localStorage first
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.error('Authentication check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear all auth data from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userRole');

      // Update state immediately
      setIsAuthenticated(false);
      setUser(null);

      // Redirect to home
      router.push('/');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    logout,
    checkAuth,
  };
}
