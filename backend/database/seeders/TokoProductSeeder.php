<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Seller;
use App\Models\Produk;
use App\Models\KategoriProduk;
use App\Models\Provinsi;
use App\Models\KabupatenKota;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use Illuminate\Support\Facades\Hash;

class TokoProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seeder ini membuat:
     * - 1 User (penjual)
     * - 1 Seller (toko) dengan alamat lengkap
     * - 3 Kategori produk
     * - 10 Produk dengan berbagai kategori
     */
    public function run(): void
    {
        // 1. Buat atau ambil wilayah (Provinsi -> Kabupaten -> Kecamatan -> Kelurahan)
        $provinsi = Provinsi::firstOrCreate(
            ['nama_provinsi' => 'Jawa Barat']
        );

        $kabupaten = KabupatenKota::firstOrCreate(
            ['provinsi_id' => $provinsi->id],
            ['nama_kabupaten_kota' => 'Kota Bandung']
        );

        $kecamatan = Kecamatan::firstOrCreate(
            ['kabupaten_kota_id' => $kabupaten->id],
            ['nama_kecamatan' => 'Coblong']
        );

        $kelurahan = Kelurahan::firstOrCreate(
            ['kecamatan_id' => $kecamatan->id],
            ['nama_kelurahan' => 'Cipaganti']
        );

        // 2. Buat User untuk seller
        $user = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budisantoso@tokoelektronik.com',
            'password' => Hash::make('password123'),
            'role' => 'penjual',
        ]);

        // 3. Buat Seller (Toko)
        $seller = Seller::create([
            'user_id' => $user->id,
            'nama_toko' => 'Toko Elektronik Bandung',
            'deskripsi_singkat' => 'Toko elektronik terpercaya sejak 2015. Menjual berbagai peralatan elektronik, gadget, dan aksesoris dengan harga terjangkau.',
            'nomor_telepon' => '081234567890',
            'kelurahan_id' => $kelurahan->id,
            'RT' => '005',
            'RW' => '012',
            'detail_alamat' => 'Jl. Cipaganti No. 123',
            'no_ktp' => '3273012345678901',
            'foto_penjual' => null, // Set null atau path jika ada
            'foto_ktp' => null, // Set null atau path jika ada
            'status' => 'verified', // Toko sudah terverifikasi
        ]);

        // 4. Buat atau ambil Kategori Produk
        $kategoriElektronik = KategoriProduk::firstOrCreate(
            ['nama_kategori' => 'Elektronik']
        );

        $kategoriAksesoris = KategoriProduk::firstOrCreate(
            ['nama_kategori' => 'Aksesoris']
        );

        $kategoriKomputer = KategoriProduk::firstOrCreate(
            ['nama_kategori' => 'Komputer & Laptop']
        );

        // 5. Buat Produk-produk
        $products = [
            // Produk Elektronik
            [
                'nama_produk' => 'Smartphone Samsung Galaxy A54',
                'kategori_produk_id' => $kategoriElektronik->id,
                'deskripsi_produk' => 'Smartphone Android dengan layar Super AMOLED 6.4 inch, kamera 50MP, RAM 8GB, internal 256GB. Kondisi baru dan bergaransi resmi.',
                'harga_produk' => 4999000,
                'berat_produk' => 250,
                'stok_produk' => 15,
            ],
            [
                'nama_produk' => 'Smart TV LED 43 Inch Samsung',
                'kategori_produk_id' => $kategoriElektronik->id,
                'deskripsi_produk' => 'Smart TV LED 43 inch dengan resolusi Full HD, dilengkapi WiFi, Netflix, YouTube, dan berbagai aplikasi streaming lainnya.',
                'harga_produk' => 3499000,
                'berat_produk' => 8500,
                'stok_produk' => 8,
            ],
            [
                'nama_produk' => 'Rice Cooker Digital Cosmos 1.8L',
                'kategori_produk_id' => $kategoriElektronik->id,
                'deskripsi_produk' => 'Rice cooker digital dengan kapasitas 1.8 liter, 8 menu masak otomatis, inner pot anti lengket, hemat listrik.',
                'harga_produk' => 450000,
                'berat_produk' => 2500,
                'stok_produk' => 25,
            ],
            [
                'nama_produk' => 'Blender Philips HR2157',
                'kategori_produk_id' => $kategoriElektronik->id,
                'deskripsi_produk' => 'Blender 2 liter dengan 6 kecepatan, pisau stainless steel yang tajam dan tahan lama, cocok untuk jus dan smoothie.',
                'harga_produk' => 550000,
                'berat_produk' => 3200,
                'stok_produk' => 18,
            ],

            // Produk Aksesoris
            [
                'nama_produk' => 'Powerbank Xiaomi 20000mAh',
                'kategori_produk_id' => $kategoriAksesoris->id,
                'deskripsi_produk' => 'Powerbank kapasitas 20000mAh dengan fast charging 18W, dual USB output, LED indicator, slim design.',
                'harga_produk' => 275000,
                'berat_produk' => 450,
                'stok_produk' => 35,
            ],
            [
                'nama_produk' => 'Earphone TWS Wireless Bluetooth',
                'kategori_produk_id' => $kategoriAksesoris->id,
                'deskripsi_produk' => 'Earphone TWS dengan Bluetooth 5.0, noise cancellation, charging case, baterai tahan 24 jam, touch control.',
                'harga_produk' => 185000,
                'berat_produk' => 120,
                'stok_produk' => 42,
            ],
            [
                'nama_produk' => 'Kabel Data USB Type-C Fast Charging 3A',
                'kategori_produk_id' => $kategoriAksesoris->id,
                'deskripsi_produk' => 'Kabel data USB Type-C panjang 1 meter, fast charging 3A, nylon braided, tahan lama dan tidak mudah kusut.',
                'harga_produk' => 35000,
                'berat_produk' => 50,
                'stok_produk' => 100,
            ],

            // Produk Komputer & Laptop
            [
                'nama_produk' => 'Laptop ASUS VivoBook 14 Intel Core i5',
                'kategori_produk_id' => $kategoriKomputer->id,
                'deskripsi_produk' => 'Laptop ASUS dengan Intel Core i5 Gen 11, RAM 8GB DDR4, SSD 512GB, layar 14 inch FHD, Windows 11 original.',
                'harga_produk' => 7999000,
                'berat_produk' => 1800,
                'stok_produk' => 6,
            ],
            [
                'nama_produk' => 'Mouse Wireless Logitech M221',
                'kategori_produk_id' => $kategoriKomputer->id,
                'deskripsi_produk' => 'Mouse wireless dengan sensor akurat, ergonomis, baterai tahan 18 bulan, silent click, cocok untuk kerja dan gaming ringan.',
                'harga_produk' => 125000,
                'berat_produk' => 180,
                'stok_produk' => 55,
            ],
            [
                'nama_produk' => 'Keyboard Gaming Mechanical RGB',
                'kategori_produk_id' => $kategoriKomputer->id,
                'deskripsi_produk' => 'Keyboard mechanical dengan switch blue, RGB backlight full color, anti-ghosting, tahan lama untuk gaming dan typing.',
                'harga_produk' => 450000,
                'berat_produk' => 850,
                'stok_produk' => 12,
            ],
        ];

        // Insert semua produk
        foreach ($products as $productData) {
            Produk::create([
                'user_id' => $user->id, // Owner produk
                'nama_produk' => $productData['nama_produk'],
                'kategori_produk_id' => $productData['kategori_produk_id'],
                'deskripsi_produk' => $productData['deskripsi_produk'],
                'harga_produk' => $productData['harga_produk'],
                'berat_produk' => $productData['berat_produk'],
                'stok_produk' => $productData['stok_produk'],
                'foto_produk' => null, // Set null atau path jika ada foto
            ]);
        }

        $this->command->info('✅ Seeder berhasil: 1 toko dengan 10 produk telah dibuat!');
        $this->command->info("📧 Email: {$user->email}");
        $this->command->info("🔑 Password: password123");
        $this->command->info("🏪 Nama Toko: {$seller->nama_toko}");
        $this->command->info("📍 Lokasi: {$kelurahan->nama_kelurahan}, {$kecamatan->nama_kecamatan}, {$kabupaten->nama_kabupaten_kota}");
    }
}

