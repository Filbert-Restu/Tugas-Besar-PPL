<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Seller\SellerProfilController;
use App\Http\Controllers\Seller\SellerProductController;
use App\Http\Controllers\Auth\Seller\RegisteredSellerController;
use App\Http\Controllers\Admin\SellerVerificationController;

// Admin Controllers
use App\Http\Controllers\Admin\AdminCategoryProductController;

// Seller Controllers
use App\Http\Controllers\Seller\SellerDashboardController;
use App\Http\Controllers\Seller\SellerReportController;

// Main Controller
use App\Http\Controllers\MainController;

// Review Controller
use App\Http\Controllers\ReviewController;

// Categories List (Public) - Must be before /{nama_toko}/{id}
Route::get('/categories', [MainController::class, 'categories'])->name('categories.public');

Route::get('/', [MainController::class, 'index'])->name('index');

// Authentication Routes
Route::controller(AuthenticatedSessionController::class)->group(function () {
    Route::post('/login', 'store')->name('login');
    Route::post('/logout', 'destroy')->name('logout');
});

// Review Routes
Route::prefix('reviews')->name('reviews.')->group(function () {
    Route::controller(ReviewController::class)->group(function () {
        Route::get('/product/{productId}', 'getProductReviews')->name('product');
        Route::post('/', 'store')->name('store');
        Route::delete('/{reviewId}', 'destroy')->name('destroy');
    });
});

// Seller Auth Routes
Route::prefix('seller')->name('seller.')->group(function () {
    // Public routes - Registrasi & Login
    Route::post('/register', [RegisteredSellerController::class, 'store'])->name('seller-register');

    Route::middleware(['auth:sanctum', 'role:penjual'])->group(function () {
        Route::controller(SellerProfilController::class)->group(function () {
        Route::get('/profile', 'profile')->name('profile');
        Route::put('/profile', 'updateProfile')->name('profile.update');
        });
        // Route::get('/products', [SellerProductController::class, 'detail'])->name('products.detail');
        Route::prefix('dashboard')->name('dashboard.')->group(function () {
            Route::get('/', [SellerDashboardController::class, 'show'])->name('index');
            Route::get('/statistics', [SellerDashboardController::class, 'statistics'])->name('statistics');
            // Route::get('/', [SellerProfilController::class, 'dashboard'])->name('index');
        });

        // Reports
        Route::prefix('reports')->name('reports.')->controller(SellerReportController::class)->group(function () {
            Route::get('/stock-by-quantity', 'stockByQuantity')->name('stock-by-quantity');
            Route::get('/stock-by-rating', 'stockByRating')->name('stock-by-rating');
            Route::get('/low-stock', 'lowStock')->name('low-stock');
        });

        // tambah kurang hapus edit produk
        Route::prefix('products')->name('products.')->controller(SellerProductController::class)->group(function () {
            Route::get('/', 'show')->name('.list');
            Route::post('/add', 'add')->name('.add');
            Route::put('/edit', 'edit')->name('.edit');
            Route::post('/sum', 'sum')->name('.sum');
            Route::post('/sub', 'sub')->name('.sub');
            Route::post('/delete', 'delete')->name('.delete');
        });
    });
});

// Admin Routes - Seller Verification
Route::prefix('admin')->name('admin.')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        // Route::get('/', [App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('index');
        Route::prefix('categories')->name('categories.')->controller(AdminCategoryProductController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/add', 'store')->name('store');
            Route::put('/edit', 'update')->name('update');
            Route::delete('/delete', 'destroy')->name('destroy');
        });
    });
    Route::prefix('sellers')->name('sellers.')->controller(SellerVerificationController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{userId}', 'show')->name('show');
        Route::post('/approve', 'approve')->name('approve');
        Route::post('/reject', 'reject')->name('reject');
        Route::post('/reset-status', 'resetStatus')->name('reset-status');
    });
});

// Route::get('/statistics', [MainController::class, 'statistics'])->name('statistics');
Route::get('/{nama_toko}/{id}', [MainController::class, 'show'])->name('show');
