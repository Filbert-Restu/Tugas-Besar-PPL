'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { isAxiosError } from 'axios';
import { useRegionalData } from '@/hooks/useRegionalData';

export default function RegisterSellerPage() {
  const router = useRouter();

  // Regional Data Hook
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

  const [formData, setFormData] = useState({
    // Data User
    name: '',
    email: '',
    password: '',
    password_confirmation: '',

    // Data Toko
    nama_toko: '',
    deskripsi_singkat: '',
    nomor_telepon: '',

    // Alamat (akan diisi dari regional data)
    nama_provinsi: '',
    nama_kabupaten_kota: '',
    nama_kecamatan: '',
    nama_kelurahan: '',
    RT: '',
    RW: '',
    detail_alamat: '',

    // KTP
    no_ktp: '',
  });

  // Sync regional selection to formData
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

  const [fotoPenjual, setFotoPenjual] = useState<File | null>(null);
  const [fotoKtp, setFotoKtp] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'penjual' | 'ktp'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file (max 2MB)
      if (file.size > 2048 * 1024) {
        setError(
          `File ${type === 'penjual' ? 'foto profil' : 'foto KTP'} maksimal 2MB`
        );
        return;
      }

      // Validasi tipe file
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError(
          `File ${
            type === 'penjual' ? 'foto profil' : 'foto KTP'
          } harus berformat JPG, JPEG, atau PNG`
        );
        return;
      }

      if (type === 'penjual') {
        setFotoPenjual(file);
      } else {
        setFotoKtp(file);
      }
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validasi file
    if (!fotoPenjual || !fotoKtp) {
      setError('Foto profil dan foto KTP wajib diupload');
      setIsLoading(false);
      return;
    }

    // Buat FormData untuk multipart/form-data
    const formDataToSend = new FormData();

    // Append semua data
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append files
    formDataToSend.append('foto_penjual', fotoPenjual);
    formDataToSend.append('foto_ktp', fotoKtp);

    try {
      const { data } = await apiClient.post(
        'api/seller/register',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Tampilkan pesan dari backend atau custom message
      setSuccess(
        data.message ||
          'Registrasi penjual berhasil! Email verifikasi telah dikirim ke ' +
            formData.email +
            '. Silakan verifikasi email dan tunggu persetujuan admin.'
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

      // Reset file inputs
      const fotoPenjualInput = document.getElementById(
        'foto_penjual'
      ) as HTMLInputElement;
      const fotoKtpInput = document.getElementById(
        'foto_ktp'
      ) as HTMLInputElement;
      if (fotoPenjualInput) fotoPenjualInput.value = '';
      if (fotoKtpInput) fotoKtpInput.value = '';
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
    <main className='max-w-[600px] mx-auto mt-12 mb-12 p-8 border border-gray-300 rounded-lg font-sans'>
      <h2 className='text-2xl font-bold mb-6 text-center'>
        Registrasi Penjual
      </h2>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Section: Data Akun */}
        <div className='border-b pb-4'>
          <h3 className='text-lg font-bold mb-3 text-gray-700'>Data Akun</h3>

          <div className='flex flex-col mb-3'>
            <label htmlFor='name' className='mb-1 font-bold'>
              Nama Lengkap <span className='text-red-500'>*</span>
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
              Email <span className='text-red-500'>*</span>
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
              Password <span className='text-red-500'>*</span>
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='password_confirmation' className='mb-1 font-bold'>
              Konfirmasi Password <span className='text-red-500'>*</span>
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

        {/* Section: Data Toko */}
        <div className='border-b pb-4'>
          <h3 className='text-lg font-bold mb-3 text-gray-700'>Data Toko</h3>

          <div className='flex flex-col mb-3'>
            <label htmlFor='nama_toko' className='mb-1 font-bold'>
              Nama Toko <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='nama_toko'
              name='nama_toko'
              value={formData.nama_toko}
              onChange={handleInputChange}
              required
              maxLength={100}
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col mb-3'>
            <label htmlFor='deskripsi_singkat' className='mb-1 font-bold'>
              Deskripsi Toko
            </label>
            <textarea
              id='deskripsi_singkat'
              name='deskripsi_singkat'
              value={formData.deskripsi_singkat}
              onChange={handleInputChange}
              maxLength={500}
              rows={3}
              className='p-2 text-base rounded-md border border-gray-300'
              placeholder='Jelaskan singkat tentang toko Anda'
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='nomor_telepon' className='mb-1 font-bold'>
              Nomor Telepon <span className='text-red-500'>*</span>
            </label>
            <input
              type='tel'
              id='nomor_telepon'
              name='nomor_telepon'
              value={formData.nomor_telepon}
              onChange={handleInputChange}
              required
              maxLength={20}
              placeholder='08123456789'
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>
        </div>

        {/* Section: Alamat */}
        <div className='border-b pb-4'>
          <h3 className='text-lg font-bold mb-3 text-gray-700'>
            Alamat Lengkap
          </h3>

          <div className='grid grid-cols-2 gap-3 mb-3'>
            <div className='flex flex-col'>
              <label htmlFor='provinsi' className='mb-1 font-bold'>
                Provinsi <span className='text-red-500'>*</span>
              </label>
              <select
                id='provinsi'
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                required
                className='p-2 text-base rounded-md border border-gray-300 bg-white'
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
              <label htmlFor='kabupaten_kota' className='mb-1 font-bold'>
                Kabupaten/Kota <span className='text-red-500'>*</span>
              </label>
              <select
                id='kabupaten_kota'
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                required
                disabled={!selectedProvince}
                className='p-2 text-base rounded-md border border-gray-300 bg-white disabled:bg-gray-100'
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
              <label htmlFor='kecamatan' className='mb-1 font-bold'>
                Kecamatan <span className='text-red-500'>*</span>
              </label>
              <select
                id='kecamatan'
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                required
                disabled={!selectedCity}
                className='p-2 text-base rounded-md border border-gray-300 bg-white disabled:bg-gray-100'
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
              <label htmlFor='kelurahan' className='mb-1 font-bold'>
                Kelurahan <span className='text-red-500'>*</span>
              </label>
              <select
                id='kelurahan'
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                required
                disabled={!selectedDistrict}
                className='p-2 text-base rounded-md border border-gray-300 bg-white disabled:bg-gray-100'
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
                RT <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='RT'
                name='RT'
                value={formData.RT}
                onChange={handleInputChange}
                required
                maxLength={3}
                placeholder='001'
                className='p-2 text-base rounded-md border border-gray-300'
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='RW' className='mb-1 font-bold'>
                RW <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='RW'
                name='RW'
                value={formData.RW}
                onChange={handleInputChange}
                required
                maxLength={3}
                placeholder='002'
                className='p-2 text-base rounded-md border border-gray-300'
              />
            </div>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='detail_alamat' className='mb-1 font-bold'>
              Detail Alamat <span className='text-red-500'>*</span>
            </label>
            <textarea
              id='detail_alamat'
              name='detail_alamat'
              value={formData.detail_alamat}
              onChange={handleInputChange}
              required
              rows={2}
              placeholder='Jl. Merdeka No. 123, Blok A'
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>
        </div>

        {/* Section: Verifikasi KTP */}
        <div className='pb-4'>
          <h3 className='text-lg font-bold mb-3 text-gray-700'>
            Verifikasi Identitas
          </h3>

          <div className='flex flex-col mb-3'>
            <label htmlFor='no_ktp' className='mb-1 font-bold'>
              Nomor KTP <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='no_ktp'
              name='no_ktp'
              value={formData.no_ktp}
              onChange={handleInputChange}
              required
              maxLength={16}
              placeholder='3273010101990001'
              className='p-2 text-base rounded-md border border-gray-300'
            />
          </div>

          <div className='flex flex-col mb-3'>
            <label htmlFor='foto_penjual' className='mb-1 font-bold'>
              Foto Profil Toko <span className='text-red-500'>*</span>
            </label>
            <input
              type='file'
              id='foto_penjual'
              accept='image/jpeg,image/jpg,image/png'
              onChange={(e) => handleFileChange(e, 'penjual')}
              required
              className='p-2 text-base rounded-md border border-gray-300'
            />
            <span className='text-xs text-gray-500 mt-1'>
              Format: JPG, JPEG, PNG (Max 2MB)
            </span>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='foto_ktp' className='mb-1 font-bold'>
              Foto KTP <span className='text-red-500'>*</span>
            </label>
            <input
              type='file'
              id='foto_ktp'
              accept='image/jpeg,image/jpg,image/png'
              onChange={(e) => handleFileChange(e, 'ktp')}
              required
              className='p-2 text-base rounded-md border border-gray-300'
            />
            <span className='text-xs text-gray-500 mt-1'>
              Format: JPG, JPEG, PNG (Max 2MB)
            </span>
          </div>
        </div>

        <button
          type='submit'
          className='px-4 py-3 mt-2 text-base bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition-colors font-bold'
          disabled={isLoading}
        >
          {isLoading ? 'Memproses Registrasi...' : 'Daftar Sebagai Penjual'}
        </button>
      </form>

      {error && (
        <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-md'>
          <pre className='text-red-600 whitespace-pre-wrap text-sm'>
            {error}
          </pre>
        </div>
      )}

      {success && (
        <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-md'>
          <p className='text-green-600 text-sm'>{success}</p>
        </div>
      )}

      <p className='mt-4 text-center text-gray-600'>
        Sudah punya akun penjual?{' '}
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
