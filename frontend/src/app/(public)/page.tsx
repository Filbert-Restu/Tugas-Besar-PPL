'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import { Product } from '@/types/index'; // Asumsi Anda sudah buat types
import Link from 'next/link';

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get('/products');
        setProducts(res.data.data); // Sesuaikan dengan struktur JSON Laravel
      } catch (error) {
        console.error('Gagal ambil produk', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      Babi
    </div>
  );
}