'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { isAxiosError } from 'axios';
import { useRegionalData } from '@/hooks/useRegionalData';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  nama_toko: string;
  deskripsi_singkat: string;
  nomor_telepon: string;
  nama_provinsi: string;
  nama_kabupaten_kota: string;
  nama_kecamatan: string;
  nama_kelurahan: string;
  RT: string;
  RW: string;
  detail_alamat: string;
  no_ktp: string;
}

export default function RegisterPage() {
  const router = useRouter();

  // Regional data hook for dropdowns
  const {
    provinces,
    cities,
    districts,
    villages,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedVillage,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    setSelectedVillage,
  } = useRegionalData();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    nama_toko: '',
    deskripsi_singkat: '',
    nomor_telepon: '',
    nama_provinsi: '',
    nama_kabupaten_kota: '',
    nama_kecamatan: '',
    nama_kelurahan: '',
    RT: '',
    RW: '',
    detail_alamat: '',
    no_ktp: '',
  });
  const [fotoPenjual, setFotoPenjual] = useState<File | null>(null);
  const [fotoKtp, setFotoKtp] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update form data when region selections change
  useEffect(() => {
    const selectedProvinceName =
      provinces.find((p) => p.id === selectedProvince)?.name || '';
    const selectedCityName =
      cities.find((c) => c.id === selectedCity)?.name || '';
    const selectedDistrictName =
      districts.find((d) => d.id === selectedDistrict)?.name || '';
    const selectedVillageName =
      villages.find((v) => v.id === selectedVillage)?.name || '';

    setFormData((prev) => ({
      ...prev,
      nama_provinsi: selectedProvinceName,
      nama_kabupaten_kota: selectedCityName,
      nama_kecamatan: selectedDistrictName,
      nama_kelurahan: selectedVillageName,
    }));
  }, [
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedVillage,
    provinces,
    cities,
    districts,
    villages,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'foto_penjual') {
        setFotoPenjual(files[0]);
      } else if (name === 'foto_ktp') {
        setFotoKtp(files[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formDataToSend = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append files if exists
    if (fotoPenjual) {
      formDataToSend.append('foto_penjual', fotoPenjual);
    }
    if (fotoKtp) {
      formDataToSend.append('foto_ktp', fotoKtp);
    }

    try {
      await apiClient.post('/api/seller/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(
        'Registrasi berhasil! Kami telah mengirimkan link verifikasi ke email Anda. Silakan cek inbox (atau folder spam) dan klik link verifikasi, kemudian tunggu persetujuan admin.'
      );

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nama_toko: '',
        deskripsi_singkat: '',
        nomor_telepon: '',
        nama_provinsi: '',
        nama_kabupaten_kota: '',
        nama_kecamatan: '',
        nama_kelurahan: '',
        RT: '',
        RW: '',
        detail_alamat: '',
        no_ktp: '',
      });
      setFotoPenjual(null);
      setFotoKtp(null);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
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

  return (
    <main className='max-w-[600px] mx-auto mt-12 p-8 border border-gray-300 rounded-lg font-sans'>
      <h2 className='text-2xl font-bold mb-6 text-center'>
        Daftar Sebagai Penjual
      </h2>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Data Akun */}
        <div className='border-b pb-4'>
          <h3 className='font-bold text-lg mb-3'>Data Akun</h3>

          <div className='flex flex-col mb-3'>
            <label htmlFor='name' className='mb-1 font-bold'>
              Nama Lengkap *
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col mb-3'>
            <label htmlFor='email' className='mb-1 font-bold'>
              Email *
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col mb-3'>
            <label htmlFor='password' className='mb-1 font-bold'>
              Password *
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              required
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='password_confirmation' className='mb-1 font-bold'>
              Konfirmasi Password *
            </label>
            <input
              type='password'
              id='password_confirmation'
              name='password_confirmation'
              value={formData.password_confirmation}
              onChange={handleInputChange}
              required
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>
        </div>

        {/* Data Toko */}
        <div className='border-b pb-4'>
          <h3 className='font-bold text-lg mb-3'>Data Toko</h3>

          <div className='flex flex-col mb-3'>
            <label htmlFor='nama_toko' className='mb-1 font-bold'>
              Nama Toko *
            </label>
            <input
              type='text'
              id='nama_toko'
              name='nama_toko'
              value={formData.nama_toko}
              onChange={handleInputChange}
              required
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col mb-3'>
            <label htmlFor='deskripsi_singkat' className='mb-1 font-bold'>
              Deskripsi Singkat
            </label>
            <textarea
              id='deskripsi_singkat'
              name='deskripsi_singkat'
              value={formData.deskripsi_singkat}
              onChange={handleInputChange}
              rows={3}
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='nomor_telepon' className='mb-1 font-bold'>
              Nomor Telepon *
            </label>
            <input
              type='tel'
              id='nomor_telepon'
              name='nomor_telepon'
              value={formData.nomor_telepon}
              onChange={handleInputChange}
              required
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>
        </div>

        {/* Data Alamat */}
        <div className='border-b pb-4'>
          <h3 className='font-bold text-lg mb-3'>Alamat Toko</h3>

          <div className='grid grid-cols-2 gap-3 mb-3'>
            <div className='flex flex-col'>
              <label htmlFor='nama_provinsi' className='mb-1 font-bold'>
                Provinsi *
              </label>
              <select
                id='nama_provinsi'
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                required
                className='p-2 text-base rounded-md border border-gray-300'
              >
                <option value=''>Pilih Provinsi</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='nama_kabupaten_kota' className='mb-1 font-bold'>
                Kabupaten/Kota *
              </label>
              <select
                id='nama_kabupaten_kota'
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                disabled={!selectedProvince}
                required
                className='p-2 text-base rounded-md border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed'
              >
                <option value=''>Pilih Kabupaten/Kota</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 mb-3'>
            <div className='flex flex-col'>
              <label htmlFor='nama_kecamatan' className='mb-1 font-bold'>
                Kecamatan *
              </label>
              <select
                id='nama_kecamatan'
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!selectedCity}
                required
                className='p-2 text-base rounded-md border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed'
              >
                <option value=''>Pilih Kecamatan</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='nama_kelurahan' className='mb-1 font-bold'>
                Kelurahan *
              </label>
              <select
                id='nama_kelurahan'
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                disabled={!selectedDistrict}
                required
                className='p-2 text-base rounded-md border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed'
              >
                <option value=''>Pilih Kelurahan</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 mb-3'>
            <div className='flex flex-col'>
              <label htmlFor='RT' className='mb-1 font-bold'>
                RT *
              </label>
              <input
                type='text'
                id='RT'
                name='RT'
                value={formData.RT}
                onChange={handleInputChange}
                required
                maxLength={3}
                className='p-2 text-base rounded-md border border-gray-300'
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='RW' className='mb-1 font-bold'>
                RW *
              </label>
              <input
                type='text'
                id='RW'
                name='RW'
                value={formData.RW}
                onChange={handleInputChange}
                required
                maxLength={3}
                className='p-2 text-base rounded-md border border-gray-300'
              />
            </div>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='detail_alamat' className='mb-1 font-bold'>
              Detail Alamat *
            </label>
            <textarea
              id='detail_alamat'
              name='detail_alamat'
              value={formData.detail_alamat}
              onChange={handleInputChange}
              required
              rows={3}
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>
        </div>

        {/* Data Verifikasi */}
        <div className='pb-4'>
          <h3 className='font-bold text-lg mb-3'>Data Verifikasi</h3>

          <div className='flex flex-col mb-3'>
            <label htmlFor='no_ktp' className='mb-1 font-bold'>
              Nomor KTP *
            </label>
            <input
              type='text'
              id='no_ktp'
              name='no_ktp'
              value={formData.no_ktp}
              onChange={handleInputChange}
              required
              maxLength={16}
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col mb-3'>
            <label htmlFor='foto_penjual' className='mb-1 font-bold'>
              Foto Penjual
            </label>
            <input
              type='file'
              id='foto_penjual'
              name='foto_penjual'
              onChange={handleFileChange}
              accept='image/jpeg,image/png,image/jpg'
              className='p-2 text-base rounded-md border border-gray-300'
            />
            <span className='text-sm text-gray-500'>Max 2MB (JPG, PNG)</span>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='foto_ktp' className='mb-1 font-bold'>
              Foto KTP
            </label>
            <input
              type='file'
              id='foto_ktp'
              name='foto_ktp'
              onChange={handleFileChange}
              accept='image/jpeg,image/png,image/jpg'
              className='p-2 text-base rounded-md border border-gray-300'
            />
            <span className='text-sm text-gray-500'>Max 2MB (JPG, PNG)</span>
          </div>
        </div>

        <button
          type='submit'
          className='px-4 py-2 mt-2 text-base bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition-colors'
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : 'Daftar Sebagai Penjual'}
        </button>
      </form>

      {error && (
        <pre className='mt-4 text-red-600 whitespace-pre-wrap'>{error}</pre>
      )}
      {success && <p className='mt-4 text-green-600'>{success}</p>}

      <p className='mt-4 text-center text-gray-600'>
        Sudah punya akun?{' '}
        <Link href='/login' className='text-blue-600 hover:underline'>
          Login di sini
        </Link>
      </p>

      <Button variant='secondary' className='mt-4 w-full'>
        <Link href='/'>Kembali ke Beranda</Link>
      </Button>
    </main>
  );
}
