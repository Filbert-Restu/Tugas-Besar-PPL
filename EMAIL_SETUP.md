# Email Templates Setup - Seller Verification

## ✅ Files Created

### 1. Email Views (Blade Templates)

#### `/backend/resources/views/emails/seller-approved.blade.php`
- **Purpose**: Email template untuk notifikasi penjual yang disetujui
- **Design**: 
  - Green theme (success)
  - Success checkmark icon
  - Informasi toko yang diverifikasi
  - Tips untuk memulai berjualan
  - Button CTA "Login Sekarang"
- **Variables**: 
  - `$seller->user->name` - Nama penjual
  - `$seller->nama_toko` - Nama toko
  - `config('app.frontend_url')` - URL frontend untuk login

#### `/backend/resources/views/emails/seller-rejected.blade.php`
- **Purpose**: Email template untuk notifikasi penjual yang ditolak
- **Design**:
  - Red/Orange theme (warning)
  - Warning icon
  - Reason box dengan alasan penolakan
  - Persyaratan pendaftaran
  - Button CTA "Daftar Ulang"
- **Variables**:
  - `$seller->user->name` - Nama penjual
  - `$seller->nama_toko` - Nama toko
  - `$reason` - Alasan penolakan (optional)
  - `config('app.frontend_url')` - URL frontend untuk re-register

### 2. Mail Classes

#### `/backend/app/Mail/SellerApproved.php`
- **Subject**: "Selamat! Akun Penjual Anda Telah Diverifikasi"
- **Constructor Parameters**: `Seller $seller`
- **View**: `emails.seller-approved`

#### `/backend/app/Mail/SellerRejected.php`
- **Subject**: "Pemberitahuan Pendaftaran Penjual"
- **Constructor Parameters**: 
  - `Seller $seller`
  - `?string $reason = null`
- **View**: `emails.seller-rejected`

### 3. Controller Updates

#### `/backend/app/Http/Controllers/Admin/SellerVerificationController.php`
**Changes:**
- Added `use Illuminate\Support\Facades\Mail;` (already exists)
- **Line ~96**: Sends approval email via `Mail::to()->send(new SellerApproved())`
- **Line ~133**: Sends rejection email via `Mail::to()->send(new SellerRejected())`

---

## 🔧 Configuration Required

### 1. Environment Variables (`.env`)

Add frontend URL for email links:
```env
APP_FRONTEND_URL=http://localhost:3000
```

### 2. Mail Configuration

Already configured in `backend/config/mail.php`. Make sure `.env` has:

```env
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@martplace.com"
MAIL_FROM_NAME="${APP_NAME}"
```

---

## 🧪 Testing Email

### Option 1: MailHog (Recommended for Development)

1. **Install MailHog** (already in docker-compose or install separately):
   ```bash
   # macOS
   brew install mailhog
   brew services start mailhog
   
   # Windows (via Chocolatey)
   choco install mailhog
   mailhog
   ```

2. **Access MailHog Web UI**:
   - Open: `http://localhost:8025`
   - All sent emails will appear here

3. **Test by approving/rejecting seller** from frontend

### Option 2: Log Driver (Quick Test)

Change `.env`:
```env
MAIL_MAILER=log
```

Emails will be written to `backend/storage/logs/laravel.log`

### Option 3: Mailtrap (Cloud Testing)

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Get SMTP credentials
3. Update `.env`:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_username
   MAIL_PASSWORD=your_password
   ```

---

## 📧 Email Flow

### Approval Flow:
```
1. Admin clicks "Setujui Pendaftaran" in frontend
2. POST /api/admin/sellers/approve {user_id: X}
3. Backend:
   - Update seller status to "verified"
   - Send email: SellerApproved
4. Email delivered to seller's email
5. Seller receives email with login link
```

### Rejection Flow:
```
1. Admin clicks "Tolak Pendaftaran" and enters reason
2. POST /api/admin/sellers/reject {user_id: X, reason: "..."}
3. Backend:
   - Update seller status to "rejected"
   - Send email: SellerRejected with reason
4. Email delivered to seller's email
5. Seller receives email with reason and re-register link
```

---

## 🎨 Email Design Features

### Seller Approved Email:
- ✅ Responsive design (mobile-friendly)
- ✅ Professional styling with inline CSS
- ✅ Clear CTA button
- ✅ Helpful tips for new sellers
- ✅ Branded footer

### Seller Rejected Email:
- ⚠️ Clear but polite messaging
- ⚠️ Highlighted reason box
- ⚠️ Actionable steps to fix issues
- ⚠️ Re-registration link
- ⚠️ Support contact information

---

## 🔍 Troubleshooting

### Error: "View [emails.seller-approved] not found"
**Solution**: ✅ **FIXED** - Files created at:
- `backend/resources/views/emails/seller-approved.blade.php`
- `backend/resources/views/emails/seller-rejected.blade.php`

### Error: "Connection could not be established with host mailhog"
**Solution**: 
- Make sure MailHog is running
- Or switch to `MAIL_MAILER=log` for testing

### Email not received
**Check:**
1. Laravel logs: `backend/storage/logs/laravel.log`
2. MailHog UI: `http://localhost:8025`
3. `.env` mail configuration
4. Run: `php artisan config:clear`

### Email formatting issues
**Check:**
- Blade syntax in view files
- Variables passed to Mailable constructor
- CSS inline styles (some email clients strip `<style>` tags)

---

## 🚀 Next Steps

1. **Test Approval Email**:
   - Start MailHog: `mailhog`
   - Open admin dashboard
   - Approve a pending seller
   - Check `http://localhost:8025`

2. **Test Rejection Email**:
   - Reject a seller with reason
   - Check MailHog for email
   - Verify reason appears correctly

3. **Customize Templates**:
   - Edit blade files to match brand colors
   - Update email copy/text
   - Add logo/images if needed

4. **Production Setup**:
   - Configure real SMTP (Gmail, SendGrid, SES)
   - Update `MAIL_FROM_ADDRESS` to real email
   - Test deliverability

---

## 📝 Code Reference

### Send Approval Email:
```php
Mail::to($seller->user->email)->send(new SellerApproved($seller));
```

### Send Rejection Email:
```php
Mail::to($seller->user->email)->send(new SellerRejected($seller, $reason));
```

### Access Variables in Blade:
```blade
{{ $seller->user->name }}        // Nama penjual
{{ $seller->nama_toko }}         // Nama toko
{{ $seller->user->email }}       // Email penjual
{{ $reason }}                    // Alasan penolakan (rejection only)
{{ config('app.frontend_url') }} // Frontend URL
```

---

**Status**: ✅ Email templates fully implemented and ready for testing!

**Last Updated**: December 4, 2025
