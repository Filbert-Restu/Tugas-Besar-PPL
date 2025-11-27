<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SellerDashboardController extends Controller
{
    /**
     * Display seller dashboard data
     */
    public function show(Request $request)
    {
        $seller = $request->user()->seller;

        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }

        // Load all relationships
        $seller->load([
            'kelurahan.kecamatan.kabupatenKota.provinsi',
            'produk.kategori'
        ]);

        // Calculate product statistics
        $totalProducts = $seller->produk->count();
        $activeProducts = $seller->produk->filter(function ($produk) {
            return $produk->stok_produk > 0;
        })->count();
        $outOfStockProducts = $totalProducts - $activeProducts;

        $totalStok = $seller->produk->sum('stok_produk');
        $totalNilaiProduk = $seller->produk->sum(function ($produk) {
            return $produk->harga_produk * $produk->stok_produk;
        });

        // Get categories used
        $categories = $seller->produk->pluck('kategori.nama_kategori')->unique()->filter()->values();

        // Dashboard data
        $data = [
            'seller_info' => [
                'nama_toko' => $seller->nama_toko,
                'deskripsi_singkat' => $seller->deskripsi_singkat,
                'nomor_telepon' => $seller->nomor_telepon,
                'status' => $seller->status,
                'no_ktp' => $seller->no_ktp,
                'foto_penjual_url' => $seller->foto_penjual_url,
                'foto_ktp_url' => $seller->foto_ktp_url,
            ],
            'address' => [
                'provinsi' => $seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi ?? null,
                'kabupaten_kota' => $seller->kelurahan->kecamatan->kabupatenKota->nama_kabupaten_kota ?? null,
                'kecamatan' => $seller->kelurahan->kecamatan->nama_kecamatan ?? null,
                'kelurahan' => $seller->kelurahan->nama_kelurahan ?? null,
                'RT' => $seller->RT,
                'RW' => $seller->RW,
                'detail_alamat' => $seller->detail_alamat,
                'full_address' => $seller->full_address,
            ],
            'product_statistics' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'out_of_stock_products' => $outOfStockProducts,
                'total_stock' => $totalStok,
                'total_inventory_value' => $totalNilaiProduk,
                'categories_used' => $categories,
            ],
            'account_info' => [
                'user_id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
            ],
        ];

        return response()->json([
            'message' => 'Data dashboard penjual berhasil diambil',
            'data' => $data,
        ]);
    }
}
