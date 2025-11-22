'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUniversal } from '@/services/authService';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PANGGIL FUNGSI UNIVERSAL
      const response = await loginUniversal(formData);
      
      alert('Login Berhasil!');

      // LOGIKA REDIRECT (Tetap aman karena backend kirim "role")
      const role = response.user?.role; 

      if (role === 'platform' || role === 'admin') {
        // Paksa refresh atau redirect agar cookie terbaca middleware
        window.location.href = '/platform/panel';
      } else if (role === 'seller') {
        window.location.href = '/seller/panel';
      } else {
        window.location.href = '/';
      }

    } catch (error: unknown) {
      // Error handling yang sama persis dengan RegisterForm Anda
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        alert((error as { response: { data: { message: string } } }).response.data.message);
      } else {
        alert('Email atau Password salah.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700" htmlFor="email">Email</label>
        <input 
          id="email"
          name="email" 
          type="email" 
          placeholder="nama@email.com" 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-700" htmlFor="password">Password</label>
          <a href="#" className="text-xs text-blue-600 hover:underline">Lupa password?</a>
        </div>
        <input 
          id="password"
          name="password" 
          type="password" 
          placeholder="••••••••" 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>

      <button 
        disabled={loading} 
        type="submit" 
        className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Memproses...' : 'Masuk'}
      </button>

      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Ingin berjualan?{' '}
          <Link href="/seller/register" className="text-blue-600 font-semibold hover:underline">
            Daftar Jadi Penjual
          </Link>
        </p>
      </div>
    </form>
  );
}