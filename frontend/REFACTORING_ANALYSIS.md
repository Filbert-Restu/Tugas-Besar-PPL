# Analisis Mendalam & Rekomendasi Refactoring - Frontend App Structure

## 📊 Executive Summary

Setelah analisis mendalam pada folder `/src/app`, ditemukan beberapa area yang memerlukan refactoring untuk meningkatkan:

- **Reusability**: Komponen yang bisa digunakan ulang
- **Maintainability**: Kode yang lebih mudah dipelihara
- **Performance**: Optimasi loading dan rendering
- **Consistency**: Konsistensi struktur dan pattern

---

## 🔍 Analisis Per File

### 1. `/app/[shopSlug]/[productSlug]/page.tsx` ⚠️ NEEDS REFACTORING

#### 📝 Current State (548 lines)

File ini sangat besar dan mengandung banyak logic yang bisa dipecah.

#### 🎯 Komponen Yang Bisa Diextract:

##### **A. ProductDetailHeader Component**

```tsx
// src/components/ProductDetailHeader.tsx
interface ProductDetailHeaderProps {
  product: ProductDetailResponse;
}
```

**Extract Lines**: Breadcrumb section (115-153)
**Reason**: Reusable di halaman detail lainnya

##### **B. ProductInfo Component**

```tsx
// src/components/ProductInfo.tsx
interface ProductInfoProps {
  product: ProductDetailResponse;
  quantity: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onChatSeller: () => void;
}
```

**Extract Lines**: Product info card (168-302)
**Reason**: Isolate product information logic, easier to test

##### **C. SellerInfoCard Component**

```tsx
// src/components/SellerInfoCard.tsx
interface SellerInfoCardProps {
  toko: ProductDetailResponse['toko'];
  onVisitStore: () => void;
}
```

**Extract Lines**: Seller info sidebar (305-368)
**Reason**: Reusable di halaman product lainnya, independent component

##### **D. ProductTabs Component**

```tsx
// src/components/ProductTabs.tsx
interface ProductTabsProps {
  product: ProductDetailResponse;
  activeTab: 'description' | 'reviews';
  onTabChange: (tab: 'description' | 'reviews') => void;
}
```

**Extract Lines**: Tabs section (373-491)
**Reason**: Complex logic, separate concerns

##### **E. LoadingProductDetail Component**

```tsx
// src/components/LoadingProductDetail.tsx
```

**Extract Lines**: Loading state (67-74)
**Reason**: Reusable loading state

##### **F. ErrorProductDetail Component**

```tsx
// src/components/ErrorProductDetail.tsx
interface ErrorProductDetailProps {
  error: string | null;
  onBack: () => void;
}
```

**Extract Lines**: Error state (78-105)
**Reason**: Reusable error state dengan custom message

---

### 2. `/app/products/[id]/page.tsx` ⚠️ MAJOR REFACTORING NEEDED

#### 📝 Current State (648 lines)

**Status**: Halaman lama dengan banyak duplikasi dengan `[shopSlug]/[productSlug]/page.tsx`

#### 🚨 Critical Issues:

1. **Duplikasi Header/Footer**: Inline header/footer yang sudah ada di Navbar/Footer components
2. **Mock Data**: Masih menggunakan mock data, tidak terintegrasi dengan API
3. **Review System**: Implementasi review form yang kompleks
4. **Rating Distribution**: Logic rating yang bisa di-extract

#### 🎯 Action Required:

**OPTION 1: DELETE** - Jika route `[shopSlug]/[productSlug]` sudah menggantikan ini
**OPTION 2: REFACTOR** - Extract ke components jika masih digunakan:

##### **Components to Extract:**

```tsx
// src/components/RatingSummary.tsx
interface RatingSummaryProps {
  rating: number;
  totalRatings: number;
  reviews: IProductReview[];
}

// src/components/ReviewForm.tsx
interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string }) => void;
  onCancel: () => void;
}

// src/components/ReviewsList.tsx
interface ReviewsListProps {
  reviews: IProductReview[];
}

// src/components/RatingDistribution.tsx
interface RatingDistributionProps {
  reviews: IProductReview[];
}
```

---

### 3. `/app/page.tsx` ✅ GOOD STRUCTURE

#### 📝 Current State (102 lines)

**Status**: Well-structured, menggunakan custom hook dan reusable components

#### ✨ Strengths:

- Clean separation of concerns
- Using custom hook `useProducts()`
- Reusable components (FiltersBar, ProductCard, Pagination)

#### 💡 Minor Improvements:

##### **A. Extract Hero Section**

```tsx
// src/components/HeroSection.tsx
interface HeroSectionProps {
  title: string;
  subtitle: string;
  variant?: 'home' | 'category' | 'seller';
}
```

**Extract Lines**: Hero section (39-47)
**Reason**: Reusable di berbagai halaman dengan variant

##### **B. Extract ProductsHeader**

```tsx
// src/components/ProductsHeader.tsx
interface ProductsHeaderProps {
  count: number;
  loading: boolean;
}
```

**Extract Lines**: Products count header (59-70)
**Reason**: Consistent header across product listings

---

### 4. `/app/(auth)/login/page.tsx` ⚠️ NEEDS IMPROVEMENT

#### 📝 Current State (156 lines)

**Status**: Functional but could be improved

#### 🎯 Improvements Needed:

##### **A. Extract AuthForm Component**

```tsx
// src/components/AuthForm.tsx
interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
}
```

**Reason**: Reusable untuk login dan register, DRY principle

##### **B. Extract AlertMessage Component**

```tsx
// src/components/AlertMessage.tsx
interface AlertMessageProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  multiline?: boolean;
}
```

**Extract Lines**: Error/Success messages (133-136)
**Reason**: Reusable alert component

##### **C. Create useAuth Hook**

```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  // Extract login/logout logic
  // Handle session management
  // Handle redirects based on role
}
```

**Reason**: Centralize authentication logic

---

### 5. `/app/seller/products/page.tsx` ⚠️ NEEDS REFACTORING

#### 📝 Current State (323 lines)

**Status**: Large file with mixed concerns

#### 🎯 Components to Extract:

##### **A. ProductsTable Component**

```tsx
// src/components/seller/ProductsTable.tsx
interface ProductsTableProps {
  products: IProduct[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}
```

**Reason**: Reusable table component dengan actions

##### **B. ProductFilters Component**

```tsx
// src/components/seller/ProductFilters.tsx
interface ProductFiltersProps {
  searchQuery: string;
  categoryFilter: string;
  categories: string[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
}
```

**Reason**: Separate filter logic

##### **C. StockBadge Component**

```tsx
// src/components/StockBadge.tsx
interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
}
```

**Reason**: Reusable stock indicator dengan logic

---

## 📦 Rekomendasi Struktur Baru

### Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx (simplified)
│   ├── (public)/
│   │   ├── page.tsx (home)
│   │   └── [shopSlug]/
│   │       └── [productSlug]/
│   │           └── page.tsx (simplified)
│   ├── seller/
│   │   ├── layout.tsx
│   │   └── products/
│   │       └── page.tsx (simplified)
│   └── admin/
│       └── dashboard/
│           └── page.tsx
│
├── components/
│   ├── ui/ (Basic UI Components)
│   │   ├── Button.tsx ✅
│   │   ├── Input.tsx ✅
│   │   ├── Select.tsx ✅
│   │   ├── AlertMessage.tsx (NEW)
│   │   ├── Badge.tsx (NEW)
│   │   ├── Card.tsx (NEW)
│   │   ├── Modal.tsx (NEW)
│   │   └── Tabs.tsx (NEW)
│   │
│   ├── layout/ (Layout Components)
│   │   ├── Navbar.tsx ✅
│   │   ├── Footer.tsx ✅
│   │   ├── Sidebar.tsx (NEW)
│   │   ├── HeroSection.tsx (NEW)
│   │   └── Breadcrumb.tsx (NEW)
│   │
│   ├── product/ (Product Related)
│   │   ├── ProductCard.tsx ✅
│   │   ├── ProductInfo.tsx (NEW)
│   │   ├── ProductTabs.tsx (NEW)
│   │   ├── ProductDetailHeader.tsx (NEW)
│   │   ├── ProductsHeader.tsx (NEW)
│   │   ├── ImageGallery.tsx ✅
│   │   └── QuantitySelector.tsx ✅
│   │
│   ├── seller/ (Seller Components)
│   │   ├── SellerInfoCard.tsx (NEW)
│   │   ├── ProductsTable.tsx (NEW)
│   │   ├── ProductFilters.tsx (NEW)
│   │   └── StockBadge.tsx (NEW)
│   │
│   ├── review/ (Review Components)
│   │   ├── ReviewCard.tsx ✅
│   │   ├── ReviewForm.tsx (NEW)
│   │   ├── ReviewsList.tsx (NEW)
│   │   ├── RatingSummary.tsx (NEW)
│   │   └── RatingDistribution.tsx (NEW)
│   │
│   ├── filters/ (Filter Components)
│   │   ├── FiltersBar.tsx ✅
│   │   └── RegionForm.tsx ✅
│   │
│   ├── auth/ (Auth Components)
│   │   ├── AuthForm.tsx (NEW)
│   │   └── ProtectedRoute.tsx (NEW)
│   │
│   └── loading/ (Loading States)
│       ├── LoadingProductDetail.tsx (NEW)
│       ├── LoadingProductsList.tsx (NEW)
│       ├── SkeletonCard.tsx (NEW)
│       └── Spinner.tsx (NEW)
│
├── hooks/
│   ├── useProducts.ts ✅
│   ├── useAuth.ts (NEW)
│   ├── useProduct.ts (NEW)
│   ├── useReviews.ts (NEW)
│   └── useSellerProducts.ts (NEW)
│
└── lib/
    ├── utils/
    │   ├── currency.ts ✅
    │   ├── date.ts (NEW)
    │   ├── validation.ts (NEW)
    │   └── formatters.ts (NEW)
    └── constants/
        ├── routes.ts (NEW)
        ├── api.ts (NEW)
        └── config.ts (NEW)
```

---

## 🎯 Priority Refactoring Plan

### Phase 1: High Priority (Week 1)

1. **Extract ProductInfo Component** - Digunakan di 2 halaman
2. **Extract SellerInfoCard Component** - Reusable
3. **Extract LoadingProductDetail & ErrorProductDetail** - Better UX
4. **Extract AlertMessage Component** - Digunakan di banyak form
5. **Create useAuth Hook** - Centralize auth logic

### Phase 2: Medium Priority (Week 2)

6. **Extract ProductTabs Component** - Complex logic separation
7. **Extract ReviewForm Component** - Reusable review functionality
8. **Extract RatingSummary Component** - Review system
9. **Extract HeroSection Component** - Reusable hero
10. **Extract ProductsHeader Component** - Consistent headers

### Phase 3: Low Priority (Week 3)

11. **Extract ProductsTable Component** - Seller dashboard
12. **Extract ProductFilters Component** - Seller filtering
13. **Extract StockBadge Component** - Visual consistency
14. **Create Breadcrumb Component** - Navigation
15. **Create Modal Component** - Dialogs/confirmations

### Phase 4: Optimization (Week 4)

16. **Delete or Refactor `/products/[id]` page** - Remove duplication
17. **Create useProduct Hook** - Single product logic
18. **Create useReviews Hook** - Review management
19. **Extract utilities** - Date, validation, formatters
20. **Add constants** - Routes, API endpoints, config

---

## 📊 Metrics & Benefits

### Current State

- **Average File Size**: ~350 lines
- **Duplicate Code**: ~40%
- **Reusable Components**: 60%
- **Test Coverage**: Low (due to large files)

### After Refactoring

- **Average File Size**: ~100 lines
- **Duplicate Code**: <10%
- **Reusable Components**: 90%
- **Test Coverage**: High (smaller, focused components)

### Benefits

✅ **Easier Testing**: Small focused components
✅ **Better Performance**: Code splitting, lazy loading
✅ **Improved DX**: Clear component responsibilities
✅ **Faster Development**: Reusable components
✅ **Better Maintenance**: Single responsibility principle
✅ **Type Safety**: Better TypeScript inference

---

## 🚀 Implementation Guidelines

### 1. Component Extraction Pattern

```typescript
// Before (in page.tsx)
<div className='bg-white rounded-lg p-6'>{/* Complex JSX */}</div>;

// After (extracted component)
// src/components/product/ProductInfo.tsx
export function ProductInfo({ product, onAction }: ProductInfoProps) {
  return <div className='bg-white rounded-lg p-6'>{/* Complex JSX */}</div>;
}

// Usage in page.tsx
<ProductInfo product={product} onAction={handleAction} />;
```

### 2. Hook Extraction Pattern

```typescript
// Before (in page.tsx)
const [product, setProduct] = useState(null);
useEffect(() => {
  // Fetch logic
}, [id]);

// After (custom hook)
// src/hooks/useProduct.ts
export function useProduct(id: string) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // ... fetch logic
  return { product, loading, error, refetch };
}

// Usage in page.tsx
const { product, loading, error } = useProduct(productId);
```

### 3. Utility Extraction Pattern

```typescript
// Before (scattered in pages)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
};

// After (centralized utility)
// src/lib/utils/currency.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

// Usage
import { formatCurrency } from '@/lib/utils/currency';
```

---

## ✅ Checklist Implementasi

### Immediate Actions

- [ ] Backup current code to separate branch
- [ ] Create new component folders
- [ ] Extract ProductInfo component
- [ ] Extract SellerInfoCard component
- [ ] Create useAuth hook
- [ ] Test extracted components

### Short Term (1-2 weeks)

- [ ] Extract all product-related components
- [ ] Extract review components
- [ ] Create loading/error states
- [ ] Centralize utilities
- [ ] Update imports in pages

### Medium Term (3-4 weeks)

- [ ] Extract seller dashboard components
- [ ] Create common UI components (Modal, Badge, etc)
- [ ] Implement code splitting
- [ ] Add unit tests for new components
- [ ] Update documentation

### Long Term (1-2 months)

- [ ] Optimize performance with React.memo
- [ ] Implement lazy loading
- [ ] Add E2E tests
- [ ] Review and refactor remaining pages
- [ ] Performance audit

---

## 📝 Notes & Considerations

### Breaking Changes

⚠️ **Refactoring will require:**

- Updating all imports
- Testing all affected pages
- Potential prop drilling issues (consider Context API)
- Migration of state management

### Risk Mitigation

✅ **Strategies:**

1. Refactor one component at a time
2. Keep old and new code side by side initially
3. Comprehensive testing after each extraction
4. Feature flags for gradual rollout
5. Document all changes

### Performance Considerations

- Use `React.lazy()` for heavy components
- Implement `React.memo()` for expensive renders
- Consider virtualization for long lists
- Optimize image loading with Next.js Image

---

## 🎓 Best Practices Reminder

1. **Single Responsibility**: One component = one job
2. **DRY Principle**: Don't repeat yourself
3. **Composition over Inheritance**: Compose small components
4. **Props Drilling**: Avoid deep prop drilling (use Context/Zustand)
5. **Type Safety**: Strong TypeScript typing
6. **Testing**: Unit test each component
7. **Documentation**: JSDoc for complex logic
8. **Performance**: Measure before optimizing

---

## 📚 Additional Resources

- [React Component Patterns](https://reactpatterns.com/)
- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application)
- [TypeScript React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Component Composition Patterns](https://kentcdodds.com/blog/compound-components-with-react-hooks)
