<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        // Ambil semua produk beserta nama toko penjualnya
        $products = Product::with('seller:id,nama_toko,kabupaten_kota')
                           ->latest()
                           ->get();

        return response()->json([
            'data' => $products
        ]);
    }
}
