import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import type { IDashboardData } from '@/types/admin/dashboard';

export function useDashboardData() {
  const [data, setData] = useState<IDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          '/api/seller/dashboard/statistics'
        );
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
