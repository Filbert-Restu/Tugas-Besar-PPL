<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Handle login untuk SEMUA role (Admin, Penjual, Pembeli)
     */
    public function login(Request $request)
    {
        // 1. Validasi Input Standar
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Coba Login (Otentikasi)
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        // 3. Ambil Data User yang berhasil login
        $user = Auth::user();

        // 4. Check Email Verification (untuk semua user)
        if (!$user->hasVerifiedEmail()) {
            Auth::guard('web')->logout();
            return response()->json([
                'message' => 'Email Anda belum diverifikasi. Silakan cek inbox email Anda dan klik link verifikasi.',
                'email_verified' => false,
                'email' => $user->email
            ], 403);
        }

        // 5. Validasi khusus untuk penjual (setelah email verified)
        if ($user->role === 'penjual') {
            $seller = Seller::where('user_id', $user->id)->first();

            if (!$seller) {
                Auth::guard('web')->logout();
                return response()->json([
                    'message' => 'Data penjual tidak ditemukan.'
                ], 404);
            }

            if ($seller->status === 'pending') {
                Auth::guard('web')->logout();
                return response()->json([
                    'message' => 'Email Anda sudah terverifikasi. Akun penjual Anda masih dalam proses verifikasi admin. Mohon tunggu.',
                    'status' => 'pending',
                    'email_verified' => true
                ], 403);
            }

            if ($seller->status === 'rejected') {
                Auth::guard('web')->logout();
                return response()->json([
                    'message' => 'Akun penjual Anda ditolak oleh admin. Silakan hubungi administrator.',
                    'status' => 'rejected',
                    'email_verified' => true
                ], 403);
            }
        }

        // 6. Hapus token lama (Opsional - agar 1 user 1 device)
        $user->tokens()->delete();

        // 7. Buat Token Baru (Sanctum)
        // Kita bisa memberi 'ability' pada token berdasarkan role (opsional)
        $tokenAbilities = match ($user->role) {
            'admin' => ['server:admin'],
            'penjual' => ['server:seller'],
            default => ['server:buyer'],
        };

        $token = $user->createToken('auth_token', $tokenAbilities)->plainTextToken;

        // 8. Return JSON Lengkap
        // Frontend butuh 'role' untuk melakukan redirect
        return response()->json([
            'message' => 'Login berhasil',
            'data' => [
                'user' => $user,
                'token' => $token,
                'role' => $user->role, // Penting! Kirim role ke frontend
                'redirect_to' => $this->getRedirectPath($user->role), // Helper path
            ]
        ], 200);
    }

    /**
     * Helper kecil untuk memberi saran path ke frontend
     */
    private function getRedirectPath($role)
    {
        return match ($role) {
            'admin' => '/admin/dashboard',
            'penjual' => '/seller/dashboard',
            default => '/'
        };
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }
}
