<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SwnomperController;
use App\Http\Controllers\Api\PersonalController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\EmpresaController;
use App\Http\Controllers\Api\OrdenCompraController;
use App\Http\Controllers\Api\ResumenController;

Route::apiResource('empresas', EmpresaController::class);
Route::apiResource('personal', PersonalController::class);
Route::apiResource('departamentos', DepartamentoController::class);
Route::apiResource('ordenes', OrdenCompraController::class);
Route::get('/resumen', [ResumenController::class, 'getResumen']);
Route::get('ordenes', [OrdenCompraController::class, 'index']);
Route::get('personal/{cedula_rif}', [PersonalController::class, 'buscarPorCedula']);
Route::apiResource('productos', ProductoController::class);
Route::get('productos/tipo/{id}', [ProductoController::class, 'obtenerPorTipo']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/swnomper', [SwnomperController::class, 'index']);
Route::post('/guardar-resumen', [ResumenController::class, 'guardarResumen']);
//mostrar todas las ordenes registradas
