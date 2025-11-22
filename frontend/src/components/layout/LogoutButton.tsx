'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutPlatform } from '@/services/authService';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    // Konfirmasi dulu biar gak kepencet
    if (!confirm('Yakin ingin keluar dari panel admin?')) return;

    setLoading(true);

    // Jalankan logic pembersihan
    await logoutPlatform();

    // Redirect paksa ke halaman Login
    router.push('/platform/login');
    
    // Opsional: Refresh halaman agar state aplikasi benar-benar bersih
    router.refresh(); 
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Keluar...</span>
        </>
      ) : (
        <>
          {/* Icon Logout SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </>
      )}
    </button>
  );
}