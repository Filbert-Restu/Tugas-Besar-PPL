<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Seller;
use App\Models\Produk;
use App\Models\ProdukReviews;
use App\Models\Provinsi;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Get dashboard statistics and charts data
     */
    public function index()
    {
        try {
            // Get stats
            $totalSellers = Seller::count();
            $activeSellers = Seller::where('status', 'verified')->count();
            $inactiveSellers = Seller::where('status', 'pending')->orWhere('status', 'rejected')->count();
            $totalProducts = Produk::count();
            $totalRatings = ProdukReviews::count();
            $totalComments = ProdukReviews::whereNotNull('review_text')->count();

            // Get products by category
            $productsByCategory = DB::table('produk')
                ->join('kategori_produk', 'produk.kategori_produk_id', '=', 'kategori_produk.id')
                ->select('kategori_produk.nama_kategori as category', DB::raw('count(*) as count'))
                ->groupBy('kategori_produk.nama_kategori')
                ->orderByDesc('count')
                ->get();

            // Get sellers by province
            $sellersByProvinceCollection = Seller::with(['kelurahan.kecamatan.kabupatenKota.provinsi'])
                ->get()
                ->groupBy(function ($seller) {
                    return $seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi;
                })
                ->map(function ($group, $province) {
                    $total = $group->count();
                    $active = $group->where('status', 'verified')->count();
                    $inactive = $total - $active;

                    return [
                        'province' => $province,
                        'total_count' => $total,
                        'active_count' => $active,
                        'inactive_count' => $inactive,
                    ];
                })
                ->sortByDesc('total_count')
                ->values();

            $sellersByProvince = $sellersByProvinceCollection;

            // Calculate rating stats
            $totalVisitors = DB::table('produk_reviews')->distinct('user_id')->count('user_id');
            $visitorsWithRating = DB::table('produk_reviews')->distinct('user_id')->count('user_id');
            $visitorsWithComment = DB::table('produk_reviews')
                ->whereNotNull('review_text')
                ->distinct('user_id')
                ->count('user_id');
            $averageRating = ProdukReviews::avg('rating') ?? 0;

            return response()->json([
                'message' => 'Dashboard data retrieved successfully',
                'data' => [
                    'stats' => [
                        'totalSellers' => $totalSellers,
                        'activeSellers' => $activeSellers,
                        'inactiveSellers' => $inactiveSellers,
                        'totalProducts' => $totalProducts,
                        'totalRatings' => $totalRatings,
                        'totalComments' => $totalComments,
                    ],
                    'productsByCategory' => $productsByCategory->map(function ($item) {
                        return [
                            'category' => $item->category,
                            'count' => $item->count,
                        ];
                    }),
                    'sellersByProvince' => $sellersByProvince->map(function ($item) {
                        return [
                            'province' => $item->province,
                            'count' => $item->total_count,
                            'activeCount' => $item->active_count,
                            'inactiveCount' => $item->inactive_count,
                        ];
                    }),
                    'ratingStats' => [
                        'totalVisitors' => $totalVisitors,
                        'visitorsWithRating' => $visitorsWithRating,
                        'visitorsWithComment' => $visitorsWithComment,
                        'averageRating' => round($averageRating, 2),
                    ],
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get active sellers with pagination and filters
     */
    public function getActiveSellers()
    {
        try {
            $sellers = Seller::with(['user', 'kelurahan.kecamatan.kabupatenkota.provinsi'])
                ->where('status', 'verified')
                ->orderByDesc('created_at')
                ->paginate(10);

            return response()->json([
                'message' => 'Active sellers retrieved successfully',
                'data' => $sellers->items(),
                'pagination' => [
                    'total' => $sellers->total(),
                    'per_page' => $sellers->perPage(),
                    'current_page' => $sellers->currentPage(),
                    'last_page' => $sellers->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve active sellers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sellers by province
     */
    public function getSellersByProvince()
    {
        try {
            $sellersByProvince = Seller::with(['kelurahan.kecamatan.kabupatenKota.provinsi'])
                ->get()
                ->groupBy(function ($seller) {
                    return $seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi;
                })
                ->map(function ($group, $province) {
                    $total = $group->count();
                    $active = $group->where('status', 'verified')->count();
                    $inactive = $total - $active;

                    return [
                        'province' => $province,
                        'count' => $total,
                        'activeCount' => $active,
                        'inactiveCount' => $inactive,
                    ];
                })
                ->sortByDesc('count')
                ->values();

            return response()->json([
                'message' => 'Sellers by province retrieved successfully',
                'data' => $sellersByProvince
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve sellers by province',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get top rated products
     */
    public function getTopRatedProducts()
    {
        try {
            $topProducts = Produk::with(['kategori', 'seller.user', 'seller.kelurahan.kecamatan.kabupatenKota.provinsi'])
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->orderByDesc('reviews_avg_rating')
                ->limit(20)
                ->get()
                ->map(function ($product) {
                    $provinsi = 'N/A';
                    if ($product->seller && $product->seller->kelurahan) {
                        try {
                            $provinsi = $product->seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi ?? 'N/A';
                        } catch (\Exception $e) {
                            $provinsi = 'N/A';
                        }
                    }

                    return [
                        'id' => $product->id,
                        'name' => $product->nama_produk,
                        'category' => $product->kategori->nama_kategori ?? 'N/A',
                        'seller_name' => $product->seller->user->name ?? 'N/A',
                        'province' => $provinsi,
                        'rating' => round($product->reviews_avg_rating ?? 0, 2),
                        'review_count' => $product->reviews_count ?? 0,
                        'price' => $product->harga_produk,
                        'image' => $product->foto_produk,
                    ];
                });

            return response()->json([
                'message' => 'Top rated products retrieved successfully',
                'data' => $topProducts
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve top rated products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
