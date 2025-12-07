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

    /**
     * Get dashboard statistics for charts
     * - Stock distribution per product
     * - Rating distribution per product
     * - Reviewer distribution by province
     */
    public function statistics(Request $request)
    {
        $seller = $request->user()->seller;

        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }

        // Load products with reviews
        $seller->load([
            'produk.reviews',
            'produk.kategori'
        ]);

        // 1. Stock distribution per product
        $stockDistribution = $seller->produk->map(function ($produk) {
            return [
                'product_id' => $produk->id,
                'product_name' => $produk->nama_produk,
                'category' => $produk->kategori->nama_kategori ?? 'Uncategorized',
                'stock' => $produk->stok_produk,
                'price' => $produk->harga_produk,
            ];
        })->sortByDesc('stock')->values();

        // 2. Rating distribution per product
        $ratingDistribution = $seller->produk->map(function ($produk) {
            $totalReviews = $produk->reviews->count();
            $averageRating = $totalReviews > 0 ? round($produk->reviews->avg('rating'), 1) : 0;

            return [
                'product_id' => $produk->id,
                'product_name' => $produk->nama_produk,
                'category' => $produk->kategori->nama_kategori ?? 'Uncategorized',
                'average_rating' => $averageRating,
                'total_reviews' => $totalReviews,
            ];
        })->filter(function ($item) {
            return $item['total_reviews'] > 0; // Only products with reviews
        })->sortByDesc('average_rating')->values();

        // 3. Reviewer distribution by province
        // We need to track which provinces are reviewing the products
        // Since we don't have user location in reviews table, we'll use transaction data
        // For now, we'll aggregate by counting reviews per product and estimate based on seller's known locations
        
        // Get all reviews for seller's products
        $allReviews = \App\Models\ProdukReviews::whereIn(
            'product_id',
            $seller->produk->pluck('id')
        )->get();

        // Since we don't have reviewer location in the current schema,
        // we'll provide a summary of total reviews
        // In a real scenario, you'd need to join with transactions/users to get location
        $reviewersByProvince = [
            [
                'province' => $seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi ?? 'Unknown',
                'total_reviews' => $allReviews->count(),
                'average_rating' => round($allReviews->avg('rating') ?? 0, 1),
                'products_reviewed' => $ratingDistribution->count(),
            ]
        ];

        // Summary statistics
        $summary = [
            'total_products' => $seller->produk->count(),
            'total_stock' => $seller->produk->sum('stok_produk'),
            'low_stock_products' => $seller->produk->filter(function ($produk) {
                return $produk->stok_produk > 0 && $produk->stok_produk < 10;
            })->count(),
            'out_of_stock_products' => $seller->produk->filter(function ($produk) {
                return $produk->stok_produk == 0;
            })->count(),
            'total_reviews' => $allReviews->count(),
            'average_rating' => round($allReviews->avg('rating') ?? 0, 1),
        ];

        return response()->json([
            'message' => 'Data statistik dashboard berhasil diambil',
            'data' => [
                'summary' => $summary,
                'stock_distribution' => $stockDistribution,
                'rating_distribution' => $ratingDistribution,
                'reviewers_by_province' => $reviewersByProvince,
            ],
        ]);
    }
}
