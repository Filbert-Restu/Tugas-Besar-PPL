<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KategoriProduk;
use Illuminate\Http\Request;

class AdminCategoryProductController extends Controller
{
    /**
     * Get all categories
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        $search = $request->query('search');

        $query = KategoriProduk::query();

        if ($search) {
            $query->where('nama_kategori', 'like', "%{$search}%");
        }

        $categories = $query->orderBy('nama_kategori', 'asc')->paginate($perPage);

        return response()->json([
            'message' => 'Kategori berhasil diambil',
            'data' => $categories->items(),
            'meta' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ]
        ]);
    }

    /**
     * Get single category
     */
    public function show($id)
    {
        $category = KategoriProduk::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail kategori berhasil diambil',
            'data' => $category,
        ]);
    }

    /**
     * Create new category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => ['required', 'string', 'max:255', 'unique:kategori_produk,nama_kategori'],
        ]);

        $category = KategoriProduk::create($validated);

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $category,
        ], 201);
    }

    /**
     * Update existing category
     */
    public function update(Request $request, $id)
    {
        $category = KategoriProduk::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'nama_kategori' => ['required', 'string', 'max:255', 'unique:kategori_produk,nama_kategori,' . $id],
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Kategori berhasil diupdate',
            'data' => $category,
        ]);
    }

    /**
     * Delete category
     */
    public function destroy($id)
    {
        $category = KategoriProduk::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        // Check if category has products
        if ($category->produk()->count() > 0) {
            return response()->json([
                'message' => 'Kategori tidak dapat dihapus karena masih memiliki produk'
            ], 400);
        }

        $category->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ]);
    }

    /**
     * Get category statistics
     */
    public function statistics()
    {
        $stats = [
            'total' => KategoriProduk::count(),
            'with_products' => KategoriProduk::has('produk')->count(),
            'without_products' => KategoriProduk::doesntHave('produk')->count(),
        ];

        return response()->json([
            'message' => 'Statistik kategori berhasil diambil',
            'statistics' => $stats,
        ]);
    }
}
