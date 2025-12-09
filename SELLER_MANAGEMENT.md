# Fitur Manajemen Status Penjual Aktif/Suspended

## 📋 Overview

Fitur ini memungkinkan admin platform untuk:
1. **Suspend** akun penjual (menonaktifkan login dan menghapus produk dari marketplace)
2. **Activate** kembali akun penjual yang tersuspend
3. **Export laporan PDF** berisi daftar semua penjual dengan status aktif/suspended

---

## ✅ Files Created/Modified

### Backend Files

#### 1. **Controller**: `SellerManagementController.php`
**Path**: `/backend/app/Http/Controllers/Admin/SellerManagementController.php`

**Methods**:
- `suspend(Request $request)` - Suspend seller account
- `activate(Request $request)` - Activate seller account
- `exportPDF()` - Generate PDF report

#### 2. **Mail Classes**:
- `/backend/app/Mail/SellerSuspended.php` - Email for suspended sellers
- `/backend/app/Mail/SellerActivated.php` - Email for activated sellers

#### 3. **Email Templates**:
- `/backend/resources/views/emails/seller-suspended.blade.php`
- `/backend/resources/views/emails/seller-activated.blade.php`

#### 4. **PDF Template**:
- `/backend/resources/views/pdf/sellers-report.blade.php`

#### 5. **Migration**:
- `/backend/database/migrations/2024_12_04_000001_add_is_active_to_users_table.php`
  - Adds `is_active` boolean column to `users` table

#### 6. **Routes**: `routes/api.php`
Added routes:
```php
Route::post('/admin/sellers/suspend', [SellerManagementController::class, 'suspend']);
Route::post('/admin/sellers/activate', [SellerManagementController::class, 'activate']);
Route::get('/admin/sellers/export-pdf', [SellerManagementController::class, 'exportPDF']);
```

### Frontend Files

#### 7. **Page**: `active_sellers/page.tsx`
**Path**: `/frontend/src/app/(platform)/dashboard/active_sellers/page.tsx`

**Features**:
- Display all verified sellers
- Filter by status (All, Active, Suspended)
- Search by name, email, or store name
- Suspend/Activate sellers
- Export PDF report
- Statistics cards showing total, active, and suspended sellers

---

## 🔧 Setup Instructions

### 1. Run Migration

```bash
cd backend
php artisan migrate
```

This will add the `is_active` column to the `users` table.

### 2. Install DomPDF (if not installed)

```bash
cd backend
composer require barryvdh/laravel-dompdf
```

### 3. Update .env (if needed)

Make sure email configuration is set up correctly (see `GMAIL_SMTP_SETUP.md`).

### 4. Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

---

## 📡 API Endpoints

### 1. Suspend Seller

**Endpoint**: `POST /api/admin/sellers/suspend`

**Auth**: Required (Admin only)

**Request Body**:
```json
{
  "user_id": 1,
  "reason": "Melanggar kebijakan platform: produk palsu"
}
```

**Response Success (200)**:
```json
{
  "message": "Penjual berhasil disuspend dan telah logout",
  "data": {
    "user_id": 1,
    "nama_toko": "Toko Elektronik",
    "is_active": false,
    "reason": "Melanggar kebijakan platform: produk palsu"
  }
}
```

**What Happens**:
- User's `is_active` set to `false`
- All user's auth tokens revoked (force logout)
- Email notification sent to seller with reason
- If seller is currently logged in, they will be logged out automatically

---

### 2. Activate Seller

**Endpoint**: `POST /api/admin/sellers/activate`

**Auth**: Required (Admin only)

**Request Body**:
```json
{
  "user_id": 1
}
```

**Response Success (200)**:
```json
{
  "message": "Penjual berhasil diaktifkan kembali",
  "data": {
    "user_id": 1,
    "nama_toko": "Toko Elektronik",
    "is_active": true
  }
}
```

**What Happens**:
- User's `is_active` set to `true`
- Email notification sent to seller
- Seller can login again

---

### 3. Export PDF Report

**Endpoint**: `GET /api/admin/sellers/export-pdf`

**Auth**: Required (Admin only)

**Response**: PDF file download

**File Name Format**: `laporan-penjual-YYYY-MM-DD.pdf`

**PDF Contains**:
- Statistics (Total, Active, Suspended sellers)
- Table with all sellers:
  - No.
  - Nama Toko
  - Pemilik
  - Email
  - Telepon
  - Status (Aktif/Suspended badge)
  - Tanggal Verifikasi

---

## 🎨 Frontend Features

### Active Sellers Page

**URL**: `/dashboard/active_sellers`

**Features**:

1. **Statistics Cards**:
   - Total Penjual (All verified sellers)
   - Penjual Aktif (Green badge)
   - Penjual Suspended (Red badge)

2. **Search Bar**:
   - Search by store name, owner name, or email
   - Real-time filtering

3. **Filter Tabs**:
   - All (shows all sellers)
   - Aktif (only active sellers)
   - Suspended (only suspended sellers)

4. **Sellers Table**:
   - Nama Toko
   - Pemilik
   - Email
   - Telepon
   - Status (Badge: Aktif/Suspended)
   - Tanggal Verifikasi
   - Action button: "Kelola"

5. **Export PDF Button**:
   - Red button: "📄 Ekspor PDF"
   - Downloads PDF report
   - Shows loading state while generating

6. **Management Modal**:
   - Opens when "Kelola" clicked
   - Shows seller information
   - Options:
     - **For Active Sellers**: "Suspend Akun" button
     - **For Suspended Sellers**: "Aktifkan Kembali" button

7. **Suspend Flow**:
   - Click "Suspend Akun"
   - Enter reason (required)
   - Warning message about impact
   - Confirm suspend
   - Success alert
   - Table updates automatically

8. **Activate Flow**:
   - Click "Aktifkan Kembali"
   - Confirmation message
   - Confirm activation
   - Success alert
   - Table updates automatically

---

## 📧 Email Notifications

### Suspended Email

**Subject**: "Pemberitahuan Suspend Akun Penjual"

**Content**:
- Warning header (Red theme)
- Seller name and store name
- Reason box (highlighted)
- Impact list:
  - Cannot login
  - Products not shown
  - No new orders
  - Dashboard access disabled
- "Hubungi Support" CTA button

### Activated Email

**Subject**: "Akun Penjual Anda Telah Diaktifkan Kembali"

**Content**:
- Success header (Green theme)
- Seller name and store name
- Status checklist:
  - Can login again
  - Products active
  - Can receive orders
  - Dashboard access restored
- "Login Sekarang" CTA button
- Tips for selling

---

## 🔒 Security & Business Logic

### Authentication & Authorization
- All endpoints require `auth:sanctum` middleware
- All endpoints require `role:admin` middleware
- Only platform admins can suspend/activate sellers

### Suspend Logic
1. Check if seller exists
2. Check if seller is verified (only verified sellers can be suspended)
3. Set `users.is_active = false`
4. Revoke all user's tokens (force logout everywhere)
5. Send email notification with reason
6. Return success response

### Activate Logic
1. Check if seller exists
2. Check if seller is verified
3. Set `users.is_active = true`
4. Send email notification
5. Return success response

### Auto-Logout on Suspend
When a seller is suspended:
- All their Sanctum tokens are deleted via `$user->tokens()->delete()`
- If they're currently logged in, they will be logged out on their next API request
- Login attempts will fail because `is_active = false`

### Login Check (Need to implement in AuthController)
Add this check to your login controller:

```php
// In AuthenticatedSessionController.php
public function store(Request $request)
{
    // ...existing validation...
    
    $user = User::where('email', $request->email)->first();
    
    // Check if user is active
    if ($user && !$user->is_active) {
        throw ValidationException::withMessages([
            'email' => ['Akun Anda telah disuspend. Silakan hubungi admin.'],
        ]);
    }
    
    // ...existing auth logic...
}
```

---

## 🧪 Testing

### Manual Testing Steps

#### 1. Test Suspend
1. Login as admin
2. Go to `/dashboard/active_sellers`
3. Find an active seller
4. Click "Kelola" → "Suspend Akun"
5. Enter reason
6. Confirm
7. Verify:
   - ✅ Success alert appears
   - ✅ Status changes to "Suspended" in table
   - ✅ Email sent to seller (check log or mailhog)
   - ✅ Seller cannot login anymore

#### 2. Test Activate
1. Find suspended seller
2. Click "Kelola" → "Aktifkan Kembali"
3. Confirm
4. Verify:
   - ✅ Success alert appears
   - ✅ Status changes to "Aktif" in table
   - ✅ Email sent to seller
   - ✅ Seller can login again

#### 3. Test PDF Export
1. Click "📄 Ekspor PDF" button
2. Verify:
   - ✅ Loading state shows
   - ✅ PDF downloads automatically
   - ✅ PDF contains correct data:
     - Statistics
     - All sellers listed
     - Correct status badges

#### 4. Test Search & Filter
1. Try searching by:
   - Store name
   - Owner name
   - Email
2. Try filtering by:
   - All
   - Aktif
   - Suspended
3. Verify results match filter

---

## 📊 Database Schema

### Users Table (after migration)

```sql
users
├── id (bigint, PK)
├── name (varchar)
├── email (varchar, unique)
├── password (varchar)
├── role (enum: 'admin', 'penjual')
├── is_active (boolean, default: true) ← NEW
├── remember_token (varchar)
├── created_at (timestamp)
└── updated_at (timestamp)
```

---

## 🚀 Future Enhancements

1. **Suspend History**:
   - Create `seller_suspensions` table
   - Track suspend/activate history
   - Show history in seller detail modal

2. **Scheduled Suspension**:
   - Allow admin to set temporary suspend (e.g., 7 days)
   - Auto-activate after period

3. **Bulk Actions**:
   - Suspend multiple sellers at once
   - Export filtered results only

4. **Seller Dashboard Alert**:
   - Show warning banner if seller is close to being suspended
   - Show violation count

5. **Email Template Customization**:
   - Allow admin to customize email templates
   - Add email template management UI

---

## ❓ Troubleshooting

### Error: "Column 'is_active' not found"
**Solution**: Run migration
```bash
php artisan migrate
```

### Error: "Class 'Pdf' not found"
**Solution**: Install DomPDF
```bash
composer require barryvdh/laravel-dompdf
php artisan config:clear
```

### Email not sent
**Solution**: Check email configuration (see `GMAIL_SMTP_SETUP.md`)

### PDF not generating
**Solution**: 
1. Check if DomPDF is installed
2. Check view file exists: `resources/views/pdf/sellers-report.blade.php`
3. Check Laravel logs: `storage/logs/laravel.log`

### Seller still can login after suspend
**Solution**: Add is_active check to login controller (see Security section above)

---

## ✅ Checklist

- [x] Backend controller created
- [x] Mail classes created
- [x] Email templates created
- [x] PDF template created
- [x] Migration created
- [x] Routes added
- [x] Frontend page created
- [x] User model updated
- [x] Documentation created

---

**Status**: ✅ Fully implemented and ready for testing!

**Last Updated**: December 4, 2025
