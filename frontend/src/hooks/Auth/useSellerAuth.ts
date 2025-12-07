import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiClient from '@/lib/apiClient';

export function useSellerAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userRole = localStorage.getItem('userRole');

        if (!userRole || userRole !== 'penjual') {
          router.replace('/login');
          return;
        }

        // Verify with backend
        const response = await apiClient.get('/api/seller/dashboard');
        if (response.data.data) {
          setIsAuthenticated(true);
        } else {
          localStorage.clear();
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.clear();
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const isActive = (href: string) => {
    if (href === '/seller') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      router.push('/');
    }
  };

  return {
    isActive,
    handleLogout,
    pathname,
    isLoading,
    isAuthenticated,
  };
}
