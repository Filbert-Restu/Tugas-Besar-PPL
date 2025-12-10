# Admin Dashboard - MartPlace

Dashboard administratif lengkap dengan visualisasi statistik platform e-commerce.

## 📋 Fitur Sesuai SRS-MartPlace-07

Dashboard ini mengimplementasikan requirement **SRS-MartPlace-07**:

> "Dashboard dalam bentuk grafis untuk platform menampilkan informasi sebaran jumlah produk berdasarkan kategori, sebaran jumlah toko berdasarkan Lokasi propinsi, jumlah user penjual aktif dan tidak aktif, dan jumlah pengunjung yang memberikan komentar dan rating"

### ✅ Komponen yang Diimplementasikan

1. **Summary Cards** - Ringkasan statistik utama
2. **Products by Category Chart** - Grafik sebaran produk per kategori
3. **Stores by Province Chart** - Grafik sebaran toko per provinsi (Top 10)
4. **User Status Chart** - Grafik donut status penjual (aktif/tidak aktif)
5. **Rating Distribution Chart** - Distribusi rating 1-5 bintang
6. **Top Rated Products Table** - Tabel 10 produk rating tertinggi

---

## 🏗️ Arsitektur

### Backend (Laravel)

#### Controller

**File**: `backend/app/Http/Controllers/Admin/AdminDashboardController.php`

```php
public function statistics()
{
    return response()->json([
        'message' => 'Admin dashboard statistics fetched successfully',
        'data' => [
            'summary' => [...],
            'produk_per_kategori' => [...],
            'toko_per_provinsi' => [...],
            'user_status' => [...],
            'rating_distribution' => [...],
            'top_rated_products' => [...]
        ]
    ]);
}
```

#### Route

**File**: `backend/routes/api.php`

```php
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/dashboard/statistics', [AdminDashboardController::class, 'statistics']);
});
```

**Endpoint**: `GET /api/admin/dashboard/statistics`  
**Middleware**: `auth:sanctum`, `role:admin`  
**Response**: JSON dengan struktur `AdminDashboardStats`

---

### Frontend (Next.js + TypeScript)

#### Service Layer

**File**: `frontend/src/services/adminDashboardService.ts`

```typescript
export interface AdminDashboardStats {
  summary: {
    total_produk: number;
    total_kategori: number;
    total_toko: number;
    toko_aktif: number;
    toko_tidak_aktif: number;
    pending_verifikasi: number;
    total_review: number;
    average_rating: number;
  };
  produk_per_kategori: Array<{kategori: string; jumlah_produk: number}>;
  toko_per_provinsi: Array<{provinsi: string; jumlah_toko: number}>;
  user_status: {aktif: number; tidak_aktif: number};
  rating_distribution: Record<number, number>;
  top_rated_products: Array<{...}>;
}
```

#### Custom Hook

**File**: `frontend/src/hooks/Admin/useAdminDashboard.ts`

```typescript
export const useAdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data on mount
  }, []);

  return { data, loading, error };
};
```

#### Komponen UI

| Komponen                  | Lokasi                                         | Deskripsi                                  |
| ------------------------- | ---------------------------------------------- | ------------------------------------------ |
| `StatsCard`               | `components/Admin/StatsCard.tsx`               | Card statistik dengan icon dan warna       |
| `ProductsByCategoryChart` | `components/Admin/ProductsByCategoryChart.tsx` | Bar chart horizontal kategori produk       |
| `StoresByProvinceChart`   | `components/Admin/StoresByProvinceChart.tsx`   | Bar chart horizontal top 10 provinsi       |
| `UserStatusChart`         | `components/Admin/UserStatusChart.tsx`         | Donut chart SVG status penjual             |
| `RatingDistributionChart` | `components/Admin/RatingDistributionChart.tsx` | Bar chart distribusi rating dengan bintang |
| `TopRatedProductsTable`   | `components/Admin/TopRatedProductsTable.tsx`   | Tabel responsif produk top 10              |

#### Main Page

**File**: `frontend/src/app/admin/dashboard/page.tsx`

Halaman utama yang mengassemble semua komponen dengan layout responsif.

---

## 🎨 Desain UI

### Layout Grid

```
┌─────────────────────────────────────────────┐
│  Header: Dashboard Admin                    │
├──────┬──────┬──────┬──────────────────────┤
│ Card │ Card │ Card │ Card                  │ Summary Stats (4 cards)
├──────┴──────┴──────┴──────────────────────┤
│ Card │ Card                                 │ Review Stats (2 cards)
├──────────────────────┬─────────────────────┤
│ Products by Category │ Stores by Province  │ Charts Row 1
├──────────────────────┼─────────────────────┤
│ User Status Donut    │ Rating Distribution │ Charts Row 2
├──────────────────────┴─────────────────────┤
│ Top Rated Products Table                   │ Table
└─────────────────────────────────────────────┘
```

### Responsivitas

- **Desktop (lg)**: 2 kolom untuk charts
- **Tablet (md)**: 2 kolom untuk stats cards
- **Mobile**: 1 kolom untuk semua komponen

### Color Scheme

| Elemen        | Warna         | Kelas Tailwind                   |
| ------------- | ------------- | -------------------------------- |
| Primary Stats | Blue          | `bg-blue-500`                    |
| Success Stats | Green         | `bg-green-500`                   |
| Warning Stats | Yellow        | `bg-yellow-500`                  |
| Info Stats    | Purple/Indigo | `bg-purple-500`, `bg-indigo-500` |
| Charts        | Various       | Gradient colors per data point   |

---

## 📊 Data Flow

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │ 1. Mount page.tsx
       ▼
┌─────────────────────┐
│ useAdminDashboard() │ ← Custom Hook
└──────┬──────────────┘
       │ 2. useEffect triggers
       ▼
┌────────────────────────────┐
│ adminDashboardService      │
│ .getStatistics()           │
└──────┬─────────────────────┘
       │ 3. GET /api/admin/dashboard/statistics
       ▼
┌───────────────────────────┐
│ Laravel API               │
│ + Middleware:             │
│   - auth:sanctum          │
│   - role:admin            │
└──────┬────────────────────┘
       │ 4. Execute queries
       ▼
┌───────────────────────────┐
│ AdminDashboardController  │
│ .statistics()             │
│                           │
│ Queries:                  │
│ - Produk::count()         │
│ - Seller::whereHas()      │
│ - ProdukReviews::avg()    │
│ - etc.                    │
└──────┬────────────────────┘
       │ 5. Return JSON
       ▼
┌────────────────────────────┐
│ React Components           │
│ - Render charts            │
│ - Display stats            │
│ - Show table               │
└────────────────────────────┘
```

---

## 🔒 Authentication & Authorization

### Requirements

1. **Authentication**: User harus login dengan Sanctum token
2. **Role**: User harus memiliki role `admin`
3. **Middleware**: Route dilindungi oleh `auth:sanctum` dan `role:admin`

### Implementasi Frontend

```typescript
// apiClient automatically includes Sanctum token
import apiClient from '@/lib/apiClient';

// Call protected endpoint
const response = await apiClient.get('/api/admin/dashboard/statistics');
```

### Error Handling

| Status Code | Arti                       | Handling di UI                       |
| ----------- | -------------------------- | ------------------------------------ |
| 200         | Success                    | Render dashboard                     |
| 401         | Unauthenticated            | Redirect to login                    |
| 403         | Unauthorized (bukan admin) | Show error "Access Denied"           |
| 500         | Server Error               | Show error state dengan retry button |

---

## 📈 Metrics yang Ditampilkan

### 1. Summary Cards

| Metric             | Deskripsi                   | Query                                                     |
| ------------------ | --------------------------- | --------------------------------------------------------- |
| Total Produk       | Jumlah semua produk         | `Produk::count()`                                         |
| Total Toko         | Jumlah seller terverifikasi | `Seller::where('status_verifikasi', 'verified')->count()` |
| Pending Verifikasi | Seller menunggu verifikasi  | `Seller::where('status_verifikasi', 'pending')->count()`  |
| Total Kategori     | Jumlah kategori produk      | `KategoriProduk::count()`                                 |
| Total Review       | Jumlah semua review         | `ProdukReviews::count()`                                  |
| Rating Rata-rata   | Average rating semua produk | `ProdukReviews::avg('rating')`                            |

### 2. Products by Category

Menampilkan distribusi produk per kategori dengan:

- Nama kategori
- Jumlah produk
- Persentase dari total
- Bar chart horizontal dengan warna berbeda

**Query**:

```php
KategoriProduk::withCount('produk')
    ->orderBy('produk_count', 'desc')
    ->get()
```

### 3. Stores by Province

Top 10 provinsi dengan jumlah toko terbanyak:

- Nama provinsi
- Jumlah toko
- Ranking visual (1-10)
- Gradient bar chart

**Query**:

```php
Provinsi::withCount(['seller' => function($query) {
        $query->whereHas('user', function($q) {
            $q->where('status_verifikasi', 'verified');
        });
    }])
    ->orderBy('seller_count', 'desc')
    ->limit(10)
    ->get()
```

### 4. User Status

Donut chart menampilkan:

- Seller aktif (verified)
- Seller tidak aktif (pending/rejected)
- Persentase masing-masing
- Total di tengah donut

### 5. Rating Distribution

Histogram rating 1-5 bintang:

- Visual bintang untuk setiap level
- Bar horizontal dengan persentase
- Jumlah review per rating
- Total review summary

**Query**:

```php
ProdukReviews::select('rating', DB::raw('count(*) as count'))
    ->groupBy('rating')
    ->orderBy('rating', 'desc')
    ->pluck('count', 'rating')
```

### 6. Top Rated Products

Tabel 10 produk dengan rating tertinggi:

- Rank (1-10)
- Nama produk
- Nama toko
- Kategori (badge)
- Rating (bintang)
- Jumlah review

**Query**:

```php
Produk::with(['seller.user', 'kategori'])
    ->withAvg('reviews', 'rating')
    ->withCount('reviews')
    ->having('reviews_count', '>', 0)
    ->orderBy('reviews_avg_rating', 'desc')
    ->limit(10)
    ->get()
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Backend

- [ ] Access endpoint dengan admin token → Should return 200
- [ ] Access endpoint tanpa token → Should return 401
- [ ] Access endpoint dengan user role → Should return 403
- [ ] Verify response structure matches `AdminDashboardStats` interface
- [ ] Check all queries return correct data types

#### Frontend

- [ ] Page loads dengan loading state
- [ ] Data fetched dan displayed correctly
- [ ] All charts render without errors
- [ ] Stats cards show correct icons dan colors
- [ ] Table displays correctly dengan responsive design
- [ ] Error state shows ketika API fails
- [ ] Mobile responsive layout works

### Testing Commands

```bash
# Test backend endpoint dengan curl
curl -X GET \
  http://localhost:8000/api/admin/dashboard/statistics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"

# Test frontend development
cd frontend
pnpm dev
# Navigate to: http://localhost:3000/admin/dashboard
```

---

## 🚀 Deployment Checklist

### Backend

- [ ] Ensure `AdminDashboardController` is deployed
- [ ] Verify route is registered di `api.php`
- [ ] Check middleware configuration
- [ ] Run migrations untuk ensure database structure
- [ ] Seed database dengan sample data
- [ ] Test endpoint di production

### Frontend

- [ ] Build frontend: `pnpm build`
- [ ] Verify all components compiled without errors
- [ ] Check environment variables (`NEXT_PUBLIC_API_URL`)
- [ ] Test dashboard di production URL
- [ ] Verify authentication flow works
- [ ] Check responsive design on real devices

---

## 🐛 Troubleshooting

### Problem: "401 Unauthorized"

**Solution**:

- Pastikan user sudah login
- Verify Sanctum token di localStorage/cookies
- Check `apiClient` configuration includes token

### Problem: "403 Forbidden"

**Solution**:

- User tidak memiliki role `admin`
- Check database: `users.role` should be `'admin'`
- Verify `role:admin` middleware working

### Problem: Dashboard shows loading forever

**Solution**:

- Check browser console untuk errors
- Verify API endpoint URL correct
- Test backend endpoint dengan curl/Postman
- Check CORS configuration

### Problem: Charts tidak render

**Solution**:

- Verify data structure from API matches TypeScript interfaces
- Check browser console untuk React errors
- Ensure data tidak null/undefined
- Test dengan mock data first

### Problem: "No products/stores/reviews" shown

**Solution**:

- Database perlu di-seed dengan data
- Run: `php artisan db:seed`
- Or create manual test data

---

## 📝 Future Enhancements

### Possible Additions

1. **Date Range Filter**

   - Filter statistics by date range
   - Show trends over time

2. **Export Functionality**

   - Export statistics to PDF
   - Export data to CSV/Excel

3. **Real-time Updates**

   - WebSocket integration
   - Auto-refresh every X minutes

4. **More Detailed Analytics**

   - Sales trends
   - Revenue metrics
   - User engagement metrics

5. **Comparison Views**

   - Month-over-month comparison
   - Year-over-year comparison

6. **Drill-down Capability**
   - Click category to see products
   - Click province to see stores detail

---

## 📚 Related Documentation

- [Email System Documentation](./EMAIL_SETUP.md)
- [Seller Verification Flow](./backend/app/Http/Controllers/Admin/SellerVerificationController.php)
- [API Routes](./backend/routes/api.php)
- [Frontend Components](./frontend/src/components/Admin/)

---

## 👥 Development Team Notes

### Code Style

- Backend: PSR-12 PHP standards
- Frontend: ESLint + Prettier configured
- TypeScript: Strict mode enabled

### Naming Conventions

- Controllers: `XxxController.php`
- Services: `xxxService.ts`
- Components: `PascalCase.tsx`
- Hooks: `useXxx.ts`

### Git Workflow

- Branch pattern: `feature/admin-dashboard`
- Commit messages: Conventional commits
- PR required before merge to main

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
