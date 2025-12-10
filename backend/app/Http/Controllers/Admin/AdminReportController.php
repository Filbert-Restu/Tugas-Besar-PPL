<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\Produk;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class AdminReportController extends Controller
{
    /**
     * SRS-MartPlace-09: Laporan daftar akun penjual aktif dan tidak aktif (format PDF)
     *
     * Generate PDF report of active and inactive sellers
     */
    public function sellerReport()
    {
        // Get active sellers (verified)
        $activeSellers = Seller::with(['user', 'kelurahan.kecamatan.kabupatenKota.provinsi'])
            ->where('status', 'verified')
            ->orderBy('nama_toko')
            ->get()
            ->map(function ($seller) {
                return [
                    'nama_toko' => $seller->nama_toko,
                    'nama_pemilik' => $seller->user->name ?? '-',
                    'email' => $seller->user->email ?? '-',
                    'nomor_telepon' => $seller->nomor_telepon ?? '-',
                    'provinsi' => $seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi ?? '-',
                    'kabupaten_kota' => $seller->kelurahan->kecamatan->kabupatenKota->nama_kabupaten_kota ?? '-',
                    'status' => 'Aktif',
                ];
            });

        // Get inactive sellers (pending, rejected)
        $inactiveSellers = Seller::with(['user', 'kelurahan.kecamatan.kabupatenKota.provinsi'])
            ->whereIn('status', ['pending', 'rejected'])
            ->orderBy('nama_toko')
            ->get()
            ->map(function ($seller) {
                $status = $seller->status === 'pending' ? 'Menunggu Verifikasi' : 'Ditolak';
                return [
                    'nama_toko' => $seller->nama_toko,
                    'nama_pemilik' => $seller->user->name ?? '-',
                    'email' => $seller->user->email ?? '-',
                    'nomor_telepon' => $seller->nomor_telepon ?? '-',
                    'provinsi' => $seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi ?? '-',
                    'kabupaten_kota' => $seller->kelurahan->kecamatan->kabupatenKota->nama_kabupaten_kota ?? '-',
                    'status' => $status,
                ];
            });

        $data = [
            'title' => 'Laporan Daftar Akun Penjual',
            'date' => now()->format('d F Y'),
            'activeSellers' => $activeSellers,
            'inactiveSellers' => $inactiveSellers,
            'totalActive' => $activeSellers->count(),
            'totalInactive' => $inactiveSellers->count(),
            'total' => $activeSellers->count() + $inactiveSellers->count(),
        ];

        $pdf = Pdf::loadView('reports.seller-report', $data);
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('laporan-penjual-' . date('Y-m-d') . '.pdf');
    }

    /**
     * SRS-MartPlace-10: Laporan daftar penjual (toko) untuk setiap Lokasi propinsi (format PDF)
     *
     * Generate PDF report of sellers grouped by province
     */
    public function sellerByProvinceReport()
    {
        // Get all provinces with their verified sellers
        $provinces = Provinsi::select('provinsi.*')
            ->join('kabupaten_kota', 'provinsi.id', '=', 'kabupaten_kota.provinsi_id')
            ->join('kecamatan', 'kabupaten_kota.id', '=', 'kecamatan.kabupaten_kota_id')
            ->join('kelurahan', 'kecamatan.id', '=', 'kelurahan.kecamatan_id')
            ->join('penjual', 'kelurahan.id', '=', 'penjual.kelurahan_id')
            ->where('penjual.status', 'verified')
            ->distinct()
            ->orderBy('provinsi.nama_provinsi')
            ->get();

        $provinceData = [];
        foreach ($provinces as $province) {
            $sellers = DB::table('penjual')
                ->join('users', 'penjual.user_id', '=', 'users.id')
                ->join('kelurahan', 'penjual.kelurahan_id', '=', 'kelurahan.id')
                ->join('kecamatan', 'kelurahan.kecamatan_id', '=', 'kecamatan.id')
                ->join('kabupaten_kota', 'kecamatan.kabupaten_kota_id', '=', 'kabupaten_kota.id')
                ->where('kabupaten_kota.provinsi_id', $province->id)
                ->where('penjual.status', 'verified')
                ->select(
                    'penjual.nama_toko',
                    'users.name as nama_pemilik',
                    'users.email',
                    'penjual.nomor_telepon',
                    'kabupaten_kota.nama_kabupaten_kota',
                    'kecamatan.nama_kecamatan',
                    'penjual.detail_alamat'
                )
                ->orderBy('penjual.nama_toko')
                ->get();

            if ($sellers->count() > 0) {
                $provinceData[] = [
                    'provinsi' => $province->nama_provinsi,
                    'sellers' => $sellers,
                    'total' => $sellers->count(),
                ];
            }
        }

        $data = [
            'title' => 'Laporan Daftar Penjual per Provinsi',
            'date' => now()->format('d F Y'),
            'provinces' => $provinceData,
            'grandTotal' => collect($provinceData)->sum('total'),
        ];

        $pdf = Pdf::loadView('reports.seller-province-report', $data);
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('laporan-penjual-per-provinsi-' . date('Y-m-d') . '.pdf');
    }

    /**
     * SRS-MartPlace-11: Laporan daftar produk dan ratingnya yang diurutkan berdasarkan rating secara menurun
     *
     * Generate PDF report of products with ratings, sorted by rating descending
     * Includes: product name, store name, category, price, province location
     */
    public function productRatingReport()
    {
        $products = Produk::with([
            'seller.user',
            'seller.kelurahan.kecamatan.kabupatenKota.provinsi',
            'kategori',
            'reviews'
        ])
            ->withCount('reviews')
            ->get()
            ->filter(function ($product) {
                return $product->reviews_count > 0;
            })
            ->map(function ($product) {
                $avgRating = $product->reviews->avg('rating');

                return [
                    'nama_produk' => $product->nama_produk,
                    'nama_toko' => $product->seller->nama_toko ?? '-',
                    'kategori' => $product->kategori->nama_kategori ?? '-',
                    'harga' => $product->harga,
                    'provinsi' => $product->seller->kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi ?? '-',
                    'rating' => round($avgRating, 1),
                    'jumlah_review' => $product->reviews_count,
                    'stok' => $product->stok,
                ];
            })
            ->sortByDesc('rating')
            ->values();

        // Statistics
        $totalProducts = $products->count();
        $averageRating = $products->avg('rating');
        $highestRating = $products->max('rating');
        $lowestRating = $products->min('rating');

        $data = [
            'title' => 'Laporan Produk Berdasarkan Rating',
            'date' => now()->format('d F Y'),
            'products' => $products,
            'totalProducts' => $totalProducts,
            'averageRating' => round($averageRating, 1),
            'highestRating' => $highestRating,
            'lowestRating' => $lowestRating,
        ];

        $pdf = Pdf::loadView('reports.product-rating-report', $data);
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('laporan-produk-rating-' . date('Y-m-d') . '.pdf');
    }
}
