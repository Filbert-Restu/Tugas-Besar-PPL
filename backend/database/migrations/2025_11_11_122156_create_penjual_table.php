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
            $table->string('nomor_telepon', 20);
            $table->foreignId('kelurahan_id');
            $table->char('RT', 3);
            $table->char('RW', 3);
            $table->string('detail_alamat');
            $table->string('no_ktp');
            $table->string('foto_penjual')->nullable();
            $table->string('foto_ktp')->nullable();
            $table->enum('status', ['verified', 'pending', 'rejected'])->default('pending');
            $table->boolean('is_active')->default(true);
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
