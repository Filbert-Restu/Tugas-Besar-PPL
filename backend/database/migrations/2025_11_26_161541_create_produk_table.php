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
        Schema::create('produk', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade');
            $table->string('nama_produk');
            $table->foreignId('kategori_produk_id')->constrained('kategori_produk', 'id');
            $table->text('deskripsi_produk');
            $table->decimal('harga_produk', 15, 2);
            $table->decimal('berat_produk', 10, 2);
            $table->integer('stok_produk');
            $table->string('foto_produk')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
