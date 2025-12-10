import { useState, useEffect } from 'react';
import {
  adminDashboardService,
  AdminDashboardStats,
} from '@/services/adminDashboardService';

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminDashboardService.getStatistics();
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching admin dashboard data:', err);

        // Better error handling
        if (err.response) {
          // Server responded with error
          const status = err.response.status;
          const message = err.response.data?.message || err.response.statusText;

          if (status === 401) {
            setError('Anda belum login atau sesi telah berakhir');
          } else if (status === 403) {
            setError('Akses ditolak. Anda bukan admin.');
          } else if (status === 500) {
            setError(`Server error: ${message}`);
          } else {
            setError(`Error ${status}: ${message}`);
          }
        } else if (err.request) {
          // Request made but no response
          setError(
            'Tidak dapat terhubung ke server. Pastikan backend berjalan.'
          );
        } else {
          // Something else happened
          setError('Gagal memuat data dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
