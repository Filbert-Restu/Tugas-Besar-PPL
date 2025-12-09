<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akun Suspended</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 40px 30px; text-align: center;">
                            <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Akun Anda Disuspend</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Halo <strong>{{ $seller->user->name }}</strong>,
                            </p>
                            
                            <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Kami informasikan bahwa akun penjual Anda <strong>{{ $seller->nama_toko }}</strong> telah disuspend oleh admin platform.
                            </p>

                            @if($reason)
                            <!-- Reason Box -->
                            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #991b1b; font-weight: bold; margin: 0 0 10px; font-size: 14px;">
                                    📋 Alasan Suspend:
                                </p>
                                <p style="color: #7f1d1d; margin: 0; font-size: 15px; line-height: 1.6;">
                                    {{ $reason }}
                                </p>
                            </div>
                            @endif

                            <!-- Impact Info -->
                            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #78350f; font-weight: bold; margin: 0 0 10px; font-size: 14px;">
                                    ⚠️ Dampak Suspend:
                                </p>
                                <ul style="color: #78350f; margin: 10px 0 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                                    <li>Anda tidak dapat login ke akun penjual</li>
                                    <li>Produk Anda tidak akan ditampilkan di marketplace</li>
                                    <li>Anda tidak dapat menerima pesanan baru</li>
                                    <li>Akses ke dashboard penjual dinonaktifkan</li>
                                </ul>
                            </div>

                            <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 30px 0 20px;">
                                Jika Anda merasa ini adalah kesalahan atau ingin mengajukan banding, silakan hubungi tim support kami.
                            </p>

                            <!-- Contact Support -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="mailto:support@martplace.com" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                    Hubungi Support
                                </a>
                            </div>
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
