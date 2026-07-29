<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

use App\Http\Controllers\VerifyEmailController;

Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Rutas de Verificación de Correo
Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, 'verify'])->name('verification.verify');
Route::post('/email/verification-notification', [VerifyEmailController::class, 'resend'])->middleware(['throttle:6,1'])->name('verification.send');

use App\Http\Controllers\ItemController;
use App\Http\Controllers\UserController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('items', ItemController::class);
    Route::apiResource('users', UserController::class)->except(['store']);
});
