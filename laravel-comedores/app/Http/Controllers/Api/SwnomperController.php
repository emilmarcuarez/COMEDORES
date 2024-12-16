<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Swnomper;
class SwnomperController extends Controller
{
    public function index()
    {
        // Obtén todos los registros de la tabla swnomper
        return json_encode(Swnomper::all());
    }

    public function buscarPorCedula($cedula)
    {
        $persona = Swnomper::where('CEDULA', $cedula)->first();

        if ($persona) {
            return response()->json($persona, 200); // Retorna la persona encontrada
        }

        return response()->json(['message' => 'Persona no encontrada'], 404); // Respuesta en caso de no encontrar
    }
}

