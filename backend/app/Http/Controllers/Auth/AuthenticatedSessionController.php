<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): Response
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();
        
        // Determine role and redirect
        $role = $user->role;
        $redirectTo = '/';
        
        if ($role === 'admin') {
            $redirectTo = '/admin/dashboard';
        } elseif ($role === 'penjual') {
            // Check seller status
            $seller = $user->seller;
            if (!$seller) {
                Auth::logout();
                return response()->json([
                    'message' => 'Data penjual tidak ditemukan.',
                ], 403);
            }
            
            if ($seller->status === 'pending') {
                Auth::logout();
                return response()->json([
                    'message' => 'Akun Anda masih menunggu verifikasi admin.',
                    'status' => 'pending',
                ], 403);
            }
            
            if ($seller->status === 'rejected') {
                Auth::logout();
                return response()->json([
                    'message' => 'Akun Anda ditolak oleh admin.',
                    'status' => 'rejected',
                ], 403);
            }
            
            $redirectTo = '/seller/dashboard';
        } elseif ($role === 'pembeli') {
            $redirectTo = '/home';
        }

        return response()->json([
            'message' => 'Login berhasil',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $role,
                ],
                'role' => $role,
                'redirect_to' => $redirectTo,
            ],
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }
}
