# Admin PDF Reports - MartPlace

Sistem laporan PDF untuk administrator platform MartPlace yang mengimplementasikan 3 requirement SRS.

---

## 📋 Requirements Implementation

### SRS-MartPlace-09

**Laporan daftar akun penjual aktif dan tidak aktif (format PDF)**

✅ **Implemented**: Endpoint `/api/admin/reports/sellers`

**Konten Laporan:**

- Daftar penjual aktif (status: verified)
- Daftar penjual tidak aktif (status: pending/rejected)
- Informasi: Nama toko, pemilik, email, telepon, provinsi, status
- Summary: Total penjual, total aktif, total tidak aktif

---

### SRS-MartPlace-10

**Laporan daftar penjual (toko) untuk setiap Lokasi provinsi (format PDF)**

✅ **Implemented**: Endpoint `/api/admin/reports/sellers-by-province`

**Konten Laporan:**

- Pengelompokan penjual per provinsi
- Hanya provinsi dengan penjual aktif
- Informasi: Nama toko, pemilik, email, telepon, kabupaten/kota, kecamatan
- Summary: Total penjual per provinsi, grand total

---

### SRS-MartPlace-11

**Laporan daftar produk dan ratingnya yang diurutkan berdasarkan rating secara menurun**

✅ **Implemented**: Endpoint `/api/admin/reports/products-rating`

**Konten Laporan:**

- Produk diurutkan berdasarkan rating (tertinggi ke terendah)
- Hanya produk yang memiliki review
- Informasi: Nama produk, toko, kategori, harga, provinsi, rating, jumlah review, stok
- Summary: Total produk, rating rata-rata, rating tertinggi, rating terendah

---

## 🏗️ Architecture

### Backend (Laravel + DomPDF)

#### Controller

**File**: `backend/app/Http/Controllers/Admin/AdminReportController.php`

```php
class AdminReportController extends Controller
{
    public function sellerReport()          // SRS-09
    public function sellerByProvinceReport() // SRS-10
    public function productRatingReport()    // SRS-11
}
```

**Methods:**

- Query database dengan Eloquent
- Load Blade view dengan data
- Generate PDF dengan DomPDF
- Return PDF as downloadable file

#### Blade Templates

**Location**: `backend/resources/views/reports/`

1. `seller-report.blade.php` - Blue theme, landscape orientation
2. `seller-province-report.blade.php` - Green theme, landscape orientation
3. `product-rating-report.blade.php` - Orange theme, landscape orientation

**Template Features:**

- Professional styling dengan inline CSS
- Color-coded sections
- Responsive tables
- Summary statistics boxes
- Header with title and date
- Footer with copyright

#### Routes

**File**: `backend/routes/api.php`

```php
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::prefix('reports')->controller(AdminReportController::class)->group(function () {
        Route::get('/sellers', 'sellerReport');
        Route::get('/sellers-by-province', 'sellerByProvinceReport');
        Route::get('/products-rating', 'productRatingReport');
    });
});
```

**Endpoints:**

- `GET /api/admin/reports/sellers`
- `GET /api/admin/reports/sellers-by-province`
- `GET /api/admin/reports/products-rating`

**Protection:**

- `auth:sanctum` - Requires authentication
- `role:admin` - Admin users only

---

### Frontend (Next.js + TypeScript)

#### Service Layer

**File**: `frontend/src/services/adminReportService.ts`

```typescript
export const adminReportService = {
  async downloadSellerReport(): Promise<Blob>
  async downloadSellerByProvinceReport(): Promise<Blob>
  async downloadProductRatingReport(): Promise<Blob>
  triggerDownload(blob: Blob, filename: string): void
}
```

**Features:**

- Axios request dengan `responseType: 'blob'`
- Helper untuk trigger browser download
- TypeScript typed responses

#### UI Component

**File**: `frontend/src/components/Admin/ReportSection.tsx`

**Features:**

- 3 download buttons (blue, green, orange themed)
- Loading state dengan spinner
- Error handling dengan alert
- Informative descriptions
- Icon integration
- Auto-filename dengan timestamp

#### Integration

**File**: `frontend/src/app/admin/dashboard/page.tsx`

Report section ditambahkan di bagian bawah dashboard, setelah charts dan tables.

---

## 📊 Data Flow

```
┌─────────────┐
│   Browser   │
│  (Admin)    │
└──────┬──────┘
       │ 1. Click download button
       ▼
┌─────────────────────┐
│  ReportSection.tsx  │
└──────┬──────────────┘
       │ 2. Call service method
       ▼
┌────────────────────────────┐
│ adminReportService.ts      │
│ - Set responseType: 'blob' │
└──────┬─────────────────────┘
       │ 3. GET /api/admin/reports/{type}
       │    with Sanctum token
       ▼
┌───────────────────────────┐
│ Laravel API               │
│ + Middleware:             │
│   - auth:sanctum          │
│   - role:admin            │
└──────┬────────────────────┘
       │ 4. Execute controller method
       ▼
┌───────────────────────────┐
│ AdminReportController     │
│ - Query database          │
│ - Prepare data            │
│ - Load Blade view         │
└──────┬────────────────────┘
       │ 5. Generate PDF
       ▼
┌────────────────────────────┐
│ DomPDF                     │
│ - Render HTML to PDF       │
│ - Set paper size/orientation│
└──────┬─────────────────────┘
       │ 6. Return PDF binary
       ▼
┌────────────────────────────┐
│ Browser                    │
│ - Receive blob             │
│ - Trigger download         │
│ - Save file                │
└────────────────────────────┘
```

---

## 🎨 PDF Design

### Color Themes

| Report                | Theme Color        | Usage                            |
| --------------------- | ------------------ | -------------------------------- |
| Seller Report         | Blue (`#2563eb`)   | Headers, badges, active status   |
| Province Report       | Green (`#059669`)  | Headers, province sections       |
| Product Rating Report | Orange (`#d97706`) | Headers, rating stars, top ranks |

### Layout Elements

**All Reports Include:**

1. **Header Section**

   - Report title (large, bold, colored)
   - Print date
   - Bottom border

2. **Summary Statistics**

   - Info boxes with key metrics
   - Gradient backgrounds
   - Large numbers

3. **Data Tables**

   - Alternating row colors
   - Bordered cells
   - Clear headers
   - Responsive column widths

4. **Footer**
   - Summary text
   - Copyright notice
   - System branding

### Paper Settings

- **Size**: A4
- **Orientation**: Landscape (for wide tables)
- **Margins**: 20px all sides

---

## 🔒 Security

### Authentication & Authorization

✅ Sanctum token required  
✅ Admin role verification  
✅ Protected routes

### Data Access Control

- Only verified/approved data included
- No sensitive information exposed
- Admin-only visibility

---

## 📈 Database Queries

### Report 1: Seller Report

```php
// Active sellers
Seller::with(['user', 'kelurahan.kecamatan.kabupatenKota.provinsi'])
    ->where('status', 'verified')
    ->orderBy('nama_toko')
    ->get()

// Inactive sellers
Seller::with(['user', 'kelurahan.kecamatan.kabupatenKota.provinsi'])
    ->whereIn('status', ['pending', 'rejected'])
    ->orderBy('nama_toko')
    ->get()
```

### Report 2: Seller by Province

```php
// Get provinces with sellers
Provinsi::select('provinsi.*')
    ->join('kabupaten_kota', ...)
    ->join('kecamatan', ...)
    ->join('kelurahan', ...)
    ->join('penjual', ...)
    ->where('penjual.status', 'verified')
    ->distinct()
    ->get()

// Get sellers per province (raw query for performance)
DB::table('penjual')
    ->join('users', ...)
    ->join('kelurahan', ...)
    ->where('kabupaten_kota.provinsi_id', $provinceId)
    ->get()
```

### Report 3: Product Rating Report

```php
Produk::with([
        'seller.user',
        'seller.kelurahan.kecamatan.kabupatenKota.provinsi',
        'kategori',
        'reviews'
    ])
    ->withCount('reviews')
    ->get()
    ->filter(fn($p) => $p->reviews_count > 0)
    ->map(/* calculate average rating */)
    ->sortByDesc('rating')
    ->values()
```

---

## 🧪 Testing

### Manual Testing Steps

#### 1. Test Seller Report (SRS-09)

```bash
# Via browser
1. Login as admin
2. Go to /admin/dashboard
3. Click "Laporan Penjual" button
4. Verify PDF downloads
5. Open PDF and check:
   - Active sellers listed
   - Inactive sellers listed
   - Status badges correct
   - Summary numbers accurate
```

**Expected Output:**

- File: `laporan-penjual-{timestamp}.pdf`
- Content: Active and inactive sellers with complete info
- Layout: Landscape, blue theme

#### 2. Test Province Report (SRS-10)

```bash
# Via browser
1. Login as admin
2. Go to /admin/dashboard
3. Click "Penjual per Provinsi" button
4. Verify PDF downloads
5. Open PDF and check:
   - Provinces grouped correctly
   - Sellers per province accurate
   - Only verified sellers shown
   - Grand total correct
```

**Expected Output:**

- File: `laporan-penjual-per-provinsi-{timestamp}.pdf`
- Content: Sellers grouped by province
- Layout: Landscape, green theme

#### 3. Test Product Rating Report (SRS-11)

```bash
# Via browser
1. Login as admin
2. Go to /admin/dashboard
3. Click "Produk & Rating" button
4. Verify PDF downloads
5. Open PDF and check:
   - Products sorted by rating (high to low)
   - Only products with reviews shown
   - All required fields present (nama, toko, kategori, harga, provinsi)
   - Statistics accurate
```

**Expected Output:**

- File: `laporan-produk-rating-{timestamp}.pdf`
- Content: Products ranked by rating
- Layout: Landscape, orange theme

### API Testing with curl

```powershell
# Get admin token first
$token = "YOUR_ADMIN_TOKEN"

# Test Report 1
Invoke-RestMethod -Uri "http://localhost:8000/api/admin/reports/sellers" `
    -Method GET `
    -Headers @{"Authorization"="Bearer $token"; "Accept"="application/pdf"} `
    -OutFile "test-seller-report.pdf"

# Test Report 2
Invoke-RestMethod -Uri "http://localhost:8000/api/admin/reports/sellers-by-province" `
    -Method GET `
    -Headers @{"Authorization"="Bearer $token"; "Accept"="application/pdf"} `
    -OutFile "test-province-report.pdf"

# Test Report 3
Invoke-RestMethod -Uri "http://localhost:8000/api/admin/reports/products-rating" `
    -Method GET `
    -Headers @{"Authorization"="Bearer $token"; "Accept"="application/pdf"} `
    -OutFile "test-product-report.pdf"
```

---

## 🐛 Troubleshooting

### Issue: PDF tidak ter-download

**Solutions:**

1. Check browser console untuk errors
2. Verify admin authentication
3. Check backend logs: `storage/logs/laravel.log`
4. Ensure DomPDF installed: `composer show barryvdh/laravel-dompdf`

### Issue: PDF kosong atau error rendering

**Solutions:**

1. Check database has data
2. Verify Blade template syntax
3. Check for PHP errors in controller
4. Test individual queries in tinker

### Issue: 401 Unauthorized

**Solutions:**

```bash
# Check token validity
php artisan tinker
$user = User::where('role', 'admin')->first();
$token = $user->createToken('test')->plainTextToken;
echo $token;
```

### Issue: 403 Forbidden

**Solutions:**

```bash
# Verify user is admin
php artisan tinker
$user = User::find(YOUR_USER_ID);
$user->role = 'admin';
$user->save();
```

### Issue: Styling tidak muncul di PDF

**Reason**: DomPDF requires inline CSS  
**Solution**: Semua style sudah inline di Blade templates

---

## 📝 File Summary

### Created Files (7 total)

#### Backend (4 files)

1. `backend/app/Http/Controllers/Admin/AdminReportController.php` - Controller dengan 3 methods
2. `backend/resources/views/reports/seller-report.blade.php` - Template PDF penjual
3. `backend/resources/views/reports/seller-province-report.blade.php` - Template PDF provinsi
4. `backend/resources/views/reports/product-rating-report.blade.php` - Template PDF produk

#### Frontend (2 files)

5. `frontend/src/services/adminReportService.ts` - API service layer
6. `frontend/src/components/Admin/ReportSection.tsx` - UI component

### Modified Files (2 files)

7. `backend/routes/api.php` - Added 3 report routes
8. `frontend/src/app/admin/dashboard/page.tsx` - Added ReportSection

---

## 🚀 Deployment Checklist

### Backend

- [x] Controller created
- [x] Routes registered
- [x] Blade templates created
- [x] Middleware configured
- [ ] Test with production data
- [ ] Verify PDF generation performance

### Frontend

- [x] Service layer implemented
- [x] UI component created
- [x] Integrated to dashboard
- [x] Error handling added
- [ ] Test download flow
- [ ] Verify blob handling in production

---

## 🎓 Technical Details

### DomPDF Configuration

**File**: `config/dompdf.php` (auto-configured by package)

**Key Settings:**

- Default font: Helvetica
- Paper size: A4
- DPI: 96
- Enable remote: false (security)

### Blade Template Best Practices

1. **Use inline CSS** - DomPDF doesn't support external stylesheets
2. **Avoid complex layouts** - Use tables instead of divs
3. **Test print media** - Preview dengan browser print
4. **Optimize images** - Use base64 or external URLs
5. **Keep it simple** - Complex CSS may not render

### Performance Considerations

**Query Optimization:**

- Use `with()` for eager loading
- Avoid N+1 queries
- Limit data with `take()` if needed
- Consider caching for frequent reports

**PDF Generation:**

- DomPDF is synchronous (blocks request)
- Consider queue jobs for large reports
- Monitor memory usage
- Set timeout for large datasets

---

## 📊 Statistics & Metrics

### Expected Report Sizes

| Report          | Approx Size | Generation Time |
| --------------- | ----------- | --------------- |
| Seller Report   | 50-200 KB   | 1-3 seconds     |
| Province Report | 100-500 KB  | 2-5 seconds     |
| Product Rating  | 200-1 MB    | 3-10 seconds    |

_Varies based on data volume_

---

## 🔄 Future Enhancements

### Possible Additions

1. **Date Range Filter**

   - Filter reports by date range
   - Monthly/quarterly reports

2. **Export Formats**

   - Add Excel export option
   - Add CSV export option

3. **Email Reports**

   - Schedule automated email delivery
   - Send reports to multiple recipients

4. **Report Templates**

   - Custom report builder
   - Save favorite report configurations

5. **Charts in PDF**

   - Include visual charts
   - Use image generation libraries

6. **Batch Downloads**
   - Download all reports at once
   - Zip multiple PDFs

---

## 📚 Related Documentation

- [Admin Dashboard](./ADMIN_DASHBOARD.md)
- [Email System](./EMAIL_SETUP.md)
- [API Routes](./backend/routes/api.php)
- [DomPDF Documentation](https://github.com/barryvdh/laravel-dompdf)

---

**Last Updated**: December 10, 2025  
**Version**: 1.0.0  
**Status**: ✅ Ready for Testing  
**SRS Compliance**: SRS-MartPlace-09, 10, 11 - Fully Implemented
