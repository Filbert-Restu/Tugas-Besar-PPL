<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WilayahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert Provinsi
        $provinsiJabar = DB::table('provinsi')->insertGetId([
            'nama_provinsi' => 'Jawa Barat',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert Kabupaten/Kota
        $kotaBandung = DB::table('kabupaten_kota')->insertGetId([
            'nama_kabupaten_kota' => 'Kota Bandung',
            'provinsi_id' => $provinsiJabar,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $kabBandung = DB::table('kabupaten_kota')->insertGetId([
            'nama_kabupaten_kota' => 'Kabupaten Bandung',
            'provinsi_id' => $provinsiJabar,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert Kecamatan untuk Kota Bandung
        $kecCoblong = DB::table('kecamatan')->insertGetId([
            'nama_kecamatan' => 'Coblong',
            'kabupaten_kota_id' => $kotaBandung,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $kecSukajadi = DB::table('kecamatan')->insertGetId([
            'nama_kecamatan' => 'Sukajadi',
            'kabupaten_kota_id' => $kotaBandung,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $kecCicendo = DB::table('kecamatan')->insertGetId([
            'nama_kecamatan' => 'Cicendo',
            'kabupaten_kota_id' => $kotaBandung,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert Kelurahan untuk Coblong
        DB::table('kelurahan')->insert([
            [
                'nama_kelurahan' => 'Lebak Gede',
                'kecamatan_id' => $kecCoblong,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_kelurahan' => 'Cipaganti',
                'kecamatan_id' => $kecCoblong,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Insert Kelurahan untuk Sukajadi
        DB::table('kelurahan')->insert([
            [
                'nama_kelurahan' => 'Sukajadi',
                'kecamatan_id' => $kecSukajadi,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_kelurahan' => 'Sukagalih',
                'kecamatan_id' => $kecSukajadi,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Insert Kelurahan untuk Cicendo
        DB::table('kelurahan')->insert([
            [
                'nama_kelurahan' => 'Pasirkaliki',
                'kecamatan_id' => $kecCicendo,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_kelurahan' => 'Sukaraja',
                'kecamatan_id' => $kecCicendo,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Insert Lokasi (untuk backward compatibility dengan tabel penjual)
        DB::table('lokasi')->insert([
            ['nama_lokasi' => 'Bandung Pusat', 'created_at' => now(), 'updated_at' => now()],
            ['nama_lokasi' => 'Bandung Utara', 'created_at' => now(), 'updated_at' => now()],
            ['nama_lokasi' => 'Bandung Selatan', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
