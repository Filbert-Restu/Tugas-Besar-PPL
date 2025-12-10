# MartPlace - Platform E-Commerce Marketplace

Platform e-commerce berbasis web yang memungkinkan penjual untuk mendaftarkan toko mereka dan menjual produk, dengan sistem verifikasi admin dan dashboard analitik lengkap.

---

## 📋 Daftar Isi

- [Gambaran Umum](#-gambaran-umum)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Prasyarat Instalasi](#-prasyarat-instalasi)
- [Instalasi dan Setup](#-instalasi-dan-setup)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Struktur Database](#-struktur-database)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Dokumentasi Tambahan](#-dokumentasi-tambahan)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Gambaran Umum

**MartPlace** adalah platform marketplace yang menghubungkan penjual dengan pembeli. Sistem ini memiliki 3 jenis pengguna:

1. **Admin** - Mengelola verifikasi penjual, kategori produk, dan melihat statistik platform
2. **Seller/Penjual** - Mendaftar toko, mengelola produk, dan melihat laporan penjualan
3. **Pembeli** - Melihat produk, memberikan review dan rating

### Fitur Unggulan

- ✅ Sistem autentikasi dengan Laravel Sanctum
- ✅ Verifikasi penjual oleh admin dengan notifikasi email
- ✅ Dashboard admin dengan visualisasi data (grafik dan statistik)
- ✅ Manajemen produk dengan kategori
- ✅ Sistem review dan rating produk
- ✅ Laporan PDF (daftar penjual, produk berdasarkan rating)
- ✅ Integrasi data wilayah Indonesia (Provinsi, Kabupaten, Kecamatan, Kelurahan)
- ✅ Responsive design dengan Next.js dan Tailwind CSS

---

## 🛠️ Teknologi yang Digunakan

### Backend

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **PHP** | ^8.2 | Bahasa pemrograman server-side |
| **Laravel** | ^12.0 | Framework PHP untuk backend API |
| **Laravel Sanctum** | ^4.0 | Authentication API dengan token |
| **Laravel Breeze** | ^2.3 | Starter kit untuk autentikasi |
| **SQLite/MySQL** | - | Database (default: SQLite) |
| **DomPDF** | ^3.1 | Generasi laporan PDF |
| **Composer** | - | PHP dependency manager |

### Frontend

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Next.js** | 16.0.1 | React framework untuk SSR/SSG |
| **React** | 19.2.0 | Library untuk UI |
| **TypeScript** | ^5.9.3 | JavaScript dengan tipe statis |
| **Tailwind CSS** | ^4 | Utility-first CSS framework |
| **Axios** | ^1.13.2 | HTTP client untuk API calls |
| **Radix UI** | ^1.2.4 | Komponen UI accessible |
| **pnpm** | - | Package manager |

### Tools & Utilities

- **Laravel Tinker** - REPL untuk testing
- **Laravel Pail** - Log viewer
- **PHPUnit** - Testing framework
- **ESLint** - Linting untuk JavaScript/TypeScript
- **IDE Helper** - Autocomplete untuk Laravel di IDE

---

## 🎨 Fitur Utama

### 1. Sistem Autentikasi & Otorisasi

#### Multi-Role Authentication
- **Admin**: Akses penuh ke dashboard admin, verifikasi seller, laporan
- **Seller**: Manajemen toko dan produk, dashboard penjual
- **Pembeli**: Akses publik untuk melihat produk dan memberikan review

#### Role-Based Middleware
```php
// CheckRole Middleware
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Admin routes
});

Route::middleware(['auth:sanctum', 'role:penjual'])->group(function () {
    // Seller routes
});
```

### 2. Manajemen Penjual (Seller)

#### Registrasi Penjual
- Upload foto profil dan KTP
- Data toko (nama, deskripsi, nomor telepon)
- Alamat lengkap dengan data wilayah Indonesia
- Status: pending, verified, rejected

#### Verifikasi oleh Admin
- Admin dapat approve/reject pendaftaran penjual
- Notifikasi email otomatis saat approval/rejection
- Reset status untuk re-verifikasi

#### Dashboard Penjual
- Statistik produk dan penjualan
- Manajemen produk (CRUD)
- Laporan stok dan rating produk

### 3. Manajemen Produk

#### CRUD Produk
- Tambah, edit, hapus produk
- Upload foto produk
- Kategori produk
- Informasi: nama, deskripsi, harga, berat, stok

#### Manajemen Stok
- Tambah stok (`/sum`)
- Kurangi stok (`/sub`)
- Alert stok rendah

### 4. Sistem Review & Rating

#### Review Produk
- Rating 1-5 bintang
- Komentar/review teks
- Tampilan aggregate rating per produk
- User dapat menghapus review mereka sendiri

#### Statistik Rating
- Average rating per produk
- Distribusi rating (1-5 stars)
- Top rated products

### 5. Dashboard Admin (SRS-MartPlace-07)

Dashboard komprehensif dengan visualisasi data:

#### Summary Cards
- Total produk
- Total kategori
- Total toko (aktif/tidak aktif)
- Pending verifikasi
- Total review dan average rating

#### Visualisasi Grafik
- **Bar Chart**: Produk per kategori
- **Bar Chart**: Toko per provinsi (Top 10)
- **Donut Chart**: Status penjual (aktif/tidak aktif)
- **Bar Chart**: Distribusi rating 1-5
- **Table**: 10 produk dengan rating tertinggi

### 6. Laporan PDF

#### SRS-MartPlace-09: Laporan Daftar Penjual
```
GET /api/admin/reports/sellers
```
- Daftar penjual aktif dan tidak aktif
- Informasi: nama toko, pemilik, email, telepon, provinsi, status

#### SRS-MartPlace-10: Laporan Penjual per Provinsi
```
GET /api/admin/reports/sellers-by-province
```
- Pengelompokan penjual berdasarkan provinsi
- Informasi lengkap per penjual
- Summary jumlah penjual per provinsi

#### SRS-MartPlace-11: Laporan Produk berdasarkan Rating
```
GET /api/admin/reports/products-rating
```
- Produk diurutkan berdasarkan rating (tertinggi ke terendah)
- Informasi: nama produk, toko, kategori, harga, rating, jumlah review

### 7. Email Notification System

#### Template Email
- **Seller Approved**: Email dengan desain gradient purple
- **Seller Rejected**: Email dengan desain gradient red
- Personalisasi dengan nama seller dan nama toko
- CTA buttons untuk login/re-register

#### SMTP Support
- Gmail SMTP
- Mailtrap (untuk development)
- Konfigurasi lengkap di `.env`

### 8. Data Wilayah Indonesia

#### Struktur Hierarki
```
Provinsi → Kabupaten/Kota → Kecamatan → Kelurahan
```

#### CSV Data Sources
- `provinces.csv` - 34 provinsi
- `cities.csv` - Kabupaten/kota
- `districts.csv` - Kecamatan
- `villages.csv` - Kelurahan/desa

#### WilayahService
Service helper untuk mencari/membuat data wilayah secara otomatis.

---

## 🏗️ Arsitektur Sistem

### Pola Arsitektur

```
Frontend (Next.js)
      ↓
   API Client (Axios)
      ↓
   Laravel Sanctum (Authentication)
      ↓
   Laravel Backend (API)
      ↓
   Database (SQLite/MySQL)
```

### Backend Architecture

#### Layer Structure
```
routes/api.php          → API endpoints definition
   ↓
Controllers/            → Request handling & validation
   ↓
Services/               → Business logic
   ↓
Models/                 → Database interaction (Eloquent ORM)
   ↓
Database                → Data persistence
```

#### Key Components

**Controllers**:
- `AdminDashboardController` - Dashboard statistics
- `AdminReportController` - PDF report generation
- `SellerVerificationController` - Seller approval/rejection
- `SellerProductController` - Product management
- `ReviewController` - Review & rating management
- `MainController` - Public product listing

**Middleware**:
- `CheckRole` - Role-based access control
- `EnsureEmailIsVerified` - Email verification check

**Models**:
- `User` - User authentication (admin, seller, buyer)
- `Seller` - Seller profile & store info
- `Produk` - Product data
- `KategoriProduk` - Product categories
- `ProdukReviews` - Product reviews
- `Transactions` - Transaction records
- `Provinsi`, `KabupatenKota`, `Kecamatan`, `Kelurahan` - Location data

**Mail**:
- `SellerApproved` - Approval email notification
- `SellerRejected` - Rejection email notification

### Frontend Architecture

#### Folder Structure
```
src/
├── app/                    # Next.js pages (App Router)
│   ├── (auth)/            # Authentication pages
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin dashboard
│   └── seller/            # Seller dashboard
├── components/            # React components
│   ├── Admin/             # Admin-specific components
│   ├── Seller/            # Seller-specific components
│   └── Main/              # Shared components
├── services/              # API service layer
├── lib/                   # Utilities & helpers
│   └── apiClient.ts       # Axios configuration
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── constants/             # Constants & configurations
```

#### Key Services
- `adminDashboardService.ts` - Admin dashboard data
- `adminReportService.ts` - PDF report downloads
- `sellerVerificationService.ts` - Seller verification
- `productService.ts` - Product operations
- `reviewService.ts` - Review management
- `regionService.ts` - Location data

---

## 📦 Prasyarat Instalasi

### Software Requirements

#### Backend
- **PHP** ≥ 8.2
- **Composer** ≥ 2.0
- **SQLite** (atau MySQL/PostgreSQL)
- **PHP Extensions**:
  - OpenSSL
  - PDO
  - Mbstring
  - Tokenizer
  - XML
  - Ctype
  - JSON
  - BCMath
  - Fileinfo
  - GD atau Imagick (untuk image processing)

#### Frontend
- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x (atau npm/yarn)

#### Optional (untuk Development)
- **Git** - Version control
- **VS Code** - Recommended IDE
- **Postman** - API testing

### Cek Versi yang Terinstall

```bash
# PHP version
php -v

# Composer version
composer -V

# Node.js version
node -v

# pnpm version
pnpm -v
```

---

## 🚀 Instalasi dan Setup

### Quick Start

#### 1. Clone Repository
```bash
git clone https://github.com/Filbert-Restu/Tugas-Besar-PPL.git
cd Tugas-Besar-PPL
```

#### 2. Backend Setup

```bash
# Masuk ke direktori backend
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Buat database SQLite (jika belum ada)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed database dengan data dummy
php artisan db:seed

# Generate IDE helper (optional, untuk autocomplete)
php artisan ide-helper:generate
php artisan ide-helper:models
php artisan ide-helper:meta

# Start development server
php artisan serve
```

Backend akan berjalan di: `http://localhost:8000`

#### 3. Frontend Setup

```bash
# Buka terminal baru, masuk ke direktori frontend
cd frontend

# Install dependencies dengan pnpm
pnpm install

# Start development server
pnpm dev
```

Frontend akan berjalan di: `http://localhost:3000`

### Alternative: Development dengan Composer Scripts

Backend Laravel dilengkapi dengan composer scripts untuk development:

```bash
cd backend

# Setup lengkap (install, env, key, migrate)
composer setup

# Development mode dengan live reload
# (server, queue, logs, vite bersamaan)
composer dev

# Run tests
composer test
```

---

## ⚙️ Konfigurasi Environment

### Backend (.env)

File: `backend/.env`

#### Konfigurasi Dasar

```env
APP_NAME=MartPlace
APP_ENV=local
APP_KEY=base64:xxxxx  # Generated by php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=id
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=id_ID
```

#### Database Configuration

##### SQLite (Default - Recommended untuk Development)
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

##### MySQL (untuk Production)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=martplace
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### Session & Cache
```env
SESSION_DRIVER=database
SESSION_LIFETIME=120

CACHE_STORE=database
QUEUE_CONNECTION=database
```

#### Email Configuration

##### Gmail SMTP (Production)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@martplace.com
MAIL_FROM_NAME="${APP_NAME}"
```

**Cara mendapatkan Gmail App Password**:
1. Login ke Google Account
2. Enable 2-Step Verification
3. Generate App Password di Security settings
4. Copy password ke `MAIL_PASSWORD`

##### Mailtrap (Development Testing)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
```

##### Log Only (untuk development tanpa email)
```env
MAIL_MAILER=log
```

#### Frontend URL (untuk Email Links)
```env
APP_FRONTEND_URL=http://localhost:3000
```

#### CORS Configuration
```env
FRONTEND_URL=http://localhost:3000
```

File: `backend/config/cors.php`
```php
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### Frontend Configuration

Frontend menggunakan hardcoded API URL di `src/lib/apiClient.ts`:

```typescript
const API_URL = 'http://localhost:8000';
```

**Untuk production**, update menjadi:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.yourdomain.com';
```

Dan tambahkan di `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 🗄️ Struktur Database

### Migrations

Total 13 migration files di `backend/database/migrations/`:

#### Core Tables

**1. users** - `0001_01_01_000000_create_users_table.php`
```sql
- id (PK)
- name
- email (unique)
- password
- role (enum: 'admin', 'penjual', 'pembeli')
- email_verified_at
- remember_token
- timestamps
```

**2. penjual** - `2025_11_11_122156_create_penjual_table.php`
```sql
- user_id (PK, FK to users)
- nama_toko
- deskripsi_singkat
- nomor_telepon
- kelurahan_id (FK to kelurahan)
- RT
- RW
- detail_alamat
- no_ktp
- foto_penjual
- foto_ktp
- status (enum: 'pending', 'verified', 'rejected')
- timestamps
```

**3. kategori_produk** - `2025_11_26_161428_create_kategori_produk_table.php`
```sql
- id (PK)
- nama_kategori
- timestamps
```

**4. produk** - `2025_11_26_161541_create_produk_table.php`
```sql
- id (PK)
- user_id (FK to users)
- nama_produk
- kategori_produk_id (FK to kategori_produk)
- deskripsi_produk
- harga_produk (decimal)
- berat_produk (decimal)
- stok_produk (integer)
- foto_produk
- timestamps
```

**5. product_reviews** - `2025_11_26_165057_create_product_reviews_table.php`
```sql
- id (PK)
- produk_id (FK to produk)
- user_id (FK to users)
- rating (1-5)
- review (text)
- timestamps
```

**6. transactions** - `2025_11_26_165336_create_transactions_table.php`
```sql
- id (PK)
- user_id (FK to users)
- produk_id (FK to produk)
- quantity
- total_price (decimal)
- status
- timestamps
```

#### Wilayah Indonesia Tables

**7. provinsi** - `2025_11_23_102354_create_provinsi_table.php`
```sql
- id (PK)
- nama_provinsi
- timestamps
```

**8. kabupaten_kota** - `2025_11_23_103153_create_kabupaten_kota_table.php`
```sql
- id (PK)
- provinsi_id (FK to provinsi)
- nama_kabupaten_kota
- timestamps
```

**9. kecamatan** - `2025_11_23_103721_create_kecamatan_table.php`
```sql
- id (PK)
- kabupaten_kota_id (FK to kabupaten_kota)
- nama_kecamatan
- timestamps
```

**10. kelurahan** - `2025_11_23_103728_create_kelurahan_table.php`
```sql
- id (PK)
- kecamatan_id (FK to kecamatan)
- nama_kelurahan
- timestamps
```

#### System Tables

**11. cache** - `0001_01_01_000001_create_cache_table.php`
- Cache storage

**12. jobs** - `0001_01_01_000002_create_jobs_table.php`
- Queue jobs

**13. personal_access_tokens** - `2025_11_09_112044_create_personal_access_tokens_table.php`
- Sanctum API tokens

### Database Seeders

#### 1. DatabaseSeeder
File: `database/seeders/DatabaseSeeder.php`

Seeds data awal:
- Admin user (email: admin@example.com)
- Sample users
- Kategori produk default

#### 2. WilayahSeeder
File: `database/seeders/WilayahSeeder.php`

Import data wilayah Indonesia dari CSV:
- `public/data/wilayah/provinces.csv`
- `public/data/wilayah/cities.csv`
- `public/data/wilayah/districts.csv`
- `public/data/wilayah/villages.csv`

#### 3. TokoProductSeeder
File: `database/seeders/TokoProductSeeder.php`

Seeds dummy data:
- Sample sellers dengan toko
- Sample products dengan berbagai kategori
- Sample reviews

### Run Seeders

```bash
# Seed semua
php artisan db:seed

# Seed spesifik
php artisan db:seed --class=WilayahSeeder
php artisan db:seed --class=TokoProductSeeder

# Fresh migrate + seed
php artisan migrate:fresh --seed
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:8000/api`

### Authentication Endpoints

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "penjual"
  }
}
```

#### Logout
```http
POST /logout
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Logout successful"
}
```

### Public Endpoints

#### Get All Products (Homepage)
```http
GET /
Query Parameters:
  - page (integer)
  - search (string)
  - kategori_id (integer)
  - provinsi_id (integer)
  - min_rating (integer, 1-5)
```

#### Get Product Details
```http
GET /{nama_toko}/{product_id}
```

#### Get Categories
```http
GET /categories
```

#### Get Product Reviews
```http
GET /reviews/product/{productId}
```

### Seller Endpoints

Prefix: `/seller`
Middleware: `auth:sanctum`, `role:penjual`

#### Register Seller
```http
POST /seller/register
Content-Type: multipart/form-data

{
  "name": "Seller Name",
  "email": "seller@example.com",
  "password": "password",
  "password_confirmation": "password",
  "nama_toko": "Toko Saya",
  "deskripsi_singkat": "Deskripsi toko",
  "nomor_telepon": "08123456789",
  "provinsi": "DKI Jakarta",
  "kabupaten_kota": "Jakarta Selatan",
  "kecamatan": "Kebayoran Baru",
  "kelurahan": "Senayan",
  "RT": "001",
  "RW": "002",
  "detail_alamat": "Jl. Contoh No. 123",
  "no_ktp": "3171234567890123",
  "foto_penjual": (file),
  "foto_ktp": (file)
}
```

#### Seller Dashboard
```http
GET /seller/dashboard
GET /seller/dashboard/statistics
```

#### Seller Profile
```http
GET /seller/profile
PUT /seller/profile
```

#### Seller Products
```http
GET /seller/products
POST /seller/products/add
PUT /seller/products/edit
POST /seller/products/sum      # Tambah stok
POST /seller/products/sub      # Kurangi stok
POST /seller/products/delete
```

#### Seller Reports
```http
GET /seller/reports/stock-by-quantity
GET /seller/reports/stock-by-rating
GET /seller/reports/low-stock
```

### Admin Endpoints

Prefix: `/admin`
Middleware: `auth:sanctum`, `role:admin`

#### Admin Dashboard
```http
GET /admin/dashboard/statistics

Response: 200 OK
{
  "message": "Admin dashboard statistics fetched successfully",
  "data": {
    "summary": {
      "total_produk": 150,
      "total_kategori": 10,
      "total_toko": 45,
      "toko_aktif": 40,
      "toko_tidak_aktif": 5,
      "pending_verifikasi": 3,
      "total_review": 230,
      "average_rating": 4.2
    },
    "produk_per_kategori": [...],
    "toko_per_provinsi": [...],
    "user_status": {...},
    "rating_distribution": {...},
    "top_rated_products": [...]
  }
}
```

#### Category Management
```http
GET /admin/dashboard/categories
POST /admin/dashboard/categories/add
PUT /admin/dashboard/categories/edit
DELETE /admin/dashboard/categories/delete
```

#### Seller Verification
```http
GET /admin/sellers                    # List all sellers
GET /admin/sellers/{userId}           # Get seller details
POST /admin/sellers/approve           # Approve seller
POST /admin/sellers/reject            # Reject seller
POST /admin/sellers/reset-status      # Reset verification status
```

**Approve Seller Request**:
```json
{
  "user_id": 5
}
```

**Reject Seller Request**:
```json
{
  "user_id": 5,
  "alasan_penolakan": "Foto KTP tidak jelas"
}
```

#### PDF Reports
```http
GET /admin/reports/sellers
  → Laporan daftar penjual aktif/tidak aktif

GET /admin/reports/sellers-by-province
  → Laporan penjual per provinsi

GET /admin/reports/products-rating
  → Laporan produk berdasarkan rating
```

### Review Endpoints

```http
# Get reviews for a product
GET /reviews/product/{productId}

# Create review (requires auth)
POST /reviews
{
  "produk_id": 1,
  "rating": 5,
  "review": "Produk bagus!"
}

# Delete review (requires auth, owner only)
DELETE /reviews/{reviewId}
```

### Response Format

#### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

#### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

#### HTTP Status Codes
- `200` - OK
- `201` - Created
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## 🧪 Testing

### Backend Testing dengan PHPUnit

#### Run All Tests
```bash
cd backend
php artisan test
```

#### Run Specific Test Suite
```bash
# Feature tests
php artisan test --testsuite=Feature

# Unit tests
php artisan test --testsuite=Unit
```

#### Run Specific Test File
```bash
php artisan test tests/Feature/Auth/LoginTest.php
```

#### dengan Coverage Report
```bash
php artisan test --coverage
```

### Manual Testing

#### 1. Test Backend API dengan Postman/curl

**Login Test**:
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

**Get Dashboard Statistics (dengan token)**:
```bash
curl -X GET http://localhost:8000/api/admin/dashboard/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 2. Test Email Notification

Gunakan Mailtrap untuk testing email tanpa mengirim email sungguhan:

1. Daftar di https://mailtrap.io
2. Copy SMTP credentials ke `.env`
3. Test approve/reject seller
4. Cek inbox di Mailtrap dashboard

#### 3. Test PDF Generation

```bash
# Download PDF via browser
http://localhost:8000/api/admin/reports/sellers
http://localhost:8000/api/admin/reports/sellers-by-province
http://localhost:8000/api/admin/reports/products-rating
```

### Laravel Tinker (Interactive Testing)

```bash
php artisan tinker
```

```php
// Get all users
User::all();

// Find admin
User::where('role', 'admin')->first();

// Create test admin
$admin = new User();
$admin->name = 'Test Admin';
$admin->email = 'admin@test.com';
$admin->password = bcrypt('password');
$admin->role = 'admin';
$admin->email_verified_at = now();
$admin->save();

// Get sellers pending verification
Seller::where('status', 'pending')->count();

// Get product with reviews
Produk::with('reviews')->find(1);

// Calculate average rating
$produk = Produk::find(1);
$produk->reviews()->avg('rating');
```

### Frontend Testing

#### 1. Test Authentication Flow

1. Navigate to `http://localhost:3000/login`
2. Login dengan kredensial:
   - Admin: `admin@example.com` / `password`
   - Seller: `seller@example.com` / `password`
3. Verify redirect to dashboard

#### 2. Test Admin Dashboard

1. Login sebagai admin
2. Navigate to `/admin/dashboard`
3. Verify statistics cards loaded
4. Verify charts rendered
5. Test category CRUD operations
6. Test seller verification

#### 3. Test Seller Dashboard

1. Login sebagai seller
2. Navigate to `/seller/dashboard`
3. Test product CRUD
4. Test stock management
5. View reports

---

## 📚 Dokumentasi Tambahan

Proyek ini memiliki dokumentasi lengkap untuk berbagai aspek:

### 1. EMAIL_SETUP.md
**Lokasi**: `backend/EMAIL_SETUP.md`

Dokumentasi lengkap setup email notification:
- Konfigurasi SMTP (Gmail, Mailtrap)
- Template email (Approved/Rejected)
- Testing email flow
- Troubleshooting email issues

### 2. ADMIN_DASHBOARD.md
**Lokasi**: `ADMIN_DASHBOARD.md`

Dokumentasi dashboard admin:
- Implementasi SRS-MartPlace-07
- Arsitektur backend & frontend
- Endpoint details
- Komponen visualisasi
- Testing procedures

### 3. PDF_REPORTS.md
**Lokasi**: `PDF_REPORTS.md`

Dokumentasi sistem laporan PDF:
- SRS-MartPlace-09: Laporan penjual
- SRS-MartPlace-10: Laporan per provinsi
- SRS-MartPlace-11: Laporan produk rating
- Controller logic
- PDF styling
- Testing

### 4. ARCHITECTURE_DIAGRAMS.md
**Lokasi**: `ARCHITECTURE_DIAGRAMS.md`

Diagram arsitektur sistem:
- Sequence diagrams
- Data flow diagrams
- Component diagrams
- Authentication flow

### 5. TESTING_GUIDE.md
**Lokasi**: `TESTING_GUIDE.md`

Panduan lengkap testing:
- Backend API testing
- Frontend component testing
- Integration testing
- Test data setup

### 6. IMPLEMENTATION_SUMMARY.md
**Lokasi**: `IMPLEMENTATION_SUMMARY.md`

Ringkasan implementasi fitur:
- Status implementasi per fitur
- Technical details
- Known issues
- Future improvements

### 7. CHECKLIST.md
**Lokasi**: `CHECKLIST.md`

Development checklist:
- Feature completion status
- Testing checklist
- Deployment checklist

---

## 🐛 Troubleshooting

### Backend Issues

#### 1. Error: "No application encryption key has been specified"

**Solusi**:
```bash
php artisan key:generate
```

#### 2. Error: "SQLSTATE[HY000]: General error: 1 no such table"

**Solusi**:
```bash
# Check database file exists
ls -la database/database.sqlite

# Run migrations
php artisan migrate:fresh --seed
```

#### 3. Error: "Class 'XXX' not found"

**Solusi**:
```bash
composer dump-autoload
php artisan config:clear
php artisan cache:clear
```

#### 4. CORS Error pada Frontend

**Solusi**:

Pastikan di `backend/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

Dan di `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

#### 5. Email Not Sending

**Solusi**:

1. Cek konfigurasi `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
```

2. Test email config:
```bash
php artisan tinker
```
```php
Mail::raw('Test email', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

3. Cek logs:
```bash
tail -f storage/logs/laravel.log
```

#### 6. Storage Permission Issues

**Solusi**:
```bash
# Linux/Mac
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Windows (run as administrator in Git Bash)
chmod -R 775 storage bootstrap/cache
```

### Frontend Issues

#### 1. Error: "Cannot connect to API"

**Solusi**:

1. Cek backend server running:
```bash
curl http://localhost:8000/api/categories
```

2. Cek API URL di `frontend/src/lib/apiClient.ts`:
```typescript
const API_URL = 'http://localhost:8000';
```

#### 2. Error: "Unauthenticated" setelah login

**Solusi**:

1. Clear browser cookies dan localStorage
2. Cek CORS configuration
3. Verify Sanctum configuration di `backend/config/sanctum.php`

#### 3. Module not found errors

**Solusi**:
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules
pnpm install

# atau
rm pnpm-lock.yaml
pnpm install
```

#### 4. Next.js Build Errors

**Solusi**:
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
pnpm build
```

### Database Issues

#### 1. Migration Failed

**Solusi**:
```bash
# Reset database
php artisan migrate:fresh

# Dengan seeder
php artisan migrate:fresh --seed

# Rollback specific migration
php artisan migrate:rollback --step=1
```

#### 2. Seeder Failed

**Solusi**:
```bash
# Cek syntax error di seeder file
php artisan db:seed --class=YourSeederName

# Clear config cache
php artisan config:clear
composer dump-autoload
```

### Development Tips

#### 1. Enable Debug Mode

Di `backend/.env`:
```env
APP_DEBUG=true
LOG_LEVEL=debug
```

#### 2. Monitor Logs

**Backend**:
```bash
# Real-time log monitoring
php artisan pail

# atau
tail -f storage/logs/laravel.log
```

**Frontend**:
```bash
# Check browser console untuk errors
# Open DevTools (F12) → Console tab
```

#### 3. Clear All Caches

```bash
php artisan optimize:clear
# or manually:
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

#### 4. Database Query Debugging

Tambahkan di `AppServiceProvider.php`:
```php
use Illuminate\Support\Facades\DB;

public function boot()
{
    DB::listen(function($query) {
        logger($query->sql, $query->bindings);
    });
}
```

---

## 🚀 Deployment

### Production Checklist

#### Backend

1. **Environment**:
```env
APP_ENV=production
APP_DEBUG=false
```

2. **Optimize**:
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. **Database**: Gunakan MySQL/PostgreSQL (bukan SQLite)

4. **Queue**: Setup queue worker dengan supervisor

5. **HTTPS**: Pastikan menggunakan SSL certificate

#### Frontend

1. **Build**:
```bash
pnpm build
```

2. **Environment**: Update API URL ke production URL

3. **Deploy**: Deploy ke Vercel/Netlify/VPS

---

## 👥 Tim Pengembang

Project ini dikembangkan sebagai Tugas Besar Praktikum Pengembangan Perangkat Lunak (PPL).

**Repository**: https://github.com/Filbert-Restu/Tugas-Besar-PPL

**Branch**: backend-auth

---

## 📝 License

Proyek ini menggunakan [MIT License](https://opensource.org/licenses/MIT).

---

## 🔗 Resource Links

- [Laravel Documentation](https://laravel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [DomPDF Documentation](https://github.com/barryvdh/laravel-dompdf)

---

**Last Updated**: December 10, 2025

