'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { isAxiosError } from 'axios';
import Link from 'next/link';

interface ProductFormData {
  nama_produk: string;
  kategori_produk_id: string;
  deskripsi_produk: string;
  harga_produk: string;
  berat_produk: string;
  stok_produk: string;
}

interface Kategori {
  id: number;
  nama_kategori: string;
}

export default function CreateProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductFormData>({
    nama_produk: '',
    kategori_produk_id: '',
    deskripsi_produk: '',
    harga_produk: '',
    berat_produk: '',
    stok_produk: '',
  });

  const [fotoProduk, setFotoProduk] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/categories');
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Gagal memuat kategori produk');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Format file harus JPG, JPEG, atau PNG');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2048 * 1024) {
        setError('Ukuran file maksimal 2MB');
        return;
      }

      setFotoProduk(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (
      !formData.nama_produk ||
      !formData.kategori_produk_id ||
      !formData.deskripsi_produk ||
      !formData.harga_produk ||
      !formData.berat_produk ||
      !formData.stok_produk
    ) {
      setError('Semua field wajib diisi kecuali foto produk');
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('nama_produk', formData.nama_produk);
    formDataToSend.append('kategori_produk_id', formData.kategori_produk_id);
    formDataToSend.append('deskripsi_produk', formData.deskripsi_produk);
    formDataToSend.append('harga_produk', formData.harga_produk);
    formDataToSend.append('berat_produk', formData.berat_produk);
    formDataToSend.append('stok_produk', formData.stok_produk);

    if (fotoProduk) {
      formDataToSend.append('foto_produk', fotoProduk);
    }

    try {
      await apiClient.post('/api/seller/products/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Produk berhasil ditambahkan!');

      // Reset form
      setFormData({
        nama_produk: '',
        kategori_produk_id: '',
        deskripsi_produk: '',
        harga_produk: '',
        berat_produk: '',
        stok_produk: '',
      });
      setFotoProduk(null);
      setFotoPreview(null);

      // Redirect to products list
      router.push('/seller/products');
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        let errorMessage = errorData.message || 'Terjadi kesalahan.';
        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).flat().join('\n');
        }
        setError(errorMessage);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan tidak dikenal');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingCategories) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-lg shadow-sm p-6 md:p-8'>
          {/* Header */}
          <div className='mb-6'>
            <div className='flex items-center gap-2 mb-2'>
              <Link
                href='/seller/products'
                className='text-gray-600 hover:text-gray-900'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </Link>
              <h2 className='text-2xl font-bold text-gray-900'>
                Tambah Produk Baru
              </h2>
            </div>
            <p className='text-gray-600'>
              Lengkapi informasi produk yang akan dijual
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-start gap-3'>
                <svg
                  className='w-5 h-5 text-red-600 mt-0.5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='text-sm text-red-800 whitespace-pre-line'>
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
              <div className='flex items-start gap-3'>
                <svg
                  className='w-5 h-5 text-green-600 mt-0.5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='text-sm text-green-800'>{success}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Nama Produk */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Nama Produk <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='nama_produk'
                value={formData.nama_produk}
                onChange={handleInputChange}
                placeholder='Contoh: Laptop ASUS ROG 2024'
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Kategori */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Kategori <span className='text-red-500'>*</span>
              </label>
              <select
                name='kategori_produk_id'
                value={formData.kategori_produk_id}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Deskripsi Produk */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Deskripsi Produk <span className='text-red-500'>*</span>
              </label>
              <textarea
                name='deskripsi_produk'
                value={formData.deskripsi_produk}
                onChange={handleInputChange}
                placeholder='Deskripsikan produk Anda dengan detail...'
                rows={5}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <p className='mt-1 text-xs text-gray-500'>
                Jelaskan spesifikasi, kondisi, dan keunggulan produk
              </p>
            </div>

            {/* Harga & Berat */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Harga (Rp) <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  name='harga_produk'
                  value={formData.harga_produk}
                  onChange={handleInputChange}
                  placeholder='50000'
                  min='0'
                  step='0.01'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Berat (gram) <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  name='berat_produk'
                  value={formData.berat_produk}
                  onChange={handleInputChange}
                  placeholder='1000'
                  min='0'
                  step='0.01'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <p className='mt-1 text-xs text-gray-500'>
                  Untuk perhitungan ongkir
                </p>
              </div>
            </div>

            {/* Stok */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Stok <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                name='stok_produk'
                value={formData.stok_produk}
                onChange={handleInputChange}
                placeholder='10'
                min='0'
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Foto Produk */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Foto Produk
              </label>
              <div className='mt-1'>
                <input
                  type='file'
                  name='foto_produk'
                  onChange={handleFileChange}
                  accept='image/jpeg,image/png,image/jpg'
                  className='block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer'
                />
                <p className='mt-1 text-xs text-gray-500'>
                  Format: JPG, JPEG, PNG. Maksimal 2MB
                </p>
              </div>

              {/* Image Preview */}
              {fotoPreview && (
                <div className='mt-4'>
                  <p className='text-sm font-medium text-gray-700 mb-2'>
                    Preview:
                  </p>
                  <div className='relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fotoPreview}
                      alt='Preview'
                      className='w-full h-full object-contain'
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className='flex gap-3 pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                className='flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors'
              >
                {isLoading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <svg
                      className='animate-spin h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  'Tambah Produk'
                )}
              </Button>

              <Link
                href='/seller/products'
                className='flex-1 text-center bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 font-medium transition-colors'
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
