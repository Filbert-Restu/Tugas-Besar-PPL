# Middleware Documentation

This Laravel application includes custom middleware for handling authentication and request logging.

## Available Middleware

### 1. LoggingMiddleware
- **Purpose**: Logs incoming requests and their responses
- **Location**: `app/Http/Middleware/LoggingMiddleware.php`
- **Alias**: `logging`
- **Applied**: Globally to all web routes

**Features:**
- Logs request URL, method, IP address, and user agent
- Logs response status codes
- Provides detailed request/response tracking

### 2. AuthMiddleware
- **Purpose**: Simple authentication for protected routes
- **Location**: `app/Http/Middleware/AuthMiddleware.php`
- **Alias**: `auth.custom`
- **Applied**: To specific routes that need protection

**Authentication Methods:**
1. **Authorization Header**: `Authorization: Bearer valid-token`
2. **Query Parameter**: `?token=valid-token`

## Route Examples

### Public Routes (Logging Only)
```php
GET /              // Welcome page
GET /about         // About page  
GET /api/public    // Public API endpoint
```

### Protected Routes (Auth + Logging)
```php
GET /protected     // Protected endpoint
GET /admin         // Admin dashboard
GET /dashboard     // User dashboard
```

## Usage Examples

### Accessing Public Routes
```bash
curl http://localhost:8000/api/public
```

### Accessing Protected Routes

**With Authorization Header:**
```bash
curl -H "Authorization: Bearer valid-token" http://localhost:8000/protected
```

**With Query Parameter:**
```bash
curl http://localhost:8000/protected?token=valid-token
```

### Invalid Authentication (Returns 401)
```bash
curl http://localhost:8000/protected
curl -H "Authorization: Bearer invalid-token" http://localhost:8000/protected
```

## Middleware Registration

Middleware is registered in `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    // Register custom middleware aliases
    $middleware->alias([
        'auth.custom' => \App\Http\Middleware\AuthMiddleware::class,
        'logging' => \App\Http\Middleware\LoggingMiddleware::class,
    ]);

    // Apply logging middleware globally to web routes
    $middleware->web(append: [
        \App\Http\Middleware\LoggingMiddleware::class,
    ]);
})
```

## Testing

Run the middleware tests:
```bash
php artisan test tests/Feature/MiddlewareTest.php
```

Tests cover:
- Public route accessibility
- Protected route authentication requirements
- Valid authentication acceptance
- Invalid authentication rejection

## Extending the Middleware

### Adding New Middleware
1. Create new middleware class in `app/Http/Middleware/`
2. Register in `bootstrap/app.php`
3. Apply to routes as needed

### Example: Rate Limiting Middleware
```php
php artisan make:middleware RateLimitMiddleware
```

Then register and use in routes:
```php
Route::middleware(['rate.limit'])->group(function () {
    // Rate limited routes
});
```