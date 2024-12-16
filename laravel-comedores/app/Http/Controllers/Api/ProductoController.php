<?php

namespace App\Http\Controllers\Api;



use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // Asegúrate de importar esta clase
class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $productos = Producto::all();
        return response()->json($productos);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric',
            'stock' => 'required|integer',
        ]);
    
        $producto = Producto::create($validatedData);
    
        return response()->json([
            'message' => 'Producto creado exitosamente',
            'producto' => $producto
        ], 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        return $producto;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'precio' => 'numeric',
            'stock' => 'integer',
        ]);

        $producto->update($validated);
        return $producto;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        $producto->delete();
        return response(null, 204);
    }
    public function obtenerPorTipo($id)
    {
        // Filtrar los productos según el tipo de comida (por ejemplo, desayuno, almuerzo, cena)
        // Suponiendo que el campo en la base de datos que relaciona el tipo de comida sea 'tipo_comida_id'
        $productos = Producto::where('id', $id)->get();

        // Retornar los productos en formato JSON
        return response()->json($productos);
    }
}
