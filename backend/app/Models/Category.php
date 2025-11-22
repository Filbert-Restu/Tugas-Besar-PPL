<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'parent_id'];

    /**
     * Relasi: Sebuah kategori bisa memiliki satu induk (Parent).
     * Contoh: 'Headphone' induknya 'Audio'.
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Relasi: Sebuah kategori bisa memiliki banyak anak (Children).
     * Contoh: 'Audio' punya anak ['Headphone', 'Speaker'].
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Relasi: Kategori memiliki banyak produk.
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}