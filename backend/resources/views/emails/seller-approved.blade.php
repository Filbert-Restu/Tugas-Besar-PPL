<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akun Penjual Diverifikasi</title>
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
            border-bottom: 2px solid #4CAF50;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #4CAF50;
            margin: 0;
            font-size: 24px;
        }
        .success-icon {
            font-size: 48px;
            color: #4CAF50;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #4CAF50;
            padding: 15px;
            margin: 20px 0;
        }
        .info-box h3 {
            margin-top: 0;
            color: #4CAF50;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #45a049;
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
            <div class="success-icon">✓</div>
            <h1>Selamat! Akun Anda Telah Diverifikasi</h1>
        </div>

        <div class="content">
            <p>Halo <strong>{{ $seller->user->name }}</strong>,</p>

            <p>Kami dengan senang hati memberitahukan bahwa akun penjual Anda telah berhasil diverifikasi oleh tim admin kami!</p>

            <div class="info-box">
                <h3>Informasi Toko Anda:</h3>
                <p><strong>Nama Toko:</strong> {{ $seller->nama_toko }}</p>
                <p><strong>Status:</strong> <span style="color: #4CAF50; font-weight: bold;">Terverifikasi ✓</span></p>
            </div>

            <p><strong>Apa yang bisa Anda lakukan sekarang?</strong></p>
            <ul>
                <li>Login ke akun Anda menggunakan email dan password yang telah didaftarkan</li>
                <li>Mulai menambahkan produk ke toko Anda</li>
                <li>Kelola inventori dan harga produk</li>
                <li>Menerima dan memproses pesanan dari pembeli</li>
                <li>Memantau performa toko melalui dashboard penjual</li>
            </ul>

            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}/login" class="button">
                    Login Sekarang
                </a>
            </div>

            <p><strong>Tips untuk memulai:</strong></p>
            <ul>
                <li>Lengkapi profil toko Anda dengan foto dan deskripsi yang menarik</li>
                <li>Upload foto produk yang berkualitas baik</li>
                <li>Berikan deskripsi produk yang detail dan jelas</li>
                <li>Set harga yang kompetitif</li>
                <li>Respon cepat terhadap pertanyaan dan pesanan pelanggan</li>
            </ul>

            <p>Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi tim support kami.</p>

            <p>Selamat berjualan dan sukses untuk bisnis Anda!</p>

            <p>
                Salam,<br>
                <strong>Tim Admin MartPlace</strong>
            </p>
        </div>

        <div class="footer">
            <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
            <p>&copy; {{ date('Y') }} MartPlace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
