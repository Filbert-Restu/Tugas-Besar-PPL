<?php

namespace App\Http\Controllers\Auth\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Illuminate\Auth\Events\Registered;
use App\Models\User;
use App\Models\Seller;
use App\Services\WilayahService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class RegisteredSellerController extends Controller
{
    protected WilayahService $wilayahService;

    public function __construct(WilayahService $wilayahService)
    {
        $this->wilayahService = $wilayahService;
    }

    public function store(Request $request)
    {
        // 1. VALIDASI INPUT
        $validated = $request->validate([
            // Data User (Login)
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // Data Penjual (Profile Toko)
            'nama_toko' => ['required', 'string', 'max:100'],
            'deskripsi_singkat' => ['nullable', 'string', 'max:500'],
            'nomor_telepon' => ['required', 'string', 'max:20'],

            // Alamat Lengkap (nama wilayah)
            'nama_provinsi' => ['required', 'string', 'max:100'],
            'nama_kabupaten_kota' => ['required', 'string', 'max:100'],
            'nama_kecamatan' => ['required', 'string', 'max:100'],
            'nama_kelurahan' => ['required', 'string', 'max:100'],
            'RT' => ['required', 'string', 'max:3'],
            'RW' => ['required', 'string', 'max:3'],
            'detail_alamat' => ['required', 'string'],

            // Data Verifikasi KTP
            'no_ktp' => ['required', 'string', 'max:16', 'unique:penjual,no_ktp'],
            'foto_penjual' => [ 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'foto_ktp' => [ 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        // 2. DATABASE TRANSACTION
        try {
            // A. Upload Foto (sebelum transaction untuk performa)
            $fotoPenjualPath = null;
            $fotoKtpPath = null;

            if ($request->hasFile('foto_penjual')) {
                $fotoPenjualPath = $request->file('foto_penjual')->store('penjual/foto_profil', 'public');
            }

            if ($request->hasFile('foto_ktp')) {
                $fotoKtpPath = $request->file('foto_ktp')->store('penjual/foto_ktp', 'public');
            }

            DB::beginTransaction();

            // B. Cari atau Buat Wilayah (Auto Create/Link)
            $kelurahanId = $this->wilayahService->findOrCreateKelurahan(
                $validated['nama_provinsi'],
                $validated['nama_kabupaten_kota'],
                $validated['nama_kecamatan'],
                $validated['nama_kelurahan']
            );

            // C. Buat User (Login Data)
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'penjual',
            ]);

            // D. Buat Data Penjual menggunakan Eloquent
            $seller = Seller::create([
                'user_id' => $user->id,
                'nama_toko' => $validated['nama_toko'],
                'deskripsi_singkat' => $validated['deskripsi_singkat'] ?? null,
                'nomor_telepon' => $validated['nomor_telepon'],
                'kelurahan_id' => $kelurahanId,
                'RT' => $validated['RT'],
                'RW' => $validated['RW'],
                'detail_alamat' => $validated['detail_alamat'],
                'no_ktp' => $validated['no_ktp'],
                'foto_penjual' => $fotoPenjualPath,
                'foto_ktp' => $fotoKtpPath,
                'status' => 'pending',
            ]);

            DB::commit();

            // E. Kirim Email Verifikasi (setelah commit berhasil)
            event(new Registered($user));

            return response()->json([
                'message' => 'Registrasi penjual berhasil! Mohon verifikasi email Anda dan tunggu persetujuan admin.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'penjual' => [
                    'nama_toko' => $seller->nama_toko,
                    'status' => 'pending',
                ]
            ], 201);

        } catch (\Exception $e) {
            // Rollback database jika sudah dimulai
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }

            // Hapus file yang sudah terupload jika terjadi error
            if ($fotoPenjualPath && Storage::disk('public')->exists($fotoPenjualPath)) {
                Storage::disk('public')->delete($fotoPenjualPath);
            }
            if ($fotoKtpPath && Storage::disk('public')->exists($fotoKtpPath)) {
                Storage::disk('public')->delete($fotoKtpPath);
            }

            return response()->json([
                'message' => 'Terjadi kesalahan saat registrasi penjual.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }
}
