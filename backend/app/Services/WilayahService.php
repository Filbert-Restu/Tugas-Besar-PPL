<?php

namespace App\Services;

use App\Models\Provinsi;
use App\Models\KabupatenKota;
use App\Models\Kecamatan;
use App\Models\Kelurahan;

class WilayahService
{
    /**
     * Cari atau buat wilayah lengkap dan return kelurahan_id
     *
     * @param string $namaProvinsi
     * @param string $namaKabupatenKota
     * @param string $namaKecamatan
     * @param string $namaKelurahan
     * @return int kelurahan_id
     */
    public function findOrCreateKelurahan(
        string $namaProvinsi,
        string $namaKabupatenKota,
        string $namaKecamatan,
        string $namaKelurahan
    ): int {
        // 1. Cari atau buat Provinsi
        $provinsi = Provinsi::firstOrCreate(
            ['nama_provinsi' => $namaProvinsi],
            ['nama_provinsi' => $namaProvinsi]
        );

        // 2. Cari atau buat Kabupaten/Kota
        $kabupatenKota = KabupatenKota::firstOrCreate(
            [
                'nama_kabupaten_kota' => $namaKabupatenKota,
                'provinsi_id' => $provinsi->id
            ],
            [
                'nama_kabupaten_kota' => $namaKabupatenKota,
                'provinsi_id' => $provinsi->id
            ]
        );

        // 3. Cari atau buat Kecamatan
        $kecamatan = Kecamatan::firstOrCreate(
            [
                'nama_kecamatan' => $namaKecamatan,
                'kabupaten_kota_id' => $kabupatenKota->id
            ],
            [
                'nama_kecamatan' => $namaKecamatan,
                'kabupaten_kota_id' => $kabupatenKota->id
            ]
        );

        // 4. Cari atau buat Kelurahan
        $kelurahan = Kelurahan::firstOrCreate(
            [
                'nama_kelurahan' => $namaKelurahan,
                'kecamatan_id' => $kecamatan->id
            ],
            [
                'nama_kelurahan' => $namaKelurahan,
                'kecamatan_id' => $kecamatan->id
            ]
        );

        return $kelurahan->id;
    }
}
