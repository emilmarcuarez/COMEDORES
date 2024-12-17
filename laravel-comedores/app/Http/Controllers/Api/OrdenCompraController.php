<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\OrdenCompra;
use Illuminate\Http\Request;
use App\Models\OrdenProducto;
use Illuminate\Support\Facades\DB;

class OrdenCompraController extends Controller
{
    public function index(Request $request)
    {
        // Inicializar la consulta de las órdenes con sus relaciones
        $query = OrdenCompra::with(['empresa', 'departamento', 'productos.producto']);
        
        // Verificar si hay filtros de fecha y que las fechas sean válidas
        if ($request->filled('start_date') && $request->filled('end_date')) {
            // Asegurarse de que las fechas estén formateadas correctamente y extender end_date hasta el final del día
            $startDate = $request->start_date;
            $endDate = $request->end_date . ' 23:59:59';
            
            // Filtrar por rango de fechas incluyendo el final del día para end_date
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }
        
        // Obtener las órdenes filtradas o sin filtro
        $ordenes = $query->get();
        
        // Retornar las órdenes como respuesta JSON
        return response()->json($ordenes);
    }
    
    

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'empresa_id' => 'required|exists:empresas,id',
            'departamento_id' => 'nullable|exists:departamentos,id',
            'productos' => 'required|array',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validatedData) {
            // Crear la orden
            $orden = OrdenCompra::create([
                'empresa_id' => $validatedData['empresa_id'],
                'departamento_id' => $validatedData['departamento_id'] ?? null,
            ]);

            // Crear los productos asociados
            foreach ($validatedData['productos'] as $producto) {
                OrdenProducto::create([
                    'orden_id' => $orden->id,
                    'producto_id' => $producto['producto_id'],
                    'cantidad' => $producto['cantidad'],
                ]);
            }
        });

        return response()->json(['message' => 'Orden creada exitosamente'], 201);
    }
}
