<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akun Penjual Diverifikasi</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header .icon {
            font-size: 60px;
            margin-bottom: 10px;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #667eea;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .content p {
            margin-bottom: 15px;
            font-size: 16px;
            color: #555;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .info-box strong {
            color: #667eea;
            display: block;
            margin-bottom: 5px;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .features {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
        }
        .features h3 {
            color: #667eea;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .features ul {
            margin: 0;
            padding-left: 20px;
        }
        .features li {
            margin-bottom: 10px;
            color: #555;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 5px 0;
        }
        .success-badge {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">✅</div>
            <h1>Selamat!</h1>
        </div>

        <div class="content">
            <h2>Akun Penjual Anda Telah Diverifikasi</h2>

            <p>Halo <strong>{{ $seller->user->name }}</strong>,</p>

            <p>Kami dengan senang hati memberitahukan bahwa akun penjual Anda telah berhasil diverifikasi oleh tim admin kami.</p>

            <div class="info-box">
                <strong>Informasi Toko:</strong>
                <p style="margin: 5px 0;">Nama Toko: <strong>{{ $seller->nama_toko }}</strong></p>
                <p style="margin: 5px 0;">Status: <span class="success-badge">VERIFIED</span></p>
            </div>

            <p>Sekarang Anda dapat mengakses semua fitur seller dan mulai berjualan di platform kami!</p>

            <div class="features">
                <h3>🎉 Apa yang Bisa Anda Lakukan Sekarang:</h3>
                <ul>
                    <li>✅ Menambahkan dan mengelola produk</li>
                    <li>✅ Mengatur stok dan harga produk</li>
                    <li>✅ Melihat statistik penjualan</li>
                    <li>✅ Mengunduh laporan stok dalam format PDF</li>
                    <li>✅ Mengelola profil toko Anda</li>
                    <li>✅ Memantau review produk</li>
                </ul>
            </div>

            <center>
                <a href="{{ config('app.frontend_url') }}/login" class="button">
                    Login ke Dashboard Penjual
                </a>
            </center>

            <p style="margin-top: 30px; font-size: 14px; color: #777;">
                <strong>Tips untuk memulai:</strong><br>
                Mulailah dengan menambahkan produk pertama Anda, pastikan foto produk berkualitas baik dan deskripsi lengkap untuk menarik lebih banyak pembeli.
            </p>
        </div>

        <div class="footer">
            <p><strong>{{ config('app.name') }}</strong></p>
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>Jika Anda memiliki pertanyaan, silakan hubungi customer support kami.</p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
