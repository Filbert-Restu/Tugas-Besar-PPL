<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pendaftaran Penjual Ditolak</title>
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
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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
            color: #e74c3c;
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
            border-left: 4px solid #e74c3c;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .info-box strong {
            color: #e74c3c;
            display: block;
            margin-bottom: 5px;
        }
        .reason-box {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .reason-box strong {
            color: #856404;
            display: block;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .reason-box p {
            color: #856404;
            margin: 0;
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
        .requirements {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
        }
        .requirements h3 {
            color: #667eea;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .requirements ul {
            margin: 0;
            padding-left: 20px;
        }
        .requirements li {
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
        .rejected-badge {
            display: inline-block;
            background-color: #dc3545;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin: 10px 0;
        }
        .contact-box {
            background-color: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .contact-box strong {
            color: #1976D2;
            display: block;
            margin-bottom: 8px;
        }
        .contact-box p {
            margin: 5px 0;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">❌</div>
            <h1>Pemberitahuan Penting</h1>
        </div>

        <div class="content">
            <h2>Pendaftaran Penjual Anda Ditolak</h2>

            <p>Halo <strong>{{ $seller->user->name }}</strong>,</p>

            <p>Terima kasih atas minat Anda untuk bergabung sebagai penjual di platform kami. Namun, setelah melakukan peninjauan, kami harus memberitahukan bahwa pendaftaran Anda tidak dapat disetujui saat ini.</p>

            <div class="info-box">
                <strong>Informasi Pendaftaran:</strong>
                <p style="margin: 5px 0;">Nama Toko: <strong>{{ $seller->nama_toko }}</strong></p>
                <p style="margin: 5px 0;">Email: <strong>{{ $seller->user->email }}</strong></p>
                <p style="margin: 5px 0;">Status: <span class="rejected-badge">DITOLAK</span></p>
            </div>

            @if($reason)
            <div class="reason-box">
                <strong>📋 Alasan Penolakan:</strong>
                <p>{{ $reason }}</p>
            </div>
            @endif

            <div class="requirements">
                <h3>📌 Persyaratan Pendaftaran Penjual:</h3>
                <ul>
                    <li>Foto KTP yang jelas dan sesuai dengan data yang didaftarkan</li>
                    <li>Foto profil penjual yang profesional</li>
                    <li>Data toko yang lengkap dan akurat (nama, deskripsi, alamat)</li>
                    <li>Nomor telepon yang valid dan dapat dihubungi</li>
                    <li>Alamat lengkap sesuai dengan KTP atau domisili usaha</li>
                    <li>Nomor KTP yang valid dan terdaftar</li>
                </ul>
            </div>

            <p><strong>Anda dapat mendaftar kembali</strong> setelah memastikan semua persyaratan di atas terpenuhi dengan baik.</p>

            <center>
                <a href="{{ config('app.frontend_url') }}/seller/register" class="button">
                    Daftar Ulang
                </a>
            </center>

            <div class="contact-box">
                <strong>💬 Butuh Bantuan?</strong>
                <p>Jika Anda memiliki pertanyaan atau membutuhkan klarifikasi lebih lanjut mengenai penolakan ini, silakan hubungi customer support kami.</p>
                <p style="margin-top: 10px;">
                    <strong>Email:</strong> support@{{ config('app.domain', 'example.com') }}<br>
                    <strong>Jam Operasional:</strong> Senin - Jumat, 09:00 - 17:00 WIB
                </p>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #777;">
                Kami menghargai minat Anda dan berharap dapat bekerja sama dengan Anda di masa mendatang setelah persyaratan terpenuhi.
            </p>
        </div>

        <div class="footer">
            <p><strong>{{ config('app.name') }}</strong></p>
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>Untuk pertanyaan, silakan hubungi customer support kami.</p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
