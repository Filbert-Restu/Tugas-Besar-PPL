<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SellerApproved;
use App\Mail\SellerRejected;
use Illuminate\Support\Facades\Log;

class AdminVerificationController extends Controller
{
    // Get List Pending
    public function pendingSellers()
    {
        // Ambil yang pending, urutkan dari yang terlama daftar
        $sellers = Seller::where('verification_status', 'pending')
                        ->orderBy('created_at', 'asc') 
                        ->get();
        
        // Kita append full URL untuk gambar agar bisa diakses frontend
        $sellers->transform(function ($seller) {
            $seller->foto_pic_url = asset('storage/' . $seller->foto_pic_url);
            $seller->file_ktp_url = asset('storage/' . $seller->file_ktp_url);
            return $seller;
        });

        return response()->json(['data' => $sellers]);
    }

    // Aksi Terima / Tolak
    public function verify(Request $request, $id)
    {
        $seller = Seller::findOrFail($id);

        $request->validate([
            'verification_status' => 'required|in:accepted,rejected',
            'rejection_reason' => 'nullable|string'
        ]);

        try {
            if ($request->verification_status == 'accepted') {
                // 1. LOGIKA TERIMA
                $seller->update([
                    'verification_status' => 'accepted',
                    'is_active' => true, // PENTING: Ini kuncinya biar bisa login
                    'verified_at' => now(),
                    'rejection_reason' => null
                ]);

                // Kirim Email (Dibungkus try-catch biar ga error kalau SMTP mati)
                try {
                    Mail::to($seller->email_pic)->send(new SellerApproved($seller));
                } catch (\Exception $e) {
                    Log::error("Gagal kirim email approved: " . $e->getMessage());
                }

            } else {
                // 2. LOGIKA TOLAK
                $seller->update([
                    'verification_status' => 'rejected',
                    'is_active' => false,
                    'rejection_reason' => $request->rejection_reason
                ]);

                // Opsional: Kirim email reject
                try {
                   Mail::to($seller->email_pic)->send(new SellerRejected($seller));
                } catch (\Exception $e) {}
            }

            return response()->json([
                'message' => 'Status penjual berhasil diperbarui',
                'status' => $request->verification_status
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan server'], 500);
        }
    }
}