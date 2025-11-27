<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seller extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'penjual';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'user_id';

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nama_toko',
        'deskripsi_singkat',
        'nomor_telepon',
        'kelurahan_id',
        'RT',
        'RW',
        'detail_alamat',
        'no_ktp',
        'foto_penjual',
        'foto_ktp',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the seller profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the kelurahan (village) associated with the seller.
     */
    public function kelurahan(): BelongsTo
    {
        return $this->belongsTo(Kelurahan::class, 'kelurahan_id');
    }

    /**
     * Get the products owned by the seller.
     */
    public function produk(): HasMany
    {
        return $this->hasMany(Produk::class, 'user_id', 'user_id');
    }

    /**
     * Scope a query to only include verified sellers.
     */
    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }

    /**
     * Scope a query to only include pending sellers.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include rejected sellers.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Get the full address of the seller.
     */
    public function getFullAddressAttribute(): string
    {
        $kelurahan = $this->kelurahan;

        if (!$kelurahan) {
            return $this->detail_alamat;
        }

        return sprintf(
            '%s, RT %s/RW %s, %s, %s, %s, %s',
            $this->detail_alamat,
            $this->RT,
            $this->RW,
            $kelurahan->nama_kelurahan,
            $kelurahan->kecamatan->nama_kecamatan ?? '',
            $kelurahan->kecamatan->kabupatenKota->nama_kabupaten_kota ?? '',
            $kelurahan->kecamatan->kabupatenKota->provinsi->nama_provinsi ?? ''
        );
    }

    /**
     * Get the foto penjual URL.
     */
    public function getFotoPenjualUrlAttribute(): ?string
    {
        return $this->foto_penjual ? asset('storage/' . $this->foto_penjual) : null;
    }

    /**
     * Get the foto KTP URL.
     */
    public function getFotoKtpUrlAttribute(): ?string
    {
        return $this->foto_ktp ? asset('storage/' . $this->foto_ktp) : null;
    }
}
