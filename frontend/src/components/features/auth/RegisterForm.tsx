'use client';

import { useState } from 'react';
import { registerSeller } from '@/services/authService';
import { useRouter } from 'next/navigation';
// Import Ikon dari Lucide React untuk mempercantik UI
import { UploadCloud, User, Store, MapPin, FileText, Loader2 } from 'lucide-react'; 

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State untuk input teks
  const [formData, setFormData] = useState({
    nama_toko: '',
    nama_pic: '',
    no_handphone_pic: '',
    email_pic: '',
    password: '',
    alamat_jalan: '',
    kabupaten_kota: '',
    propinsi: '',
    no_ktp_pic: '',
  });

  // State untuk file
  const [fileKtp, setFileKtp] = useState<File | null>(null);
  const [fotoPic, setFotoPic] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (fileKtp) data.append('file_ktp', fileKtp);
    if (fotoPic) data.append('foto_pic', fotoPic);

    try {
      await registerSeller(data);
      alert('Registrasi Berhasil! Silakan cek email Anda untuk verifikasi.');
      router.push('/seller/login');
    } catch (error: unknown) {
      type ApiError = {
        response?: {
          data?: {
            message?: string;
          };
        };
      };
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error as ApiError).response?.data?.message
      ) {
        alert((error as ApiError).response!.data!.message!);
      } else {
        alert('Gagal Mendaftar. Periksa koneksi atau input Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
      
      {/* --- SECTION 1: AKUN TOKO --- */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Store size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Informasi Toko & Akun</h3>
            <p className="text-sm text-gray-500">Data ini digunakan untuk login dan profil toko.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nama Toko</label>
            <input 
              name="nama_toko" 
              type="text"
              placeholder="Contoh: Toko Berkah Jaya" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email Login</label>
            <input 
              name="email_pic" 
              type="email" 
              placeholder="email@toko.com" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">No. Handphone PIC</label>
            <input 
              name="no_handphone_pic" 
              type="tel" 
              placeholder="0812xxxx" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Nama Lengkap PIC</label>
            <input 
              name="nama_pic" 
              type="text" 
              placeholder="Nama sesuai KTP" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400" 
            />
          </div>
        </div>
      </div>

      {/* --- SECTION 2: ALAMAT --- */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Alamat & Identitas</h3>
            <p className="text-sm text-gray-500">Lokasi operasional toko Anda.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Alamat Lengkap (Jalan/RT/RW)</label>
            <input 
              name="alamat_jalan" 
              type="text"
              placeholder="Jl. Jendral Sudirman No. 10..." 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Kabupaten / Kota</label>
            <input 
              name="kabupaten_kota" 
              placeholder="Contoh: Semarang" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Propinsi</label>
            <input 
              name="propinsi" 
              placeholder="Contoh: Jawa Tengah" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400" 
            />
          </div>
        </div>
      </div>

      {/* --- SECTION 3: DOKUMEN --- */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Validasi Dokumen</h3>
            <p className="text-sm text-gray-500">Upload dokumen legalitas untuk verifikasi.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nomor Induk Kependudukan (NIK)</label>
            <input 
              name="no_ktp_pic" 
              type="text" 
              placeholder="16 digit nomor KTP" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom File Input: SCAN KTP */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Upload Scan KTP</label>
              <div className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${fileKtp ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={(e) => setFileKtp(e.target.files?.[0] || null)} 
                  required 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <UploadCloud className={`w-8 h-8 mb-2 ${fileKtp ? 'text-blue-600' : 'text-gray-400'}`} />
                  {fileKtp ? (
                    <p className="text-sm font-medium text-blue-600 truncate max-w-[200px] px-2">{fileKtp.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500"><span className="font-semibold">Klik untuk upload</span></p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 2MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Custom File Input: FOTO DIRI */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Upload Foto Diri (PIC)</label>
              <div className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${fotoPic ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFotoPic(e.target.files?.[0] || null)} 
                  required 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <User className={`w-8 h-8 mb-2 ${fotoPic ? 'text-blue-600' : 'text-gray-400'}`} />
                  {fotoPic ? (
                    <p className="text-sm font-medium text-blue-600 truncate max-w-[200px] px-2">{fotoPic.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500"><span className="font-semibold">Klik untuk upload</span></p>
                      <p className="text-xs text-gray-400">JPG, PNG (Max 2MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SUBMIT BUTTON --- */}
      <div className="pt-6 border-t border-gray-100">
        <button 
          disabled={loading} 
          type="submit" 
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Sedang Mengirim Data...
            </>
          ) : (
            'Daftar Sekarang'
          )}
        </button>
        <p className="text-center text-sm text-gray-400 mt-4">
          Dengan mendaftar, Anda menyetujui Syarat & Ketentuan kami.
        </p>
      </div>
    </form>
  );
}