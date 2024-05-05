<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::post('register', [UserController::class, 'userRegister']);
Route::post('login', [UserController::class, 'login']);
Route::get('/all', [TransactionController::class, 'getTransactionsAndBalance'])->name('transactions.show');
Route::post('/deposit', [TransactionController::class, 'deposit']);
Route::get('/deposit', [TransactionController::class, 'alldeposit']);
Route::get('/users', [UserController::class, 'users']);
Route::get('/transactions', [TransactionController::class, 'transactions']);
Route::get('/withdrawal', [TransactionController::class, 'getwithdrawal']);
Route::post('/withdrawal', [TransactionController::class, 'withdrawal']);





Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
