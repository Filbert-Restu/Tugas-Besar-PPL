<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penjual', function (Blueprint $table) {
            $table->foreignId('user_id')->primary()->constrained('users')->onDelete('cascade');

            $table->string('nama_toko');
            $table->text('deskripsi_singkat')->nullable();
            $table->string('nomor_telepon');
            $table->string('alamat');
            $table->char('RT', 3);
            $table->char('RW', 3);
            $table->string('nama_kelurahan');
            $table->string('nama_kabupaten_kota');
            $table->string('nama_provinsi');
            $table->string('no_ktp');
            $table->string('foto_penjual');
            $table->string('foto_ktp');
            $table->enum('status_verifikasi', ['terverifikasi', 'belum_terverifikasi', 'ditolak'])->default('belum_terverifikasi');
            $table->foreignId('lokasi_id')->constrained('lokasi')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penjual');
    }
};
