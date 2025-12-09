<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SellerSuspended;
use App\Mail\SellerActivated;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class SellerManagementController extends Controller
{
    /**
     * Suspend seller account
     */
    public function suspend(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $user = User::findOrFail($validated['user_id']);
        $seller = Seller::where('user_id', $validated['user_id'])->first();

        if (!$seller) {
            return response()->json([
                'message' => 'Penjual tidak ditemukan'
            ], 404);
        }

        if ($seller->status !== 'verified') {
            return response()->json([
                'message' => 'Hanya penjual terverifikasi yang dapat disuspend'
            ], 400);
        }

        // Update user status to suspended
        $user->update(['is_active' => false]);

        // Revoke all tokens (force logout)
        $user->tokens()->delete();

        // Send email notification
        Mail::to($user->email)->send(new SellerSuspended($seller, $validated['reason']));

        return response()->json([
            'message' => 'Penjual berhasil disuspend dan telah logout',
            'data' => [
                'user_id' => $user->id,
                'nama_toko' => $seller->nama_toko,
                'is_active' => false,
                'reason' => $validated['reason'],
            ]
        ]);
    }

    /**
     * Activate seller account
     */
    public function activate(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $user = User::findOrFail($validated['user_id']);
        $seller = Seller::where('user_id', $validated['user_id'])->first();

        if (!$seller) {
            return response()->json([
                'message' => 'Penjual tidak ditemukan'
            ], 404);
        }

        if ($seller->status !== 'verified') {
            return response()->json([
                'message' => 'Hanya penjual terverifikasi yang dapat diaktifkan'
            ], 400);
        }

        // Update user status to active
        $user->update(['is_active' => true]);

        // Send email notification
        Mail::to($user->email)->send(new SellerActivated($seller));

        return response()->json([
            'message' => 'Penjual berhasil diaktifkan kembali',
            'data' => [
                'user_id' => $user->id,
                'nama_toko' => $seller->nama_toko,
                'is_active' => true,
            ]
        ]);
    }

    /**
     * Export sellers list to PDF
     */
    public function exportPDF()
    {
        // Get all verified sellers with their user data
        $sellers = Seller::with('user')
            ->where('status', 'verified')
            ->orderBy('created_at', 'desc')
            ->get();

        $data = [
            'title' => 'Laporan Akun Penjual',
            'date' => now()->format('d F Y'),
            'sellers' => $sellers->map(function ($seller) {
                return [
                    'nama_toko' => $seller->nama_toko,
                    'nama_pemilik' => $seller->user->name,
                    'email' => $seller->user->email,
                    'nomor_telepon' => $seller->nomor_telepon,
                    'status' => $seller->user->is_active ? 'Aktif' : 'Suspended',
                    'tanggal_verifikasi' => $seller->updated_at->format('d/m/Y'),
                ];
            }),
            'total_sellers' => $sellers->count(),
            'active_sellers' => $sellers->filter(fn($s) => $s->user->is_active)->count(),
            'suspended_sellers' => $sellers->filter(fn($s) => !$s->user->is_active)->count(),
        ];

        $pdf = Pdf::loadView('pdf.sellers-report', $data);
        
        return $pdf->download('laporan-penjual-' . now()->format('Y-m-d') . '.pdf');
    }
}
