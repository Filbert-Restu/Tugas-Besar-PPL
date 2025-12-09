<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Seller\SellerProfilController;
use App\Http\Controllers\Seller\SellerProductController;
use App\Http\Controllers\Auth\Seller\RegisteredSellerController;
use App\Http\Controllers\Admin\SellerVerificationController;
use App\Http\Controllers\Admin\SellerManagementController;

// Admin Controllers
use App\Http\Controllers\Admin\AdminCategoryProductController;
use App\Http\Controllers\Seller\SellerDashboardController;

// Main Controller
use App\Http\Controllers\MainController;

// Review Controller
use App\Http\Controllers\ReviewController;

// Public Routes - Product Listing
// IMPORTANT: Specific routes MUST come before /{nama_toko}/{id} catch-all route

// Categories List (Public) - Must be before /{nama_toko}/{id}
Route::get('/categories', [MainController::class, 'categories'])->name('categories.public');

Route::get('/', [MainController::class, 'index'])->name('index');
// Route::get('/statistics', [MainController::class, 'statistics'])->name('statistics');

Route::prefix('reviews')->name('reviews.')->group(function () {
    Route::get('/product/{productId}', [ReviewController::class, 'getProductReviews'])->name('product');
    Route::post('/', [ReviewController::class, 'store'])->name('store');
    Route::delete('/{reviewId}', [ReviewController::class, 'destroy'])->name('destroy');
});

// Authentication Routes
Route::controller(AuthenticatedSessionController::class)->group(function () {
    Route::post('/login', 'store')->name('login');
    Route::post('/logout', 'destroy')->name('logout');
});

// Email Verification Routes (for all users)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/email/verify/{id}/{hash}', function (\Illuminate\Foundation\Auth\EmailVerificationRequest $request) {
        $request->fulfill();
        return response()->json(['message' => 'Email berhasil diverifikasi!']);
    })->middleware(['signed'])->name('verification.verify');

    Route::post('/email/verification-notification', function (\Illuminate\Http\Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Link verifikasi telah dikirim ulang ke email Anda!']);
    })->middleware(['throttle:6,1'])->name('verification.send');
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
            Route::get('/', [SellerDashboardController::class, 'show'])->name('index');
            // Route::get('/', [SellerProfilController::class, 'dashboard'])->name('index');

            // tambah kurang hapus edit produk
            Route::prefix('products')->name('products.')->group(function () {
                Route::get('/', [SellerProductController::class, 'show'])->name('.list');
                Route::post('/add', [SellerProductController::class, 'add'])->name('.add');
                Route::put('/edit', [SellerProductController::class, 'edit'])->name('.edit');
                Route::post('/sum', [SellerProductController::class, 'sum'])->name('.sum');
                Route::post('/sub', [SellerProductController::class, 'sub'])->name('.sub');
                Route::post('/delete', [SellerProductController::class, 'delete'])->name('.delete');

            });

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
    Route::prefix('sellers')->name('sellers.')->group(function () {
        // Seller Verification Routes
        Route::controller(SellerVerificationController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/{userId}', 'show')->name('show');
            Route::post('/approve', 'approve')->name('approve');
            Route::post('/reject', 'reject')->name('reject');
            Route::post('/reset-status', 'resetStatus')->name('reset-status');
        });
        
        // Seller Management Routes (Suspend/Activate)
        Route::controller(SellerManagementController::class)->group(function () {
            Route::post('/suspend', 'suspend')->name('suspend');
            Route::post('/activate', 'activate')->name('activate');
            Route::get('/export-pdf', 'exportPDF')->name('export-pdf');
        });
    });
});

Route::get('/{nama_toko}/{id}', [MainController::class, 'show'])->name('show');
