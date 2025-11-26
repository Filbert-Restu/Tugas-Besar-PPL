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
     * Get semua penjual dengan filter status
     */
    public function index(Request $request)
    {
        $status = $request->query('status'); // pending, verified, rejected, atau null (semua)

        $query = Seller::with(['user', 'kelurahan.kecamatan.kabupatenKota.provinsi']);

        if ($status && in_array($status, ['pending', 'verified', 'rejected'])) {
            $query->where('status', $status);
        }

        $sellers = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'data' => $sellers->map(function ($seller) {
                $kelurahan = $seller->kelurahan;

                return [
                    'user_id' => $seller->user_id,
                    'nama_toko' => $seller->nama_toko,
                    'deskripsi_singkat' => $seller->deskripsi_singkat,
                    'nomor_telepon' => $seller->nomor_telepon,
                    'alamat_lengkap' => $seller->full_address,
                    'kelurahan' => $kelurahan?->nama_kelurahan,
                    'kecamatan' => $kelurahan?->kecamatan?->nama_kecamatan,
                    'kabupaten_kota' => $kelurahan?->kecamatan?->kabupatenKota?->nama_kabupaten_kota,
                    'provinsi' => $kelurahan?->kecamatan?->kabupatenKota?->provinsi?->nama_provinsi,
                    'no_ktp' => $seller->no_ktp,
                    'foto_penjual' => $seller->foto_penjual_url,
                    'foto_ktp' => $seller->foto_ktp_url,
                    'status' => $seller->status,
                    'user' => [
                        'name' => $seller->user->name,
                        'email' => $seller->user->email,
                        'email_verified_at' => $seller->user->email_verified_at,
                    ],
                    'created_at' => $seller->created_at,
                    'updated_at' => $seller->updated_at,
                ];
            }),
            'meta' => [
                'current_page' => $sellers->currentPage(),
                'last_page' => $sellers->lastPage(),
                'per_page' => $sellers->perPage(),
                'total' => $sellers->total(),
            ]
        ]);
    }

    /**
     * Get detail penjual by user_id
     */
    public function show(Request $request) {
        $userId = $request->input('user_id');

        $seller = Seller::with(['user', 'kelurahan.kecamatan.kabupatenKota.provinsi'])
            ->where('user_id', $userId)
            ->first();

        if (!$seller) {
            return response()->json([
                'message' => 'Penjual tidak ditemukan'
            ], 404);
        }

        $kelurahan = $seller->kelurahan;

        return response()->json([
            'data' => [
                'user_id' => $seller->user_id,
                'nama_toko' => $seller->nama_toko,
                'deskripsi_singkat' => $seller->deskripsi_singkat,
                'nomor_telepon' => $seller->nomor_telepon,
                'alamat_lengkap' => $seller->full_address,
                'kelurahan' => $kelurahan?->nama_kelurahan,
                'kecamatan' => $kelurahan?->kecamatan?->nama_kecamatan,
                'kabupaten_kota' => $kelurahan?->kecamatan?->kabupatenKota?->nama_kabupaten_kota,
                'provinsi' => $kelurahan?->kecamatan?->kabupatenKota?->provinsi?->nama_provinsi,
                'RT' => $seller->RT,
                'RW' => $seller->RW,
                'detail_alamat' => $seller->detail_alamat,
                'no_ktp' => $seller->no_ktp,
                'foto_penjual' => $seller->foto_penjual_url,
                'foto_ktp' => $seller->foto_ktp_url,
                'status' => $seller->status,
                'user' => [
                    'name' => $seller->user->name,
                    'email' => $seller->user->email,
                    'email_verified_at' => $seller->user->email_verified_at,
                    'created_at' => $seller->user->created_at,
                ],
                'created_at' => $seller->created_at,
                'updated_at' => $seller->updated_at,
            ]
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

        // TODO: Kirim email notifikasi ke penjual dengan alasan penolakan
        // event(new SellerRejected($seller, $validated['reason'] ?? null));

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
