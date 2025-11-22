<?php

namespace App\Mail;

use App\Models\Seller;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SellerRejected extends Mailable
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
            subject: 'Maaf, toko anda tidak disetujui',
        );
    }

    public function content(): Content
    {
        // Kita pakai view simple text dulu agar tidak perlu buat file blade
        return new Content(
            htmlString: '
                <h1>Halo, ' . $this->seller->nama_toko . '!</h1>
                <p>Maaf, Akun toko anda tidak lolos verifikasi platform</p>
                <p>Anda bisa mencoba lagi</p>
                <br>
                <p>Terima kasih,<br>Tim Symmetry</p>
            '
        );
    }
}