# Email Testing Documentation

## 📧 Sistem Email untuk Verifikasi Seller

Sistem ini mengirimkan email notifikasi kepada seller ketika admin melakukan:

1. **Approval** - Verifikasi pendaftaran seller
2. **Rejection** - Penolakan pendaftaran seller

---

## 🎯 Konfigurasi Email

### 1. Environment Variables (.env)

Tambahkan konfigurasi berikut di file `.env`:

```env
# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourapp.com
MAIL_FROM_NAME="${APP_NAME}"

# Frontend URL (untuk link di email)
APP_FRONTEND_URL=http://localhost:3000
```

### 2. Setup Gmail SMTP (Recommended untuk testing)

#### Cara mendapatkan App Password Gmail:

1. Login ke Google Account
2. Pergi ke: https://myaccount.google.com/security
3. Enable "2-Step Verification"
4. Pergi ke "App passwords"
5. Generate password untuk "Mail" application
6. Copy password dan paste ke `MAIL_PASSWORD` di .env

### 3. Alternative: Mailtrap (untuk Development)

Untuk testing tanpa mengirim email sungguhan:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
```

Daftar gratis di: https://mailtrap.io

---

## 📬 Email Templates

### 1. Seller Approved Email

- **File**: `resources/views/emails/seller-approved.blade.php`
- **Subject**: "Selamat! Akun Penjual Anda Telah Diverifikasi"
- **Konten**:
  - Ucapan selamat
  - Informasi toko (nama, status)
  - Daftar fitur yang bisa digunakan
  - Link ke dashboard seller
  - Tips untuk memulai

### 2. Seller Rejected Email

- **File**: `resources/views/emails/seller-rejected.blade.php`
- **Subject**: "Pemberitahuan: Pendaftaran Penjual Anda Ditolak"
- **Konten**:
  - Pemberitahuan penolakan
  - Alasan penolakan (jika ada)
  - Persyaratan pendaftaran
  - Link untuk daftar ulang
  - Kontak support

---

## 🧪 Testing Email

### Method 1: Menggunakan Mailtrap (Recommended)

```bash
# Setup Mailtrap di .env
# Semua email akan tertangkap di Mailtrap inbox
# Tidak ada email sungguhan yang terkirim
```

### Method 2: Menggunakan Log Driver

```env
MAIL_MAILER=log
```

Email akan ditulis ke file `storage/logs/laravel.log`

### Method 3: Test dengan Tinker

```bash
php artisan tinker
```

```php
// Test Approval Email
$seller = App\Models\Seller::first();
Mail::to($seller->user->email)->send(new App\Mail\SellerApproved($seller));

// Test Rejection Email
Mail::to($seller->user->email)->send(new App\Mail\SellerRejected($seller, 'Foto KTP tidak jelas'));
```

---

## 📡 API Endpoints

### 1. Approve Seller

```http
POST /api/admin/sellers/approve
Content-Type: application/json
Authorization: Bearer {token}

{
  "user_id": 1
}
```

**Response:**

```json
{
  "message": "Penjual berhasil diverifikasi",
  "data": {
    "user_id": 1,
    "nama_toko": "Toko ABC",
    "status": "verified",
    "updated_at": "2025-12-09T10:30:00.000000Z"
  }
}
```

**Email Action:** Mengirim email approval ke seller

---

### 2. Reject Seller

```http
POST /api/admin/sellers/reject
Content-Type: application/json
Authorization: Bearer {token}

{
  "user_id": 1,
  "reason": "Foto KTP tidak jelas dan tidak sesuai dengan data yang didaftarkan"
}
```

**Response:**

```json
{
  "message": "Penjual berhasil ditolak",
  "data": {
    "user_id": 1,
    "nama_toko": "Toko ABC",
    "status": "rejected",
    "reason": "Foto KTP tidak jelas...",
    "updated_at": "2025-12-09T10:30:00.000000Z"
  }
}
```

**Email Action:** Mengirim email rejection ke seller dengan alasan

---

## 🔧 Troubleshooting

### Email tidak terkirim

1. **Check log file**: `storage/logs/laravel.log`
2. **Verify SMTP credentials**: Test dengan Mailtrap terlebih dahulu
3. **Check firewall**: Pastikan port 587/465 tidak diblokir
4. **Gmail**: Pastikan "Less secure app access" atau gunakan App Password

### Error: "Connection could not be established"

```bash
# Test koneksi SMTP
php artisan tinker
```

```php
Mail::raw('Test email', function($message) {
    $message->to('test@example.com')
            ->subject('Test');
});
```

### Email masuk spam

- Gunakan domain email yang valid di `MAIL_FROM_ADDRESS`
- Setup SPF, DKIM, DMARC records (untuk production)
- Gunakan email service provider (SendGrid, Mailgun, dll)

---

## 📋 Checklist Production

- [ ] Setup proper SMTP service (SendGrid, Mailgun, AWS SES)
- [ ] Configure SPF/DKIM/DMARC
- [ ] Use proper from address (no-reply@yourdomain.com)
- [ ] Setup email queue untuk async sending
- [ ] Add email retry logic
- [ ] Monitor email delivery rate
- [ ] Setup email templates dengan brand colors/logo
- [ ] Add unsubscribe link (jika perlu)

---

## 🚀 Queue Email (Optional - untuk Production)

Untuk mengirim email secara asynchronous:

### 1. Update Mailable class

```php
class SellerApproved extends Mailable implements ShouldQueue
```

### 2. Setup Queue

```env
QUEUE_CONNECTION=database
```

### 3. Run migrations

```bash
php artisan queue:table
php artisan migrate
```

### 4. Run queue worker

```bash
php artisan queue:work
```

---

## 📞 Support

Jika ada masalah dengan email system:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Test dengan Mailtrap terlebih dahulu
3. Verify email configuration di `.env`
4. Check SMTP provider documentation

---

**Happy Emailing! 📧**
