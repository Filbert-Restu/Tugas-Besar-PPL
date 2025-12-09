# 📧 Setup Gmail SMTP untuk Mengirim Email Verifikasi

## ❌ Masalah Saat Ini

Email tidak terkirim karena konfigurasi di `.env` menggunakan:
```env
MAIL_MAILER=log
```

Ini artinya email hanya ditulis ke file log (`backend/storage/logs/laravel.log`), **TIDAK dikirim ke Gmail sungguhan**.

---

## ✅ Solusi: Setup Gmail SMTP

### Langkah 1: Generate App Password di Gmail

Google tidak mengizinkan login dengan password biasa untuk aplikasi eksternal. Anda harus membuat **App Password** khusus.

#### 1.1. Aktifkan 2-Step Verification
1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Scroll ke **"2-Step Verification"**
3. Klik dan aktifkan jika belum aktif

#### 1.2. Generate App Password
1. Buka [App Passwords](https://myaccount.google.com/apppasswords)
2. Pilih **"Select app"** → **"Mail"**
3. Pilih **"Select device"** → **"Other (Custom name)"**
4. Ketik nama: **"Laravel Martplace"**
5. Klik **"Generate"**
6. **COPY password yang muncul** (16 karakter tanpa spasi)
   - Contoh: `abcd efgh ijkl mnop`
   - Simpan password ini, akan digunakan di `.env`

---

### Langkah 2: Update File `.env`

Buka file `/Users/gabrielprakosaardhi/Tugas-Besar-PPL/backend/.env` dan ubah bagian `MAIL_*`:

```env
# Ganti dari log ke smtp
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=emailanda@gmail.com          # ← Ganti dengan Gmail Anda
MAIL_PASSWORD=abcdefghijklmnop             # ← Ganti dengan App Password (16 karakter, tanpa spasi)
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=emailanda@gmail.com      # ← Ganti dengan Gmail Anda
MAIL_FROM_NAME="Martplace Admin"

# Tambahkan juga frontend URL untuk link di email
APP_FRONTEND_URL=http://localhost:3000
```

**⚠️ PENTING:**
- `MAIL_USERNAME` = Email Gmail lengkap Anda (contoh: `admin@gmail.com`)
- `MAIL_PASSWORD` = App Password 16 karakter yang sudah di-generate
- `MAIL_FROM_ADDRESS` = Sama dengan `MAIL_USERNAME`

---

### Langkah 3: Clear Cache Laravel

Setelah edit `.env`, jalankan command ini untuk reload konfigurasi:

```bash
cd backend
php artisan config:clear
php artisan cache:clear
```

---

### Langkah 4: Test Kirim Email

#### Cara 1: Via Frontend Admin Dashboard
1. Buka `http://localhost:3000/dashboard/verif_sellers`
2. Pilih seller dengan status **"pending"**
3. Klik **"Lihat Detail"**
4. Klik **"Setujui Pendaftaran"**
5. Check email seller di Gmail

#### Cara 2: Via Tinker (Testing Manual)
```bash
cd backend
php artisan tinker
```

Kemudian jalankan:
```php
$seller = App\Models\Seller::first();
Mail::to($seller->user->email)->send(new App\Mail\SellerApproved($seller));
```

Jika berhasil, output: `= null` (tidak ada error)

---

## 🔍 Troubleshooting

### Error: "Failed to authenticate on SMTP server"
**Penyebab**: Password salah atau bukan App Password  
**Solusi**:
- Pastikan menggunakan **App Password** 16 karakter, bukan password Gmail biasa
- Copy-paste App Password tanpa spasi
- Regenerate App Password jika perlu

### Error: "Connection could not be established with host smtp.gmail.com"
**Penyebab**: Port atau encryption salah  
**Solusi**:
- Pastikan `MAIL_PORT=587` dan `MAIL_ENCRYPTION=tls`
- Atau coba `MAIL_PORT=465` dengan `MAIL_ENCRYPTION=ssl`

### Error: "Sender address rejected: not owned by user"
**Penyebab**: `MAIL_FROM_ADDRESS` berbeda dengan `MAIL_USERNAME`  
**Solusi**: 
- Pastikan `MAIL_FROM_ADDRESS` sama dengan `MAIL_USERNAME`

### Email masuk ke Spam
**Solusi**:
- Normal untuk development testing
- Di production, gunakan verified domain dengan SPF/DKIM
- Atau gunakan service email profesional (SendGrid, AWS SES, dll)

---

## 📋 Checklist Setup

- [ ] 2-Step Verification sudah aktif di Google Account
- [ ] App Password sudah di-generate
- [ ] File `.env` sudah diupdate dengan credentials yang benar
- [ ] `MAIL_MAILER=smtp` (bukan `log`)
- [ ] `php artisan config:clear` sudah dijalankan
- [ ] Backend Laravel sudah di-restart (`php artisan serve`)
- [ ] Test kirim email berhasil

---

## 🚀 Alternatif (Jika Gmail Tidak Bisa)

### Option 1: MailHog (Development Only)
Email tidak dikirim sungguhan, tapi bisa dilihat di web UI lokal.

```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

Install MailHog:
```bash
# macOS
brew install mailhog
mailhog

# Akses UI: http://localhost:8025
```

### Option 2: Mailtrap (Recommended untuk Development)
Free, tidak perlu setup Gmail, email langsung masuk ke inbox testing.

1. Daftar gratis di [mailtrap.io](https://mailtrap.io)
2. Copy SMTP credentials
3. Update `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
```

---

## 📝 Notes

- **Development**: Gunakan MailHog atau Mailtrap
- **Production**: Gunakan service profesional (SendGrid, AWS SES, Postmark)
- **Gmail SMTP**: Cocok untuk testing kecil, tapi ada **limit 500 email/hari**

---

## ✅ Verifikasi Email Terkirim

Cek di file log untuk konfirmasi:
```bash
tail -f backend/storage/logs/laravel.log
```

Jika berhasil, log akan menunjukkan:
```
[2024-12-04 10:30:00] local.INFO: Mail sent successfully
```

Jika gagal, akan ada error message detail di log.

---

**Status**: 📧 Siap untuk production setelah Gmail SMTP dikonfigurasi!

**Last Updated**: December 4, 2025
