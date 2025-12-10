<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Produk extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'produk';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nama_produk',
        'kategori_produk_id',
        'deskripsi_produk',
        'harga_produk',
        'berat_produk',
        'stok_produk',
        'foto_produk',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'harga_produk' => 'decimal:2',
        'berat_produk' => 'decimal:2',
        'stok_produk' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['rating', 'foto_produk_url'];

    /**
     * Get the seller that owns the produk.
     * Points to Seller model, not User
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class, 'user_id', 'user_id');
    }

    /**
     * Get the user/owner that owns the produk.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the kategori that owns the produk.
     */
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriProduk::class, 'kategori_produk_id');
    }

    /**
     * Get the reviews for the product.
     */
    public function reviews()
    {
        return $this->hasMany(ProdukReviews::class, 'product_id');
    }

    /**
     * Get the foto produk URL.
     */
    public function getFotoProdukUrlAttribute(): ?string
    {
        return $this->foto_produk ? asset('storage/' . $this->foto_produk) : null;
    }

    /**
     * Get the average rating from reviews.
     */
    public function getRatingAttribute(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    /**
     * Scope a query to only include products in stock.
     */
    public function scopeInStock($query)
    {
        return $query->where('stok_produk', '>', 0);
    }

    /**
     * Scope a query to only include products out of stock.
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('stok_produk', '=', 0);
    }
}
