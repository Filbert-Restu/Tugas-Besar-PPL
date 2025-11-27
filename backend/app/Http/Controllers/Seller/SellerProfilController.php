<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seller;
use App\Services\WilayahService;
use Illuminate\Support\Facades\Storage;

class SellerProfilController extends Controller
{
    protected WilayahService $wilayahService;
    public function __construct(WilayahService $wilayahService)
    {
        $this->wilayahService = $wilayahService;
    }
    /**
     * Get profile penjual yang sedang login
     */
     public function profile(Request $request)
    {
        $user = $request->user();

        // Gunakan Eloquent dengan eager loading
        $seller = Seller::with(['kelurahan.kecamatan.kabupatenKota.provinsi'])
            ->where('user_id', $user->id)
            ->first();

        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }

        $kelurahan = $seller->kelurahan;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'penjual' => [
                'nama_toko' => $seller->nama_toko,
                'deskripsi_singkat' => $seller->deskripsi_singkat,
                'nomor_telepon' => $seller->nomor_telepon,
                'alamat_lengkap' => $seller->full_address,
                'provinsi' => $kelurahan?->kecamatan?->kabupatenKota?->provinsi?->nama_provinsi,
                'kabupaten_kota' => $kelurahan?->kecamatan?->kabupatenKota?->nama_kabupaten_kota,
                'kecamatan' => $kelurahan?->kecamatan?->nama_kecamatan,
                'kelurahan' => $kelurahan?->nama_kelurahan,
                'RT' => $seller->RT,
                'RW' => $seller->RW,
                'no_ktp' => $seller->no_ktp,
                'foto_penjual' => $seller->foto_penjual_url,
                'foto_ktp' => $seller->foto_ktp_url,
                'role' => $seller->user->role,
                'status' => $seller->status,
            ]
        ]);
    }

    /**
     * Update profile penjual (hanya data yang diizinkan)
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nama_toko' => ['sometimes', 'string', 'max:100'],
            'deskripsi_singkat' => ['nullable', 'string', 'max:500'],
            'nomor_telepon' => ['sometimes', 'string', 'max:20'],
            'nama_provinsi' => ['sometimes', 'string', 'max:100'],
            'nama_kabupaten_kota' => ['sometimes', 'string', 'max:100'],
            'nama_kecamatan' => ['sometimes', 'string', 'max:100'],
            'nama_kelurahan' => ['sometimes', 'string', 'max:100'],
            'RT' => ['sometimes', 'string', 'max:3'],
            'RW' => ['sometimes', 'string', 'max:3'],
            'detail_alamat' => ['sometimes', 'string'],
            'foto_penjual' => ['sometimes', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        try {
            // Jika ada update wilayah, cari atau buat kelurahan_id
            if (isset($validated['nama_kelurahan'])) {
                // Butuh semua 4 komponen wilayah
                if (!isset($validated['nama_provinsi']) || !isset($validated['nama_kabupaten_kota']) || !isset($validated['nama_kecamatan'])) {
                    return response()->json([
                        'message' => 'Untuk update alamat, harus lengkap: provinsi, kabupaten_kota, kecamatan, kelurahan',
                    ], 422);
                }

                // Gunakan service untuk cari atau buat wilayah
                $validated['kelurahan_id'] = $this->wilayahService->findOrCreateKelurahan(
                    $validated['nama_provinsi'],
                    $validated['nama_kabupaten_kota'],
                    $validated['nama_kecamatan'],
                    $validated['nama_kelurahan']
                );

                // Hapus key nama wilayah, karena yang disimpan hanya kelurahan_id
                unset($validated['nama_provinsi'], $validated['nama_kabupaten_kota'], $validated['nama_kecamatan'], $validated['nama_kelurahan']);
            }

            // Upload foto baru jika ada
            if ($request->hasFile('foto_penjual')) {
                $seller = Seller::where('user_id', $user->id)->first();

                // Hapus foto lama
                if ($seller->foto_penjual && Storage::disk('public')->exists($seller->foto_penjual)) {
                    Storage::disk('public')->delete($seller->foto_penjual);
                }

                $validated['foto_penjual'] = $request->file('foto_penjual')->store('penjual/foto_profil', 'public');
            }

            // Update menggunakan Eloquent
            Seller::where('user_id', $user->id)->update($validated);

            return response()->json([
                'message' => 'Profile berhasil diupdate',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal update profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
