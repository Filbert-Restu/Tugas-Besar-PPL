<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdukReviews extends Model
{
    protected $table = 'product_reviews';

    protected $fillable = [
        'product_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Produk::class, 'product_id');
    }
}
