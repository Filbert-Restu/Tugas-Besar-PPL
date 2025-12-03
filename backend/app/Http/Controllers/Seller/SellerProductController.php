<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class SellerProductController extends Controller
{
    /**
     * Get product penjual yang sedang login
    */
    public function show(Request $request)
    {
        $seller = $request->user()->seller;

        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }

        $produk = $seller->produk()->with('kategori')->get();

        return response()->json([
            'message' => 'Produk penjual berhasil diambil',
            'data' => $produk,
            'total' => $produk->count(),
        ]);
    }

    /**
     * Get detail product penjual yang sedang login
     */
    public function detail(Request $request, $id)
    {
        $seller = $request->user()->seller;

        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }

        $produk = $seller->produk()->with('kategori')->find($id);

        if (!$produk) {
            return response()->json([
                'message' => 'Produk tidak ditemukan atau bukan milik Anda'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail produk berhasil diambil',
            'data' => $produk,
        ]);
    }

    /**
     * add product penjual yang sedang login
     */
    public function add(Request $request)
    {
        $seller = $request->user()->seller;

        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'nama_produk' => ['required', 'string', 'max:255'],
            'kategori_produk_id' => ['required', 'integer', 'exists:kategori_produk,id'],
            'deskripsi_produk' => ['required', 'string'],
            'harga_produk' => ['required', 'numeric', 'min:0'],
            'berat_produk' => ['required', 'numeric', 'min:0'],
            'stok_produk' => ['required', 'integer', 'min:0'],
            'foto_produk' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        try {
            DB::beginTransaction();

            // Upload foto jika ada
            $fotoProdukPath = null;
            if ($request->hasFile('foto_produk')) {
                $fotoProdukPath = $request->file('foto_produk')->store('produk', 'public');
            }

            // Buat produk
            $produk = Produk::create([
                'user_id' => $seller->user_id,
                'nama_produk' => $validated['nama_produk'],
                'kategori_produk_id' => $validated['kategori_produk_id'],
                'deskripsi_produk' => $validated['deskripsi_produk'],
                'harga_produk' => $validated['harga_produk'],
                'berat_produk' => $validated['berat_produk'],
                'stok_produk' => $validated['stok_produk'],
                'foto_produk' => $fotoProdukPath,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Produk berhasil ditambahkan',
                'data' => $produk->load('kategori'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            // Hapus foto jika sudah terupload
            if ($fotoProdukPath && Storage::disk('public')->exists($fotoProdukPath)) {
                Storage::disk('public')->delete($fotoProdukPath);
            }

            return response()->json([
                'message' => 'Gagal menambahkan produk',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }

    }
    /**
     * add product penjual yang sedang login
     */
    public function edit(Request $request)
    {
        $seller = $request->user()->seller;

        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:produk,id'],
            'nama_produk' => ['sometimes', 'string', 'max:255'],
            'kategori_produk_id' => ['sometimes', 'integer', 'exists:kategori_produk,id'],
            'deskripsi_produk' => ['sometimes', 'string'],
            'harga_produk' => ['sometimes', 'numeric', 'min:0'],
            'berat_produk' => ['sometimes', 'numeric', 'min:0'],
            'stok_produk' => ['sometimes', 'integer', 'min:0'],
            'foto_produk' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        try {
            DB::beginTransaction();

            // Cari produk milik penjual
            $produk = $seller->produk()->find($validated['product_id']);

            if (!$produk) {
                return response()->json([
                    'message' => 'Produk tidak ditemukan atau bukan milik Anda'
                ], 404);
            }

            // Update data produk
            $produk->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Produk berhasil diupdate',
                'data' => $produk->load('kategori'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal mengupdate produk',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    /**
     * menambahkan qty product penjual yang sedang login
     */
    public function sum(Request $request)
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:produk,id'],
            'stok_produk' => ['required', 'integer', 'min:1'],
        ]);
        // Cari produk milik penjual
        $produk = $seller->produk()->find($validated['product_id']);
        if (!$produk) {
            return response()->json([
                'message' => 'Produk tidak ditemukan atau bukan milik Anda'
            ], 404);
        }
        $produk->increment('stok_produk', $validated['stok_produk']);
        return response()->json([
            'message' => 'Stok produk berhasil ditambahkan',
            'data' => $produk->load('kategori'),
        ]);
    }

    /**
     * mengurangi qty product penjual yang sedang login
     */
    public function sub(Request $request)
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:produk,id'],
            'stok_produk' => ['required', 'integer', 'min:1'],
        ]);
        // Cari produk milik penjual
        $produk = $seller->produk()->find($validated['product_id']);
        if (!$produk) {
            return response()->json([
                'message' => 'Produk tidak ditemukan atau bukan milik Anda'
            ], 404);
        }
        $produk->decrement('stok_produk', $validated['stok_produk']);
        return response()->json([
            'message' => 'Stok produk berhasil dikurangi',
            'data' => $produk->load('kategori'),
        ]);
    }
    /**
     * menghapus product penjual yang sedang login
     */
    public function delete(Request $request)
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            return response()->json([
                'message' => 'Data penjual tidak ditemukan'
            ], 404);
        }
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:produk,id'],
        ]);
        // Cari produk milik penjual
        $produk = $seller->produk()->find($validated['product_id']);
        if (!$produk) {
            return response()->json([
                'message' => 'Produk tidak ditemukan atau bukan milik Anda'
            ], 404);
        }
        $produk->delete();
        return response()->json([
            'message' => 'Produk berhasil dihapus',
        ]);
    }
}
