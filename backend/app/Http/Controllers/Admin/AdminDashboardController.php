<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\Seller;
use App\Models\User;
use App\Models\KategoriProduk;
use App\Models\ProdukReviews;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function statistics()
    {
        // 1. Jumlah produk berdasarkan kategori
        $productsByCategory = KategoriProduk::withCount('produk')
            ->orderBy('produk_count', 'desc')
            ->get()
            ->map(function ($category) {
                return [
                    'kategori' => $category->nama_kategori,
                    'jumlah_produk' => $category->produk_count,
                ];
            });

        // 2. Jumlah toko berdasarkan lokasi provinsi
        $storesByProvince = Provinsi::select('provinsi.id', 'provinsi.nama_provinsi', DB::raw('COUNT(penjual.user_id) as jumlah_toko'))
            ->leftJoin('kabupaten_kota', 'provinsi.id', '=', 'kabupaten_kota.provinsi_id')
            ->leftJoin('kecamatan', 'kabupaten_kota.id', '=', 'kecamatan.kabupaten_kota_id')
            ->leftJoin('kelurahan', 'kecamatan.id', '=', 'kelurahan.kecamatan_id')
            ->leftJoin('penjual', function($join) {
                $join->on('kelurahan.id', '=', 'penjual.kelurahan_id')
                     ->where('penjual.status', '=', 'verified');
            })
            ->groupBy('provinsi.id', 'provinsi.nama_provinsi')
            ->having('jumlah_toko', '>', 0)
            ->orderByDesc('jumlah_toko')
            ->limit(10)
            ->get()
            ->map(function ($provinsi) {
                return [
                    'provinsi' => $provinsi->nama_provinsi,
                    'jumlah_toko' => (int) $provinsi->jumlah_toko,
                ];
            });

        // 3. Jumlah user penjual aktif dan tidak aktif
        $activeSellers = Seller::where('status', 'verified')->count();
        $inactiveSellers = Seller::whereIn('status', ['pending', 'rejected'])->count();

        // 4. Jumlah pengunjung yang memberikan komentar dan rating
        $totalReviews = ProdukReviews::count();
        $averageRating = round(ProdukReviews::avg('rating') ?? 0, 1);

        // Distribusi rating
        $ratingDistribution = ProdukReviews::select('rating', DB::raw('count(*) as count'))
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->rating => $item->count];
            });

        // Fill missing ratings with 0
        for ($i = 1; $i <= 5; $i++) {
            if (!isset($ratingDistribution[$i])) {
                $ratingDistribution[$i] = 0;
            }
        }
        $ratingDistribution = collect($ratingDistribution)->sortKeysDesc();

        // Additional statistics
        $totalProducts = Produk::count();
        $totalCategories = KategoriProduk::count();
        $totalSellers = Seller::count();
        $pendingSellers = Seller::where('status', 'pending')->count();

        // Top rated products
        $topRatedProducts = Produk::with(['seller', 'kategori'])
            ->withCount('reviews')
            ->get()
            ->filter(function ($product) {
                return $product->reviews_count > 0;
            })
            ->map(function ($product) {
                return [
                    'nama_produk' => $product->nama_produk,
                    'nama_toko' => $product->seller->nama_toko,
                    'kategori' => $product->kategori->nama_kategori ?? '-',
                    'rating' => $product->rating,
                    'jumlah_review' => $product->reviews_count,
                ];
            })
            ->sortByDesc('rating')
            ->take(10)
            ->values();

        return response()->json([
            'message' => 'Statistik dashboard admin berhasil diambil',
            'data' => [
                'summary' => [
                    'total_produk' => $totalProducts,
                    'total_kategori' => $totalCategories,
                    'total_toko' => $totalSellers,
                    'toko_aktif' => $activeSellers,
                    'toko_tidak_aktif' => $inactiveSellers,
                    'pending_verifikasi' => $pendingSellers,
                    'total_review' => $totalReviews,
                    'average_rating' => $averageRating,
                ],
                'produk_per_kategori' => $productsByCategory,
                'toko_per_provinsi' => $storesByProvince,
                'user_status' => [
                    'aktif' => $activeSellers,
                    'tidak_aktif' => $inactiveSellers,
                ],
                'rating_distribution' => $ratingDistribution,
                'top_rated_products' => $topRatedProducts,
            ],
        ]);
    }
}
