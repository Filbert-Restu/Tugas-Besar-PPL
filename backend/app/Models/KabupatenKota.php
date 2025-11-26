<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KabupatenKota extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kabupaten_kota';

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
        'nama_kabupaten_kota',
        'provinsi_id',
    ];

    /**
     * Get the provinsi that owns the kabupaten/kota.
     */
    public function provinsi(): BelongsTo
    {
        return $this->belongsTo(Provinsi::class, 'provinsi_id');
    }

    /**
     * Get the kecamatan for the kabupaten/kota.
     */
    public function kecamatan(): HasMany
    {
        return $this->hasMany(Kecamatan::class, 'kabupaten_kota_id');
    }
}
