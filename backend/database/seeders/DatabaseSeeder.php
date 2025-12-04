<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Seller;
use App\Models\Provinsi;
use App\Models\KabupatenKota;
use App\Models\Kecamatan;
use App\Models\Kelurahan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // 2. Create wilayah data for seller
        $provinsi = Provinsi::firstOrCreate([
            'nama_provinsi' => 'Jawa Barat'
        ]);

        $kabupaten = KabupatenKota::firstOrCreate([
            'provinsi_id' => $provinsi->id,
            'nama_kabupaten_kota' => 'Kota Bandung'
        ]);

        $kecamatan = Kecamatan::firstOrCreate([
            'kabupaten_kota_id' => $kabupaten->id,
            'nama_kecamatan' => 'Coblong'
        ]);

        $kelurahan = Kelurahan::firstOrCreate([
            'kecamatan_id' => $kecamatan->id,
            'nama_kelurahan' => 'Lebak Gede'
        ]);

        // 3. Create seller user
        $sellerUser = User::create([
            'name' => 'Budi Santoso',
            'email' => 'seller@example.com',
            'password' => bcrypt('password'),
            'role' => 'penjual',
        ]);

        // 4. Create seller profile
        Seller::create([
            'user_id' => $sellerUser->id,
            'nama_toko' => 'Toko Budi Elektronik',
            'deskripsi_singkat' => 'Toko elektronik terpercaya dengan harga kompetitif',
            'nomor_telepon' => '081234567890',
            'kelurahan_id' => $kelurahan->id,
            'RT' => '001',
            'RW' => '005',
            'detail_alamat' => 'Jl. Dipatiukur No. 35, dekat kampus ITB',
            'no_ktp' => '3273051234567890',
            'foto_penjual' => null,
            'foto_ktp' => null,
            'status' => 'verified', // Already verified for testing
        ]);

        // 3. Create seller user
        $sellerUser1 = User::create([
            'name' => 'Yaya budi',
            'email' => 'seller1@example.com',
            'password' => bcrypt('password'),
            'role' => 'penjual',
        ]);

        // 4. Create seller profile
        Seller::create([
            'user_id' => $sellerUser1->id,
            'nama_toko' => 'Toko anjay',
            'deskripsi_singkat' => 'Toko elektronik terpercaya dengan harga eceran',
            'nomor_telepon' => '081928374637',
            'kelurahan_id' => $kelurahan->id,
            'RT' => '005',
            'RW' => '007',
            'detail_alamat' => 'Jl. BILINGAN, ga di kampus ITB',
            'no_ktp' => '3267474673647873',
            'foto_penjual' => null,
            'foto_ktp' => null,
            'status' => 'pending', // pending for testing
        ]);

        // 5. Call other seeders
        $this->call([
            TokoProductSeeder::class,
        ]);
    }
}
