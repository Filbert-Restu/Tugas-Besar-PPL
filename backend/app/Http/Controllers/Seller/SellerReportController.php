<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class SellerReportController extends Controller
{
    /**
     * Generate laporan stock produk diurutkan berdasarkan stock (menurun)
     */
    public function stockByQuantity(Request $request)
    {
        $seller = $request->user()->seller;
        $sellerId = $seller->user_id;

        $products = Produk::where('user_id', $sellerId)
            ->with(['kategori'])
            ->orderBy('stok_produk', 'desc')
            ->get()
            ->map(function ($product) {
                return [
                    'nama_produk' => $product->nama_produk,
                    'stock' => $product->stok_produk,
                    'rating' => $product->rating ?? 0,
                    'kategori' => $product->kategori->nama_kategori ?? '-',
                    'harga' => $product->harga_produk,
                ];
            });

        $pdf = Pdf::loadView('reports.stock-by-quantity', [
            'products' => $products,
            'generated_at' => now()->format('d F Y H:i:s'),
        ]);

        return $pdf->download('laporan-stock-produk-' . date('YmdHis') . '.pdf');
    }

    /**
     * Generate laporan stock produk diurutkan berdasarkan rating (menurun)
     */
    public function stockByRating(Request $request)
    {
        $seller = $request->user()->seller;
        $sellerId = $seller->user_id;

        $products = Produk::where('user_id', $sellerId)
            ->with(['kategori'])
            ->get()
            ->map(function ($product) {
                return [
                    'nama_produk' => $product->nama_produk,
                    'stock' => $product->stok_produk,
                    'rating' => $product->rating ?? 0,
                    'kategori' => $product->kategori->nama_kategori ?? '-',
                    'harga' => $product->harga_produk,
                ];
            })
            ->sortByDesc('rating')
            ->values();

        $pdf = Pdf::loadView('reports.stock-by-rating', [
            'products' => $products,
            'generated_at' => now()->format('d F Y H:i:s'),
        ]);

        return $pdf->download('laporan-rating-produk-' . date('YmdHis') . '.pdf');
    }

    /**
     * Generate laporan stock produk yang harus segera dipesan (stock < 2)
     */
    public function lowStock(Request $request)
    {
        $seller = $request->user()->seller;
        $sellerId = $seller->user_id;

        $products = Produk::where('user_id', $sellerId)
            ->where('stok_produk', '<', 2)
            ->with(['kategori'])
            ->orderBy('stok_produk', 'asc')
            ->get()
            ->map(function ($product) {
                return [
                    'nama_produk' => $product->nama_produk,
                    'stock' => $product->stok_produk,
                    'rating' => $product->rating ?? 0,
                    'kategori' => $product->kategori->nama_kategori ?? '-',
                    'harga' => $product->harga_produk,
                ];
            });

        $pdf = Pdf::loadView('reports.low-stock', [
            'products' => $products,
            'generated_at' => now()->format('d F Y H:i:s'),
        ]);

        return $pdf->download('laporan-stock-menipis-' . date('YmdHis') . '.pdf');
    }
}
