# Admin Dashboard Testing Guide

## Prerequisites

1. Backend server running: `php artisan serve`
2. Database seeded dengan data test
3. Admin user tersedia di database

---

## Backend Testing

### 1. Check Admin User Exists

```bash
# Via tinker
php artisan tinker

# Di tinker console:
User::where('role', 'admin')->first()

# Jika tidak ada, create admin user:
$user = new User();
$user->name = 'Admin Test';
$user->email = 'admin@test.com';
$user->password = bcrypt('password');
$user->role = 'admin';
$user->save();
```

### 2. Generate Admin Token

```bash
# Via tinker
php artisan tinker

# Di tinker console:
$user = User::where('email', 'admin@test.com')->first();
$token = $user->createToken('admin-dashboard-test')->plainTextToken;
echo $token;

# Copy token yang muncul
```

### 3. Test API Endpoint

#### Using curl (PowerShell)

```powershell
# Replace YOUR_ADMIN_TOKEN with actual token
$token = "YOUR_ADMIN_TOKEN_HERE"
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/admin/dashboard/statistics" `
    -Method GET `
    -Headers $headers
```

#### Using curl (Command Line)

```bash
curl -X GET http://localhost:8000/api/admin/dashboard/statistics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

#### Expected Response Structure

```json
{
  "message": "Admin dashboard statistics fetched successfully",
  "data": {
    "summary": {
      "total_produk": 100,
      "total_kategori": 10,
      "total_toko": 25,
      "toko_aktif": 20,
      "toko_tidak_aktif": 5,
      "pending_verifikasi": 3,
      "total_review": 150,
      "average_rating": 4.2
    },
    "produk_per_kategori": [
      {
        "kategori": "Elektronik",
        "jumlah_produk": 30
      }
    ],
    "toko_per_provinsi": [
      {
        "provinsi": "DKI Jakarta",
        "jumlah_toko": 10
      }
    ],
    "user_status": {
      "aktif": 20,
      "tidak_aktif": 5
    },
    "rating_distribution": {
      "5": 50,
      "4": 40,
      "3": 30,
      "2": 20,
      "1": 10
    },
    "top_rated_products": [
      {
        "nama_produk": "iPhone 15 Pro",
        "nama_toko": "Tech Store",
        "kategori": "Elektronik",
        "rating": 4.9,
        "jumlah_review": 25
      }
    ]
  }
}
```

---

## Frontend Testing

### 1. Setup Environment

```bash
cd frontend

# Ensure .env.local exists
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Start Development Server

```bash
pnpm dev

# Server akan run di http://localhost:3000
```

### 3. Login as Admin

1. Navigate to login page
2. Login dengan admin credentials:
   - Email: `admin@test.com`
   - Password: `password`

### 4. Access Dashboard

Navigate to: `http://localhost:3000/admin/dashboard`

### 5. Verify Components

#### Check Stats Cards

- [ ] Total Produk card shows correct number
- [ ] Total Toko card shows with subtitle
- [ ] Pending Verifikasi card displays
- [ ] Total Kategori card shows
- [ ] Total Review card displays
- [ ] Rating Rata-rata shows decimal value

#### Check Charts

- [ ] Products by Category bar chart renders
- [ ] Stores by Province chart shows top 10
- [ ] User Status donut chart displays
- [ ] Rating Distribution shows stars
- [ ] Top Rated Products table populates

#### Check Responsiveness

- [ ] Desktop (>1024px): 2 columns for charts
- [ ] Tablet (768-1024px): 2 columns for stats
- [ ] Mobile (<768px): 1 column layout

#### Check States

- [ ] Loading state shows spinner
- [ ] Error state shows when API fails
- [ ] Data state renders all components

---

## Common Issues & Solutions

### Issue: 401 Unauthorized

**Cause**: Token tidak valid atau expired  
**Solution**:

1. Generate token baru via tinker
2. Update localStorage token
3. Login ulang

### Issue: 403 Forbidden

**Cause**: User bukan admin  
**Solution**:

```bash
php artisan tinker
$user = User::where('email', 'YOUR_EMAIL')->first();
$user->role = 'admin';
$user->save();
```

### Issue: Empty Data

**Cause**: Database belum ada data  
**Solution**:

```bash
# Seed database
php artisan db:seed

# Or create manual data via tinker
```

### Issue: CORS Error

**Cause**: Frontend tidak bisa akses backend  
**Solution**:

```php
// backend/config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
```

### Issue: Charts Not Rendering

**Cause**: Data structure mismatch  
**Solution**:

1. Check browser console untuk errors
2. Verify API response structure
3. Check TypeScript interfaces match

---

## Test Scenarios

### Scenario 1: Fresh Database

```bash
# Reset database
php artisan migrate:fresh

# Seed dengan data test
php artisan db:seed

# Create admin user
php artisan tinker
# ... create admin code ...

# Test dashboard
```

### Scenario 2: Empty Categories

```bash
# Delete all categories
php artisan tinker
KategoriProduk::truncate();

# Dashboard should show empty state
```

### Scenario 3: No Reviews

```bash
# Delete all reviews
php artisan tinker
ProdukReviews::truncate();

# Dashboard should show 0 reviews, no rating distribution
```

---

## Performance Testing

### Check Query Performance

```bash
# Enable query log
php artisan tinker

DB::enableQueryLog();

# Hit the endpoint
# Then check queries:
dd(DB::getQueryLog());
```

### Expected Query Count

- Should be < 10 queries untuk dashboard
- No N+1 query problems
- Use `withCount()` dan `withAvg()` untuk optimization

---

## Browser Console Checks

### No Errors

```
✅ No TypeScript errors
✅ No React warnings
✅ No 404 errors
✅ No CORS errors
```

### Network Tab

```
✅ GET /api/admin/dashboard/statistics → 200 OK
✅ Response time < 500ms
✅ Response size reasonable (<100KB)
```

### React DevTools

```
✅ Components render correctly
✅ State updates properly
✅ No unnecessary re-renders
```

---

## Deployment Testing

### Production Build

```bash
cd frontend
pnpm build

# Check for errors
# Should complete without TypeScript errors
```

### Production Run

```bash
pnpm start

# Navigate to dashboard
# Verify production build works
```

---

## Acceptance Criteria Checklist

### Backend

- [x] Endpoint `/api/admin/dashboard/statistics` exists
- [x] Protected dengan `auth:sanctum` middleware
- [x] Protected dengan `role:admin` middleware
- [x] Returns correct JSON structure
- [x] All queries optimized
- [x] Error handling implemented

### Frontend

- [x] Dashboard page created at `/admin/dashboard`
- [x] All components render without errors
- [x] Loading state shows during fetch
- [x] Error state shows on failure
- [x] Responsive design works
- [x] TypeScript typed correctly
- [x] TailwindCSS styling applied

### Functional Requirements (SRS-MartPlace-07)

- [x] Grafik sebaran produk berdasarkan kategori
- [x] Grafik sebaran toko berdasarkan provinsi
- [x] Grafik user penjual aktif dan tidak aktif
- [x] Informasi pengunjung yang memberikan rating

### Non-Functional

- [x] Page load time < 3 seconds
- [x] Mobile responsive
- [x] Accessible (keyboard navigation)
- [x] Professional UI design
- [x] Documented code

---

## Sign-off Checklist

Before considering dashboard complete:

- [ ] All backend tests pass
- [ ] All frontend tests pass
- [ ] No console errors in browser
- [ ] Mobile responsive verified on real device
- [ ] Admin authentication works
- [ ] Non-admin users blocked (403)
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Production build successful

---

**Testing Date**: ******\_\_\_******  
**Tested By**: ******\_\_\_******  
**Status**: ⏳ Pending / ✅ Passed / ❌ Failed  
**Notes**: ******************\_******************
