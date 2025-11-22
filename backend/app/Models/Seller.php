<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // Ubah ke Authenticatable agar bisa login
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Jika pakai Sanctum

class Seller extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Kolom yang boleh diisi massal (Sesuai database Anda)
    protected $fillable = [
        'nama_toko', 'deskripsi_singkat', 'nama_pic', 'no_handphone_pic', 
        'email_pic', 'password', 'alamat_jalan', 'kabupaten_kota', 'propinsi',
        'no_ktp_pic', 'foto_pic_url', 'file_ktp_url', 
        'is_active', 'verification_status', 'rejection_reason', 'verified_at'
    ];

    // Sembunyikan password saat return JSON
    protected $hidden = [
        'password',
    ];

    // Casting tipe data
    protected $casts = [
        'is_active' => 'boolean',
        'registered_at' => 'datetime',
        'verified_at' => 'datetime',
    ];
}