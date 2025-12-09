<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akun Diaktifkan</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 40px 30px; text-align: center;">
                            <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Akun Diaktifkan Kembali!</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Halo <strong>{{ $seller->user->name }}</strong>,
                            </p>
                            
                            <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Kabar baik! Akun penjual Anda <strong>{{ $seller->nama_toko }}</strong> telah diaktifkan kembali oleh admin platform.
                            </p>

                            <!-- Success Info -->
                            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #065f46; font-weight: bold; margin: 0 0 10px; font-size: 14px;">
                                    ✅ Status Akun:
                                </p>
                                <ul style="color: #065f46; margin: 10px 0 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                                    <li>Anda dapat login kembali ke akun penjual</li>
                                    <li>Produk Anda aktif kembali di marketplace</li>
                                    <li>Anda dapat menerima pesanan baru</li>
                                    <li>Akses dashboard penjual telah dipulihkan</li>
                                </ul>
                            </div>

                            <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 30px 0 20px;">
                                Silakan login kembali untuk melanjutkan berjualan di marketplace.
                            </p>

                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{ config('app.frontend_url') }}/login" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                    Login Sekarang
                                </a>
                            </div>

                            <!-- Tips Box -->
                            <div style="background-color: #eff6ff; border: 1px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #1e40af; font-weight: bold; margin: 0 0 10px; font-size: 14px;">
                                    💡 Tips Berjualan:
                                </p>
                                <ul style="color: #1e40af; margin: 10px 0 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                                    <li>Periksa pesanan yang mungkin masuk selama suspend</li>
                                    <li>Update stok produk Anda</li>
                                    <li>Patuhi kebijakan platform untuk menghindari suspend di masa depan</li>
                                </ul>
                            </div>

                            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
                                Jika ada pertanyaan, jangan ragu untuk menghubungi tim support kami.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 10px; text-align: center;">
                                Email ini dikirim otomatis oleh sistem Martplace.
                            </p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                                © {{ date('Y') }} Martplace. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
