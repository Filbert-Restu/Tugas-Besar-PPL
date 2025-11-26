<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\Seller\RegisteredSellerController;
use App\Http\Controllers\Admin\SellerVerificationController;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::controller(AuthenticatedSessionController::class)->group(function () {
    Route::post('/login', 'store')->name('login');
    Route::post('/logout', 'destroy')->name('logout');
});

// Seller Auth Routes
Route::prefix('seller')->name('seller.')->group(function () {
    // Public routes - Registrasi & Login
    Route::post('/register', [RegisteredSellerController::class, 'store'])->name('seller-register');

});

// Admin Routes - Seller Verification
Route::prefix('admin')->name('admin.')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::prefix('sellers')->name('sellers.')->controller(SellerVerificationController::class)->group(function () {

        // Single Actions
        Route::post('/approve', 'approve')->name('approve');
    });
});
