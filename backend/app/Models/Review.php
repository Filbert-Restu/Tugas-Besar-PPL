<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    // Kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'product_id',
        'visitor_name',
        'visitor_phone',
        'visitor_email',
        'rating',
        'comment',
    ];

    /**
     * Relasi: Review dimiliki oleh satu Produk.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}