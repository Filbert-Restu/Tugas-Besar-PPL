<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Seller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Trigger email verification
        event(new Registered($user));

        return response()->json([
            'message' => 'Registration successful! Please check your email to verify your account.',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // =================================================
        // 1. CEK USER BIASA / ADMIN (Tabel Users)
        // =================================================
        // Login langsung, TANPA cek email_verified_at
        if (Auth::guard('web')->attempt($credentials)) {
            /** @var \App\Models\User $user */
            $user = Auth::guard('web')->user();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login User berhasil',
                'token' => $token,
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    // Kita kirim role agar frontend bisa redirect
                    // Default 'admin' atau 'user' sesuai DB kamu
                    'role' => $user->role ?? 'platform', 
                ]
            ]);
        }

        // =================================================
        // 2. CEK SELLER (Tabel Sellers)
        // =================================================
        // Karena di tabel seller kolom loginnya 'email_pic', kita sesuaikan kuncinya
        $sellerCredentials = [
            'email_pic' => $credentials['email'], // Mapping input 'email' ke 'email_pic'
            'password'  => $credentials['password']
        ];

        if (Auth::guard('seller')->attempt($sellerCredentials)) {
            /** @var \App\Models\Seller $seller */
            $seller = Auth::guard('seller')->user();
            
            // --- LOGIKA CEK STATUS VERIFIKASI ---
            // Sesuai migration kamu: is_active default false
            if (!$seller->is_active) { 
                
                // Cek status detailnya untuk pesan error yang informatif
                $msg = $seller->verification_status === 'pending' 
                    ? 'Akun Toko Anda sedang dalam peninjauan Admin. Mohon tunggu.' 
                    : 'Maaf, pendaftaran Toko Anda ditolak.';

                // Logoutkan paksa karena belum aktif
                Auth::guard('seller')->logout();

                return response()->json([
                    'message' => $msg,
                    'is_active' => false
                ], 403); 
            }
            // ----------------------------------------

            $token = $seller->createToken('seller_token')->plainTextToken;

            return response()->json([
                'message' => 'Login Seller berhasil',
                'token' => $token,
                'user' => [
                    'name' => $seller->nama_pic, // Sesuaikan dengan kolom nama di tabel seller
                    'email' => $seller->email_pic,
                    'role' => 'seller', // Hardcode role seller
                ]
            ]);
        }

        // =================================================
        // 3. JIKA GAGAL DI KEDUANYA
        // =================================================
        throw ValidationException::withMessages([
            'email' => ['Email atau Password salah.'],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'message' => 'Invalid verification link'
            ], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 200);
        }

        $user->markEmailAsVerified();

        return response()->json([
            'message' => 'Email verified successfully! You can now login.',
            'verified' => true
        ]);
    }

    public function resendVerification(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 200);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification email sent! Please check your inbox.'
        ]);
    }
}
