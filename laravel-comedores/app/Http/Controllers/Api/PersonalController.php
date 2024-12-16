<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Personal;
use App\Models\Departamento;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;  // Asegúrate de importar Log
class PersonalController extends Controller
{
    public function index()
    {
        // Listar personal con sus relaciones
        return response()->json(
            Personal::with(['departamento', 'empresa'])->get(),
            200
        );
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nombre' => 'required|string|max:255',
                'apellido' => 'required|string|max:255',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string',
                'sexo' => 'required|in:M,F',
                'cedula_rif' => 'required|string|unique:personal,cedula_rif|max:20',
                'departamento_id' => 'required|exists:departamentos,id',
                'empresa_id' => 'required|exists:empresas,id',
            ]);

            $personal = Personal::create($validatedData);

          //  return response()->json($personal, 201);

            return response()->json([
                'message' => 'Producto creado exitosamente',
                'personal' => $personal
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear el personal', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Personal $personal)
    {
        return response()->json($personal->load(['departamento', 'empresa']), 200);
    }

    public function update(Request $request, Personal $personal)
    {
        try {
            $validatedData = $request->validate([
                'nombre' => 'string|max:255',
                'apellido' => 'string|max:255',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string',
                'sexo' => 'in:M,F',
                'cedula_rif' => 'string|max:20|unique:personal,cedula_rif,' . $personal->id,
                'departamento_id' => 'exists:departamentos,id',
                'empresa_id' => 'exists:empresas,id',
            ]);

            $personal->update($validatedData);

            return response()->json($personal, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar el personal', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Personal $personal)
    {
        try {
            $personal->delete();
            return response()->json(['message' => 'Personal eliminado correctamente'], 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el personal', 'error' => $e->getMessage()], 500);
        }
    }

    public function buscarPorCedula(Request $request)
    {
        $cedulaRif = $request->input('cedula_rif');
        $query = Personal::query();
    
        if ($cedulaRif) {
            // Filtrar por coincidencia exacta
            $query->where('cedula_rif', $cedulaRif);
        }
    
        return response()->json($query->with(['departamento', 'empresa'])->get());
    }
    
    
    
    
    
    
}
