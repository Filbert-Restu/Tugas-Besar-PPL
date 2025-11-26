<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelurahan extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kelurahan';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_kelurahan',
        'kecamatan_id',
    ];

    /**
     * Get the kecamatan that owns the kelurahan.
     */
    public function kecamatan(): BelongsTo
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id');
    }

    /**
     * Get the sellers in this kelurahan.
     */
    public function sellers(): HasMany
    {
        return $this->hasMany(Seller::class, 'kelurahan_id');
    }
}
