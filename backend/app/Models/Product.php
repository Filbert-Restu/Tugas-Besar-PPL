<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Kolom yang boleh diisi secara massal (Mass Assignment)
    protected $fillable = [
        'seller_id',
        'category_id',
        'name',
        'description',
        'price',
        'stock',
        'image_url',
    ];

    /**
     * Relasi: Produk dimiliki oleh satu Penjual (Seller)
     * Digunakan di controller: Product::with('seller')
     */
    public function seller()
    {
        return $this->belongsTo(Seller::class, 'seller_id');
    }

    /**
     * Relasi: Produk termasuk dalam satu Kategori
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Relasi: Produk memiliki banyak Review
     */
    public function reviews()
    {
        return $this->hasMany(Review::class, 'product_id');
    }

    /**
     * Accessor Opsional: Untuk mengambil rata-rata rating secara instan
     * Cara pakai: $product->rating_avg
     */
    public function getRatingAvgAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }
}