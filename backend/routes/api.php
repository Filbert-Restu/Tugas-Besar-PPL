<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/halo', function () {
    // 2. Logika Anda: Siapkan data (pesan)
    $data = [
        'pesan' => 'Halo! Ini adalah respons dari backend Laravel Anda.',
        'status' => 'sukses'
    ];

    return response()->json($data);
});
