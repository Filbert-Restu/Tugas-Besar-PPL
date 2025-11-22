'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';

// Tipe Data Seller sesuai database
interface Seller {
  id: number;
  nama_toko: string;
  nama_pic: string;
  email_pic: string;
  no_handphone_pic: string;
  alamat_jalan: string;
  kabupaten_kota: string;
  propinsi: string;
  deskripsi_singkat: string;
  foto_pic_url: string;
  file_ktp_url: string;
  created_at: string;
}

export default function VerificationPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  // 1. Fetch Data Pending
  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    try {
      const res = await apiClient.get('/admin/sellers/pending');
      setSellers(res.data.data);
    } catch (error) {
      console.error('Gagal ambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Logic Approve
  const handleApprove = async (id: number) => {
    if (!confirm('Apakah Anda yakin menerima toko ini? Akun akan langsung aktif.')) return;
    
    setProcessingId(id);
    try {
      await apiClient.post(`/admin/sellers/${id}/verify`, {
        verification_status: 'accepted'
      });
      
      // Hapus dari list (Optimistic UI)
      setSellers((prev) => prev.filter((s) => s.id !== id));
      setSelectedSeller(null); // Tutup modal jika sedang terbuka
      alert('Toko berhasil disetujui');
    } catch {
      alert('Gagal memproses data.');
    } finally {
      setProcessingId(null);
    }
  };

  // 3. Logic Reject (Membuka Form Alasan)
  const openRejectForm = (seller: Seller) => {
    setSelectedSeller(seller);
    setIsRejecting(true);
    setRejectionReason('');
  };

  // 4. Submit Reject ke Backend
  const submitReject = async () => {
    if (!selectedSeller || !rejectionReason) return alert('Alasan penolakan wajib diisi!');
    
    setProcessingId(selectedSeller.id);
    try {
      await apiClient.post(`/admin/sellers/${selectedSeller.id}/verify`, {
        verification_status: 'rejected',
        rejection_reason: rejectionReason
      });

      // Hapus dari list
      setSellers((prev) => prev.filter((s) => s.id !== selectedSeller.id));
      closeModal();
      alert('Toko telah ditolak.');
    } catch {
      alert('Gagal menolak toko.');
    } finally {
      setProcessingId(null);
    }
  };

  // Helper Tutup Modal
  const closeModal = () => {
    setSelectedSeller(null);
    setIsRejecting(false);
  };

  if (loading) return <div className="p-8 text-center">Memuat data verifikasi...</div>;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Verifikasi Toko Baru</h1>
        <p className="text-gray-500">Daftar seller yang menunggu persetujuan platform.</p>
      </header>

      {/* === TABEL LIST SELLER === */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {sellers.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <p>Tidak ada antrian yang butuh verifikasi. Semua toko sudah diverifikasi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Info Toko</th>
                  <th className="px-6 py-4">Pemilik (PIC)</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4">Tanggal Daftar</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{seller.nama_toko}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{seller.deskripsi_singkat}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{seller.nama_pic}</p>
                      <p className="text-gray-500">{seller.email_pic}</p>
                      <p className="text-gray-500 text-xs">{seller.no_handphone_pic}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{seller.kabupaten_kota}</p>
                      <p className="text-xs text-gray-500">{seller.propinsi}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(seller.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => { setSelectedSeller(seller); setIsRejecting(false); }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
                        >
                          Detail
                        </button>
                        <button 
                          onClick={() => handleApprove(seller.id)}
                          disabled={!!processingId}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-medium"
                        >
                          {processingId === seller.id ? '...' : 'Terima'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* === MODAL DETAIL & REJECT === */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-800">
                {isRejecting ? 'Tolak Pendaftaran' : 'Detail Verifikasi'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            {/* Content Modal */}
            <div className="p-6 space-y-6">
              
              {!isRejecting ? (
                /* TAMPILAN DETAIL */
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Kolom Kiri: Data Text */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Nama Toko</label>
                      <p className="text-lg font-semibold">{selectedSeller.nama_toko}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Alamat Lengkap</label>
                      <p className="text-sm">{selectedSeller.alamat_jalan}, {selectedSeller.kabupaten_kota}, {selectedSeller.propinsi}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Kontak PIC</label>
                      <p className="text-sm">{selectedSeller.nama_pic}</p>
                      <p className="text-sm">{selectedSeller.no_handphone_pic}</p>
                    </div>
                  </div>

                  {/* Kolom Kanan: Dokumen */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Foto KTP</label>
                      <div className="border rounded-lg overflow-hidden h-40 bg-gray-100 flex items-center justify-center relative group">
                        {/* Image Fallback logic bisa ditambahkan */}
                        <img src={selectedSeller.file_ktp_url} alt="KTP" className="object-cover w-full h-full" />
                        <a href={selectedSeller.file_ktp_url} target="_blank" className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white text-sm font-bold">
                          Lihat Full
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Foto Diri PIC</label>
                      <div className="border rounded-lg overflow-hidden h-40 bg-gray-100 flex items-center justify-center relative group">
                        <img src={selectedSeller.foto_pic_url} alt="Foto PIC" className="object-cover w-full h-full" />
                        <a href={selectedSeller.foto_pic_url} target="_blank" className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white text-sm font-bold">
                          Lihat Full
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAMPILAN FORM REJECT */
                <div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <p className="text-sm text-red-700 font-bold">Perhatian!</p>
                    <p className="text-sm text-red-600">
                      Toko <strong>{selectedSeller.nama_toko}</strong> akan ditolak permanen.
                      Silakan berikan alasan yang jelas agar seller bisa memperbaiki data saat mendaftar ulang.
                    </p>
                  </div>
                  <textarea
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-32"
                    placeholder="Contoh: Foto KTP buram, Nama Toko mengandung unsur SARA..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  ></textarea>
                </div>
              )}

            </div>

            {/* Footer Action Buttons */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-white border text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>

              {!isRejecting ? (
                <>
                  <button 
                    onClick={() => openRejectForm(selectedSeller)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                  >
                    Tolak
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedSeller.id)}
                    disabled={!!processingId}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium shadow-lg shadow-slate-900/20"
                  >
                    {processingId === selectedSeller.id ? 'Memproses...' : '✅ Terima Toko Ini'}
                  </button>
                </>
              ) : (
                <button 
                  onClick={submitReject}
                  disabled={!!processingId || !rejectionReason}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                >
                  {processingId === selectedSeller.id ? 'Menolak...' : 'Kirim Penolakan'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}