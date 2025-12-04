<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\KategoriProduk;
use Illuminate\Http\Request;

class MainController extends Controller
{
    /**
     * Display a listing of products with relationships, search, filter, and pagination
     */
    public function index(Request $request)
    {
        $query = Produk::with([
            'seller.kelurahan.kecamatan.kabupatenKota.provinsi',
            'kategori'
        ]);

        // Only show products with stock > 0 by default (like Tokopedia)
        // Unless explicitly requesting to show out of stock products
        if (!$request->has('show_out_of_stock') || $request->show_out_of_stock != 'true') {
            $query->where('stok_produk', '>', 0);
        }

        // Search by product name or description
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_produk', 'like', "%{$search}%")
                  ->orWhere('deskripsi_produk', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('kategori_id') && $request->kategori_id != '') {
            $query->where('kategori_produk_id', $request->kategori_id);
        }

        // Filter by seller/store name
        if ($request->has('toko') && $request->toko != '') {
            $toko = $request->toko;
            $query->whereHas('seller', function ($q) use ($toko) {
                $q->where('nama_toko', 'like', "%{$toko}%");
            });
        }

        // Filter by price range
        if ($request->has('harga_min') && $request->harga_min != '') {
            $query->where('harga_produk', '>=', $request->harga_min);
        }
        if ($request->has('harga_max') && $request->harga_max != '') {
            $query->where('harga_produk', '<=', $request->harga_max);
        }

        // Filter by province
        if ($request->has('provinsi') && $request->provinsi != '') {
            $provinsi = $request->provinsi;
            $query->whereHas('seller.kelurahan.kecamatan.kabupatenKota.provinsi', function ($q) use ($provinsi) {
                $q->where('nama_provinsi', 'like', "%{$provinsi}%");
            });
        }

        // Filter by city
        if ($request->has('kota') && $request->kota != '') {
            $kota = $request->kota;
            $query->whereHas('seller.kelurahan.kecamatan.kabupatenKota', function ($q) use ($kota) {
                $q->where('nama_kabupaten_kota', 'like', "%{$kota}%");
            });
        }

        // Filter by district (kecamatan)
        if ($request->has('kecamatan') && $request->kecamatan != '') {
            $kecamatan = $request->kecamatan;
            $query->whereHas('seller.kelurahan.kecamatan', function ($q) use ($kecamatan) {
                $q->where('nama_kecamatan', 'like', "%{$kecamatan}%");
            });
        }

        // Filter by village (kelurahan)
        if ($request->has('kelurahan') && $request->kelurahan != '') {
            $kelurahan = $request->kelurahan;
            $query->whereHas('seller.kelurahan', function ($q) use ($kelurahan) {
                $q->where('nama_kelurahan', 'like', "%{$kelurahan}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSorts = ['nama_produk', 'harga_produk', 'stok_produk', 'created_at', 'terjual'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $perPage = min($perPage, 100); // Max 100 items per page

        $products = $query->paginate($perPage);

        // Transform data to include computed fields (simplified like Tokopedia)
        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'nama_produk' => $product->nama_produk,
                'harga_produk' => $product->harga_produk,
                'stok_produk' => $product->stok_produk,
                'foto_produk_url' => $product->foto_produk_url,
                'rating' => $product->rating, // Rating calculated from reviews
                'terjual' => 0, // TODO: Implement sold count from orders
                'seller_id' => $product->user_id,
                'kategori' => $product->kategori ? [
                    'id' => $product->kategori->id,
                    'nama_kategori' => $product->kategori->nama_kategori,
                ] : null,
                'toko' => [
                    'nama_toko' => $product->seller->nama_toko,
                    'kota' => $product->seller->kelurahan->kecamatan->kabupatenKota->nama_kabupaten_kota ?? null,
                ],
            ];
        });

        return response()->json([
            'message' => 'Data produk berhasil diambil',
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],
        ]);
    }

    /**
     * Get list of categories for filter dropdown
     */
    public function categories()
    {
        $categories = KategoriProduk::withCount('produk')
            ->orderBy('nama_kategori')
            ->get();

        return response()->json([
            'message' => 'Data kategori berhasil diambil',
            'data' => $categories,
        ]);
    }

    /**
     * Get product statistics
     */
    public function statistics()
    {
        $totalProducts = Produk::count();
        $productsInStock = Produk::where('stok_produk', '>', 0)->count();
        $productsOutOfStock = Produk::where('stok_produk', '<=', 0)->count();
        $totalCategories = KategoriProduk::count();

        $averagePrice = Produk::avg('harga_produk');
        $minPrice = Produk::min('harga_produk');
        $maxPrice = Produk::max('harga_produk');

        return response()->json([
            'message' => 'Statistik produk berhasil diambil',
            'data' => [
                'total_products' => $totalProducts,
                'products_in_stock' => $productsInStock,
                'products_out_of_stock' => $productsOutOfStock,
                'total_categories' => $totalCategories,
                'price_statistics' => [
                    'average' => round($averagePrice, 2),
                    'min' => $minPrice,
                    'max' => $maxPrice,
                ],
            ],
        ]);
    }

    /**
     * Get single product detail
     */
    public function show($nama_toko, $product_id)
    {
        $product = Produk::with([
            'seller.kelurahan.kecamatan.kabupatenKota.provinsi',
            'kategori'
        ])->find($product_id);

        if (!$product) {
            return response()->json([
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        $data = [
            'id' => $product->id,
            'nama_produk' => $product->nama_produk,
            'deskripsi_produk' => $product->deskripsi_produk,
            'harga_produk' => $product->harga_produk,
            'berat_produk' => $product->berat_produk,
            'stok_produk' => $product->stok_produk,
            'foto_produk_url' => $product->foto_produk_url,
            'kondisi' => 'Baru', // Default value
            'rating' => $product->rating, // Rating calculated from reviews
            'terjual' => 0, // TODO: Implement from orders
            'kategori' => $product->kategori ? [
                'id' => $product->kategori->id,
                'nama_kategori' => $product->kategori->nama_kategori,
            ] : null,
            'toko' => [
                'user_id' => $product->seller->user_id,
                'nama_toko' => $product->seller->nama_toko,
                'deskripsi' => $product->seller->deskripsi_singkat,
                'foto_toko' => $product->seller->foto_penjual_url,
                'lokasi' => [
                    'kota' => $product->seller->kelurahan->kecamatan->kabupatenKota->nama_kabupaten_kota ?? null,
                    'provinsi' => $product->seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi ?? null,
                ],
                'statistik' => [
                    'total_produk' => $product->seller->produk()->count(),
                    'produk_terjual' => 0, // TODO: Implement from orders
                ],
            ],
            'pengiriman' => [
                'berat' => $product->berat_produk . ' gram',
                'dikirim_dari' => [
                    'kota' => $product->seller->kelurahan->kecamatan->kabupatenKota->nama_kabupaten_kota ?? null,
                    'provinsi' => $product->seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi ?? null,
                ],
            ],
        ];

        return response()->json([
            'message' => 'Detail produk berhasil diambil',
            'data' => $data,
        ]);
    }
}
