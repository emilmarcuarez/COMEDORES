<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use Illuminate\Http\Request;

class DepartamentoController extends Controller
{
    // Obtener todos los departamentos
    public function index()
    {
        return Departamento::all();
    }

    // Crear un nuevo departamento
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'descripcion' => 'required|string|max:255',
        ]);

        $departamento = Departamento::create($validatedData);

        return response()->json([
            'message' => 'Departamento creado exitosamente',
            'departamento' => $departamento,
        ], 201);
    }

    // Mostrar un departamento específico
    public function show(Departamento $departamento)
    {
        return $departamento;
    }

    // Actualizar un departamento
    public function update(Request $request, Departamento $departamento)
    {
        $validatedData = $request->validate([
            'descripcion' => 'string|max:255',
        ]);

        $departamento->update($validatedData);

        return response()->json([
            'message' => 'Departamento actualizado',
            'departamento' => $departamento,
        ]);
    }

    // Eliminar un departamento
    public function destroy(Departamento $departamento)
    {
        $departamento->delete();
        return response()->json(['message' => 'Departamento eliminado'], 204);
    }
}
