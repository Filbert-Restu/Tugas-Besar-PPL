<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            
            // Akun Login
            $table->string('nama_toko');
            $table->text('deskripsi_singkat')->nullable();
            $table->string('email_pic')->unique(); // Wajib ada untuk login
            $table->string('password');            // Wajib ada untuk login
            
            // Data Diri PIC
            $table->string('nama_pic');
            $table->string('no_handphone_pic');
            
            // Alamat
            $table->string('alamat_jalan');
            $table->string('kabupaten_kota');
            $table->string('propinsi');
            
            // Dokumen (URL File)
            $table->string('no_ktp_pic');
            $table->string('foto_pic_url'); // Controller nyimpannya ke sini
            $table->string('file_ktp_url'); // Controller nyimpannya ke sini
            
            // Status Verifikasi (Default values penting!)
            $table->enum('verification_status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->boolean('is_active')->default(false); // Default false agar tidak bisa login sebelum diapprove
            $table->text('rejection_reason')->nullable();
            
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};