<?php

namespace App\Mail;

use App\Models\Seller;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SellerApproved extends Mailable
{
    use Queueable, SerializesModels;

    public $seller;

    public function __construct(Seller $seller)
    {
        $this->seller = $seller;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Selamat! Toko Anda Telah Disetujui',
        );
    }

    public function content(): Content
    {
        // Kita pakai view simple text dulu agar tidak perlu buat file blade
        return new Content(
            htmlString: '
                <h1>Halo, ' . $this->seller->nama_toko . '!</h1>
                <p>Selamat, akun seller Anda telah kami verifikasi.</p>
                <p>Sekarang Anda sudah bisa login ke dashboard seller dan mulai berjualan.</p>
                <br>
                <p>Terima kasih,<br>Tim Symmetry</p>
            '
        );
    }
}