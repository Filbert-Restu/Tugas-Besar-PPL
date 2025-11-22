<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SellerAuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminVerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 1. Public Routes (Landing Page & Registrasi)
Route::get('/products', [ProductController::class, 'index']);
Route::post('/sellers/register', [SellerAuthController::class, 'register']);
Route::post('/sellers/login', [SellerAuthController::class, 'login']);

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');
Route::post('/email/resend', [AuthController::class, 'resendVerification']);

// Login khusus Seller

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // 2. Admin Routes (Seharusnya pakai Middleware Auth, tapi kita buka dulu untuk dev)
    Route::prefix('admin')->group(function () {
        Route::get('/sellers/pending', [AdminVerificationController::class, 'pendingSellers']);
        Route::post('/sellers/{id}/verify', [AdminVerificationController::class, 'verify']);
    });

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});




