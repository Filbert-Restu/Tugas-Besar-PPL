<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemberitahuan Pendaftaran Penjual</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f44336;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #f44336;
            margin: 0;
            font-size: 24px;
        }
        .warning-icon {
            font-size: 48px;
            color: #f44336;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
        }
        .info-box h3 {
            margin-top: 0;
            color: #2196F3;
        }
        .reason-box {
            background-color: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 20px 0;
        }
        .reason-box h3 {
            margin-top: 0;
            color: #ff9800;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2196F3;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #0b7dda;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        ul {
            padding-left: 20px;
        }
        ul li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="warning-icon">⚠</div>
            <h1>Pemberitahuan Pendaftaran Penjual</h1>
        </div>

        <div class="content">
            <p>Halo <strong>{{ $seller->user->name }}</strong>,</p>

            <p>Terima kasih telah mendaftar sebagai penjual di platform kami. Setelah melakukan review terhadap pendaftaran Anda, kami mohon maaf untuk memberitahukan bahwa pendaftaran toko Anda <strong>belum dapat disetujui</strong> saat ini.</p>

            <div class="info-box">
                <h3>Informasi Pendaftaran:</h3>
                <p><strong>Nama Toko:</strong> {{ $seller->nama_toko }}</p>
                <p><strong>Status:</strong> <span style="color: #f44336; font-weight: bold;">Tidak Disetujui</span></p>
            </div>

            @if($reason)
            <div class="reason-box">
                <h3>Alasan Penolakan:</h3>
                <p>{{ $reason }}</p>
            </div>
            @endif

            <p><strong>Apa yang bisa Anda lakukan?</strong></p>
            <ul>
                <li>Periksa kembali kelengkapan dokumen yang telah Anda upload</li>
                <li>Pastikan foto KTP dan foto profil terlihat jelas</li>
                <li>Verifikasi bahwa semua informasi yang diberikan akurat</li>
                <li>Perbaiki data sesuai dengan alasan penolakan di atas</li>
                <li>Daftar kembali dengan data yang telah diperbaiki</li>
            </ul>

            <p><strong>Persyaratan Pendaftaran:</strong></p>
            <ul>
                <li>Data diri lengkap dan sesuai KTP</li>
                <li>Foto KTP yang jelas dan dapat dibaca</li>
                <li>Foto profil yang sesuai (bukan logo atau gambar lain)</li>
                <li>Alamat toko yang valid dan detail</li>
                <li>Nomor telepon yang aktif</li>
                <li>Email yang valid dan dapat dihubungi</li>
            </ul>

            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}/seller/register" class="button">
                    Daftar Ulang
                </a>
            </div>

            <p>Kami sangat menghargai minat Anda untuk bergabung dengan platform kami. Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut, silakan hubungi tim support kami melalui email atau live chat.</p>

            <p>
                Salam,<br>
                <strong>Tim Admin MartPlace</strong>
            </p>
        </div>

        <div class="footer">
            <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
            <p>Jika Anda memiliki pertanyaan, hubungi kami di: support@martplace.com</p>
            <p>&copy; {{ date('Y') }} MartPlace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
