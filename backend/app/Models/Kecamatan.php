<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kecamatan extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kecamatan';

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
        'nama_kecamatan',
        'kabupaten_kota_id',
    ];

    /**
     * Get the kabupaten/kota that owns the kecamatan.
     */
    public function kabupatenKota(): BelongsTo
    {
        return $this->belongsTo(KabupatenKota::class, 'kabupaten_kota_id');
    }

    /**
     * Get the kelurahan for the kecamatan.
     */
    public function kelurahan(): HasMany
    {
        return $this->hasMany(Kelurahan::class, 'kecamatan_id');
    }
}
