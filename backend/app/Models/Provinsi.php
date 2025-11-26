<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provinsi extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'provinsi';

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
        'nama_provinsi',
    ];

    /**
     * Get the kabupaten/kota for the provinsi.
     */
    public function kabupatenKota(): HasMany
    {
        return $this->hasMany(KabupatenKota::class, 'provinsi_id');
    }
}
