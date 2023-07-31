<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [Controller::class, 'home'])->name('home');
Route::inertia('ingredients', 'Ingredients')->name('ingredients');
Route::inertia('donuts', 'Donuts')->name('donuts');
Route::inertia('companies', 'Companies')->name('companies');
Route::inertia('accounts', 'Accounts')->name('accounts');
Route::inertia('customers', 'Customers')->name('customers');
Route::inertia('employees', 'Employees')->name('employees');
Route::inertia('contracts', 'Contracts')->name('contracts');
Route::inertia('shifts', 'Shifts')->name('shifts');
Route::inertia('supplies', 'Supplies')->name('supplies');
Route::inertia('sales', 'Sales')->name('sales');
Route::inertia('shops', 'Shops')->name('shops');
Route::inertia('warehouses', 'Warehouses')->name('warehouses');
Route::inertia('supplies', 'Supplies')->name('supplies');
Route::inertia('tariffs', 'Tariffs')->name('tariffs');
Route::inertia('discounts', 'Discounts')->name('discounts');
