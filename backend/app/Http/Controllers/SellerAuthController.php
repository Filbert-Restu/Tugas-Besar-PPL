<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;

class SellerAuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'nama_toko' => 'required|string|max:100',
            'email_pic' => 'required|email|unique:sellers,email_pic',
            'password' => ['required', Rules\Password::defaults()],
            'nama_pic' => 'required|string',
            'no_handphone_pic' => 'required',
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048', // Max 2MB
            'foto_pic' => 'required|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Upload File ke Storage (folder public/uploads)
        $ktpPath = $request->file('file_ktp')->store('uploads/ktp', 'public');
        $fotoPath = $request->file('foto_pic')->store('uploads/foto', 'public');

        // 3. Simpan ke Database
        $seller = Seller::create([
            'nama_toko' => $request->nama_toko,
            'email_pic' => $request->email_pic,
            'password' => Hash::make($request->password),
            'nama_pic' => $request->nama_pic,
            'no_handphone_pic' => $request->no_handphone_pic,
            'alamat_jalan' => $request->alamat_jalan,
            'kabupaten_kota' => $request->kabupaten_kota,
            'propinsi' => $request->propinsi,
            'no_ktp_pic' => $request->no_ktp_pic,
            
            // Simpan URL lengkap agar mudah diakses frontend
            'file_ktp_url' => url('storage/' . $ktpPath),
            'foto_pic_url' => url('storage/' . $fotoPath),
            
            'verification_status' => 'pending',
            'is_active' => false,
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil. Tunggu verifikasi admin.',
            'seller' => $seller
        ], 201);
    }

    public function login(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Cari Seller berdasarkan email_pic (sesuai database kamu)
        $seller = Seller::where('email_pic', $request->email)->first();

        // 3. Cek Password & Apakah Seller Ditemukan
        if (! $seller || ! Hash::check($request->password, $seller->password)) {
            return response()->json([
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // 4. Cek Apakah Akun Aktif (Opsional, sesuai skema db kamu)
        if (!$seller->is_active) {
            $status = $seller->verification_status;
            $msg = $status === 'pending' 
                ? 'Akun Anda sedang dalam proses verifikasi admin.' 
                : 'Pendaftaran toko Anda ditolak. Cek email untuk detailnya.';
                
            return response()->json(['message' => $msg], 403);
        }

        // 5. Buat Token Sanctum
        // Hapus token lama jika mau single session (opsional)
        // $seller->tokens()->delete(); 
        
        $token = $seller->createToken('seller_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $seller // Kirim data seller ke frontend
        ]);
    }
}