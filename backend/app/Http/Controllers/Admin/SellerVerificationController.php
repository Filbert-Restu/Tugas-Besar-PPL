<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SellerApproved;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class SellerVerificationController extends Controller
{
    /**
     * daftar penjual butuh verifikasi
     */
    public function index()
    {
        // Get all sellers (pending, verified, rejected) - filter dilakukan di frontend
        $sellers = Seller::with('user')->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'message' => 'Daftar semua penjual',
            'data' => $sellers->map(function ($seller) {
                return [
                    'user_id' => $seller->user_id,
                    'nama_toko' => $seller->nama_toko,
                    'status' => $seller->status,
                    'created_at' => $seller->created_at,
                    'email' => $seller->user->email,
                    'name' => $seller->user->name,
                    'nomor_telepon' => $seller->nomor_telepon,
                ];
            }),
        ]);
    }
    /**
     * Detail penjual berdasarkan user_id
     */
    public function show($userId) {
        $seller = Seller::where('user_id', $userId)->with('user')->first();

        if (!$seller) {
            return response()->json([
                'message' => 'Penjual tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail penjual',
            'data' => [
                'user_id' => $seller->user_id,
                'nama_toko' => $seller->nama_toko,
                'deskripsi_singkat' => $seller->deskripsi_singkat,
                'nomor_telepon' => $seller->nomor_telepon,
                'kelurahan_id' => $seller->kelurahan_id,
                'RT' => $seller->RT,
                'RW' => $seller->RW,
                'detail_alamat' => $seller->detail_alamat,
                'no_ktp' => $seller->no_ktp,
                'foto_penjual' => $seller->foto_penjual,
                'foto_ktp' => $seller->foto_ktp,
                'status' => $seller->status,
                'created_at' => $seller->created_at,
                'updated_at' => $seller->updated_at,
                'email' => $seller->user->email,
                'name' => $seller->user->name,
            ],
        ]);
    }
    /**
     * Approve penjual (ubah status ke verified)
     */
    public function approve(Request $request)
    {
        $userId = $request->input('user_id');

        $seller = Seller::where('user_id', $userId)->first();

        if (!$seller) {
            return response()->json([
                'message' => 'Penjual tidak ditemukan'
            ], 404);
        }

        if ($seller->status === 'verified') {
            return response()->json([
                'message' => 'Penjual sudah terverifikasi sebelumnya'
            ], 400);
        }

        $seller->update(['status' => 'verified']);

        // Kirim email notifikasi ke penjual
        Mail::to($seller->user->email)->send(new SellerApproved($seller));

        return response()->json([
            'message' => 'Penjual berhasil diverifikasi',
            'data' => [
                'user_id' => $seller->user_id,
                'nama_toko' => $seller->nama_toko,
                'status' => $seller->status,
                'updated_at' => $seller->updated_at,
            ]
        ]);
    }

    /**
     * Reject penjual (ubah status ke rejected)
     */
    public function reject(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $seller = Seller::where('user_id', $validated['user_id'])->first();

        if (!$seller) {
            return response()->json([
                'message' => 'Penjual tidak ditemukan'
            ], 404);
        }

        if ($seller->status === 'rejected') {
            return response()->json([
                'message' => 'Penjual sudah ditolak sebelumnya'
            ], 400);
        }

        $seller->update(['status' => 'rejected']);

        // Kirim email notifikasi ke penjual dengan alasan penolakan
        Mail::to($seller->user->email)->send(new \App\Mail\SellerRejected($seller, $validated['reason'] ?? null));

        return response()->json([
            'message' => 'Penjual berhasil ditolak',
            'data' => [
                'user_id' => $seller->user_id,
                'nama_toko' => $seller->nama_toko,
                'status' => $seller->status,
                'reason' => $validated['reason'] ?? null,
                'updated_at' => $seller->updated_at,
            ]
        ]);
    }

    /**
     * Reset status penjual kembali ke pending (untuk re-review)
     */
    public function resetStatus(Request $request)
    {
        $userId = $request->input('user_id');

        $seller = Seller::where('user_id', $userId)->first();

        if (!$seller) {
            return response()->json([
                'message' => 'Penjual tidak ditemukan'
            ], 404);
        }

        if ($seller->status === 'pending') {
            return response()->json([
                'message' => 'Status penjual sudah pending'
            ], 400);
        }

        $seller->update(['status' => 'pending']);

        return response()->json([
            'message' => 'Status penjual berhasil direset ke pending',
            'data' => [
                'user_id' => $seller->user_id,
                'nama_toko' => $seller->nama_toko,
                'status' => $seller->status,
                'updated_at' => $seller->updated_at,
            ]
        ]);
    }
}
