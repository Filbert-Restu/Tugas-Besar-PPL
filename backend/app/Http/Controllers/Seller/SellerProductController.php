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
    }}
