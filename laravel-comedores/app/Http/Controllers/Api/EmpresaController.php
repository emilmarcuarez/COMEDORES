<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // Asegúrate de importar esta clase

class EmpresaController extends Controller
{
    // Obtener todas las empresas
    public function index(): JsonResponse
    {
        $empresas = Empresa::all();
        return response()->json($empresas);
    }

    // Crear una nueva empresa
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'descripcion' => 'required|string|max:255',
            'ubicacion' => 'required|string|max:255',
            'rif' => 'required|string|max:20|unique:empresas',
        ]);

        $empresa = Empresa::create($validatedData);

        return response()->json([
            'message' => 'Empresa creada exitosamente',
            'empresa' => $empresa,
        ], 201);
    }

    // Mostrar una empresa específica
    public function show(Empresa $empresa)
    {
        return $empresa;
    }

    // Actualizar una empresa
    public function update(Request $request, Empresa $empresa)
    {
        $validatedData = $request->validate([
            'descripcion' => 'string|max:255',
            'ubicacion' => 'string|max:255',
            'rif' => 'string|max:20|unique:empresas,rif,' . $empresa->id,
        ]);

        $empresa->update($validatedData);

        return response()->json([
            'message' => 'Empresa actualizada',
            'empresa' => $empresa,
        ]);
    }

    // Eliminar una empresa
    public function destroy(Empresa $empresa)
    {
        $empresa->delete();
        return response()->json(['message' => 'Empresa eliminada'], 204);
    }
}

