<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/about', function () {
    return "about";
});

// Protected route using auth middleware
Route::get('/protected', function () {
    return response()->json([
        'message' => 'This is a protected route!',
        'data' => 'You have successfully accessed protected content.',
        'timestamp' => now()->toDateTimeString(),
    ]);
})->middleware('auth.custom');

// Route group with multiple middleware
Route::middleware(['auth.custom'])->group(function () {
    Route::get('/admin', function () {
        return response()->json([
            'message' => 'Admin Dashboard',
            'user' => 'admin',
            'access_level' => 'full',
        ]);
    });
    
    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'User Dashboard',
            'status' => 'authenticated',
            'features' => ['profile', 'settings', 'data'],
        ]);
    });
});

// Public API route (only logging middleware will apply)
Route::get('/api/public', function () {
    return response()->json([
        'message' => 'Public API endpoint',
        'version' => '1.0',
        'status' => 'active',
    ]);
});
