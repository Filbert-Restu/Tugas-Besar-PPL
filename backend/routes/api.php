<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Seller\SellerProfilController;
use App\Http\Controllers\Seller\SellerProductController;
use App\Http\Controllers\Auth\Seller\RegisteredSellerController;
use App\Http\Controllers\Admin\SellerVerificationController;

// Admin Controllers
use App\Http\Controllers\Admin\AdminCategoryProductController;

// Authentication Routes
Route::controller(AuthenticatedSessionController::class)->group(function () {
    Route::post('/login', 'store')->name('login');
    Route::post('/logout', 'destroy')->name('logout');
});

// Seller Auth Routes
Route::prefix('seller')->name('seller.')->group(function () {
    // Public routes - Registrasi & Login
    Route::post('/register', [RegisteredSellerController::class, 'store'])->name('seller-register');

    Route::middleware(['auth:sanctum', 'role:penjual'])->group(function () {
        Route::get('/profile', [SellerProfilController::class, 'profile'])->name('profile');
        Route::put('/profile', [SellerProfilController::class, 'updateProfile'])->name('profile.update');
        // Route::get('/products', [SellerProductController::class, 'detail'])->name('products.detail');
        Route::prefix('dashboard')->name('dashboard.')->group(function () {
            // Route::get('/', [SellerProfilController::class, 'dashboard'])->name('index');

            // tambah kurang hapus edit produk
            Route::get('/products', [SellerProductController::class, 'show'])->name('products.list');
            Route::post('/products/add', [SellerProductController::class, 'add'])->name('products.add');
            // Route::post('/products', [SellerProductController::class, 'edit'])->name('products.list');
            // Route::post('/products', [SellerProductController::class, 'sum'])->name('products.list');
            // Route::post('/products', [SellerProductController::class, 'sub'])->name('products.list');
            // Route::post('/products', [SellerProductController::class, 'delete'])->name('products.list');

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
            Route::delete('/delete', 'destroy')->name('destroy');
        });
    });
    Route::prefix('sellers')->name('sellers.')->controller(SellerVerificationController::class)->group(function () {

        // Single Actions
        Route::post('/approve', 'approve')->name('approve');
        Route::post('/reject', 'reject')->name('reject');
        Route::post('/reset-status', 'resetStatus')->name('reset-status');
    });
});
