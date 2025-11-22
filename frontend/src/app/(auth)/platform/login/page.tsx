'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginPlatform } from '@/services/authService';

export default function AdminLoginPage() {
  const router = useRouter();

  // 1. State untuk menampung input user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. State untuk UI Feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 3. Logic Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman
    setError('');       // Reset error lama
    setLoading(true);   // Aktifkan status loading

    try {
      // Panggil API Login Platform
      await loginPlatform({ email, password });

      // Jika sukses (tidak error), redirect ke Dashboard Platform
      router.push('/platform'); 
      
    } catch (err: unknown) {
      console.error("Login Error:", err);
      // Ambil pesan error dari backend jika ada, atau pakai default
      let message = 'Login gagal. Periksa email dan password.';
      interface ErrorResponse {
        response?: {
          data?: {
            message?: string;
          };
        };
      }

      const errorObj = err as ErrorResponse;

      if (
        typeof err === 'object' &&
        err !== null &&
        errorObj.response &&
        typeof errorObj.response === 'object' &&
        errorObj.response.data &&
        typeof errorObj.response.data === 'object' &&
        errorObj.response.data.message
      ) {
        message = errorObj.response.data.message as string;
      }
      setError(message);
    } finally {
      setLoading(false); // Matikan status loading (baik sukses maupun gagal)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-slate-900">
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Platform Admin
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Silakan masuk untuk mengelola marketplace
          </p>

          {/* Tampilkan Pesan Error Jika Ada */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Administrator
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@marketplace.com"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-800 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
              />
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded text-white font-semibold transition duration-200
                ${loading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Masuk ke Platform'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}