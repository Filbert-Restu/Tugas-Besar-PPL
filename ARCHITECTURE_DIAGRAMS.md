# Admin Dashboard Architecture

## System Flow Diagram

```mermaid
sequenceDiagram
    participant Browser
    participant NextJS
    participant Hook
    participant Service
    participant Laravel
    participant Database

    Browser->>NextJS: Navigate to /admin/dashboard
    NextJS->>NextJS: Check authentication
    NextJS->>Hook: useAdminDashboard()
    Hook->>Hook: useState (loading=true)
    Hook->>Service: adminDashboardService.getStatistics()
    Service->>Laravel: GET /api/admin/dashboard/statistics
    Laravel->>Laravel: Verify Sanctum token
    Laravel->>Laravel: Check role:admin middleware
    Laravel->>Database: Query produk count
    Database-->>Laravel: Return count
    Laravel->>Database: Query kategori with count
    Database-->>Laravel: Return data
    Laravel->>Database: Query provinsi with seller count
    Database-->>Laravel: Return data
    Laravel->>Database: Query reviews statistics
    Database-->>Laravel: Return data
    Laravel-->>Service: JSON Response
    Service-->>Hook: Parsed data
    Hook->>Hook: setState (data, loading=false)
    Hook-->>NextJS: Return {data, loading, error}
    NextJS->>NextJS: Render components
    NextJS-->>Browser: Display dashboard
```

## Component Hierarchy

```mermaid
graph TD
    A[page.tsx<br/>Admin Dashboard] --> B[useAdminDashboard Hook]
    B --> C[adminDashboardService]
    C --> D[API Client]
    D --> E[Laravel Backend]

    A --> F[LoadingState]
    A --> G[ErrorState]
    A --> H[StatsCard x6]
    A --> I[ProductsByCategoryChart]
    A --> J[StoresByProvinceChart]
    A --> K[UserStatusChart]
    A --> L[RatingDistributionChart]
    A --> M[TopRatedProductsTable]

    I --> N[ChartBar]
    J --> N
    L --> N
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph Frontend
        A[Browser] --> B[page.tsx]
        B --> C[useAdminDashboard]
        C --> D[adminDashboardService]
    end

    subgraph Backend
        E[AdminDashboardController] --> F[Eloquent Models]
        F --> G[(SQLite Database)]

        F1[Produk Model]
        F2[Seller Model]
        F3[KategoriProduk Model]
        F4[Provinsi Model]
        F5[ProdukReviews Model]

        F --> F1
        F --> F2
        F --> F3
        F --> F4
        F --> F5
    end

    D -->|HTTP GET| E
    E -->|JSON Response| D
```

## Dashboard Layout Structure

```mermaid
graph TB
    subgraph Dashboard Page
        A[Header]

        subgraph Summary Cards Row 1
            B1[Total Produk]
            B2[Total Toko]
            B3[Pending Verifikasi]
            B4[Total Kategori]
        end

        subgraph Summary Cards Row 2
            C1[Total Review]
            C2[Rating Rata-rata]
        end

        subgraph Charts Row 1
            D1[Products by Category]
            D2[Stores by Province]
        end

        subgraph Charts Row 2
            E1[User Status]
            E2[Rating Distribution]
        end

        F[Top Rated Products Table]
    end

    A --> B1 & B2 & B3 & B4
    B1 & B2 & B3 & B4 --> C1 & C2
    C1 & C2 --> D1 & D2
    D1 & D2 --> E1 & E2
    E1 & E2 --> F
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Frontend
    participant Laravel
    participant Database

    User->>Browser: Access /admin/dashboard
    Browser->>Frontend: Route request
    Frontend->>Frontend: Check localStorage token

    alt Token exists
        Frontend->>Laravel: GET with Bearer token
        Laravel->>Laravel: Verify Sanctum token

        alt Token valid
            Laravel->>Database: Check user role
            Database-->>Laravel: role='admin'

            alt User is admin
                Laravel-->>Frontend: 200 OK + Data
                Frontend-->>Browser: Render dashboard
                Browser-->>User: Show dashboard
            else User not admin
                Laravel-->>Frontend: 403 Forbidden
                Frontend-->>Browser: Show error
                Browser-->>User: Access Denied
            end
        else Token invalid
            Laravel-->>Frontend: 401 Unauthorized
            Frontend-->>Browser: Redirect to login
            Browser-->>User: Login page
        end
    else No token
        Frontend-->>Browser: Redirect to login
        Browser-->>User: Login page
    end
```

## State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> FetchingData: useEffect triggered
    FetchingData --> Success: API returns data
    FetchingData --> Error: API fails
    Success --> Rendered: Components mount
    Error --> ErrorState: Show error UI
    ErrorState --> FetchingData: User clicks retry
    Rendered --> [*]
```

## Database Query Strategy

```mermaid
flowchart TD
    A[AdminDashboardController] --> B{Query Type}

    B -->|Aggregation| C[Count Queries]
    B -->|Relationship| D[WithCount Queries]
    B -->|Statistics| E[Average/Sum Queries]

    C --> C1[Produk::count]
    C --> C2[Seller::count]
    C --> C3[KategoriProduk::count]
    C --> C4[ProdukReviews::count]

    D --> D1[KategoriProduk::withCount produk]
    D --> D2[Provinsi::withCount seller]
    D --> D3[Produk::withAvg reviews]

    E --> E1[ProdukReviews::avg rating]
    E --> E2[Group by rating]

    C1 & C2 & C3 & C4 & D1 & D2 & D3 & E1 & E2 --> F[Combine Results]
    F --> G[Return JSON]
```

## Component Interaction

```mermaid
graph LR
    subgraph page.tsx
        A[Main Component]
    end

    subgraph Data Layer
        B[useAdminDashboard Hook]
        C[adminDashboardService]
    end

    subgraph UI Components
        D1[StatsCard]
        D2[Charts]
        D3[Table]
    end

    subgraph Utility Components
        E1[LoadingState]
        E2[ErrorState]
    end

    A --> B
    B --> C
    B --> E1
    B --> E2
    B --> D1 & D2 & D3
```

## Responsive Design Breakpoints

```mermaid
graph LR
    subgraph Mobile < 768px
        A1[1 Column<br/>All Components Stack]
    end

    subgraph Tablet 768-1024px
        B1[2 Columns<br/>Stats Cards]
        B2[1 Column<br/>Charts]
    end

    subgraph Desktop > 1024px
        C1[4 Columns<br/>Stats Row 1]
        C2[2 Columns<br/>Stats Row 2]
        C3[2 Columns<br/>All Charts]
    end
```

## Error Handling Strategy

```mermaid
flowchart TD
    A[API Call] --> B{Response Status}

    B -->|200 OK| C[Parse Data]
    B -->|401| D[Unauthorized]
    B -->|403| E[Forbidden]
    B -->|500| F[Server Error]
    B -->|Network Error| G[Connection Failed]

    C --> H[Render Dashboard]
    D --> I[Redirect to Login]
    E --> J[Show Access Denied]
    F --> K[Show Error State]
    G --> K

    K --> L[Retry Button]
    L --> A
```

---

These diagrams illustrate the complete architecture of the Admin Dashboard feature, from data flow to component hierarchy to error handling strategies.
