<?php
namespace App\Http\Controllers\Api;


use Illuminate\Http\Request;
use App\Models\Departamento;
use App\Models\Producto;
use App\Models\Resumen;
use App\Models\Personal;
use App\Http\Controllers\Controller;
USE App\Models\OrdenCompra;
use Carbon\Carbon;
//use App\Http\Controllers\Api\log;
class ResumenController extends Controller
{
   
    public function guardarResumen(Request $request)
    {
        $validated = $request->validate([
            'personaSeleccionada' => 'required|array',
            'personaSeleccionada.tipo' => 'required|in:persona,departamento',
            'personaSeleccionada.id' => 'required|integer',
            'productosSeleccionados' => 'required|array',
            'productosSeleccionados.*.id' => 'required|integer|exists:productos,id',
            'productosSeleccionados.*.cantidad' => 'required|integer|min:1',
        ]);
    
        try {
            $tipo = $validated['personaSeleccionada']['tipo'];
            $referenciaId = $validated['personaSeleccionada']['id'];
    
            if ($tipo === 'persona') {
                $persona = Personal::findOrFail($referenciaId);
            } elseif ($tipo === 'departamento') {
                $departamento = Departamento::findOrFail($referenciaId);
            }
    
            // Obtener las órdenes de compra del día
            $ordenesCompra = OrdenCompra::whereDate('created_at', today())
                ->where('empresa_id', $persona->empresa_id) // Suponiendo que se toma de la empresa de la persona
                ->get();
    
            // Restar las cantidades de productos en las órdenes de compra
            foreach ($validated['productosSeleccionados'] as $productoSeleccionado) {
                $producto = Producto::findOrFail($productoSeleccionado['id']);
    
                // Verificar si hay suficiente cantidad en las órdenes de compra
                $cantidadDisponible = $ordenesCompra->sum(function ($orden) use ($producto) {
                    return $orden->productos()->where('producto_id', $producto->id)->sum('cantidad');
                });
    
                if ($cantidadDisponible < $productoSeleccionado['cantidad']) {
                    return response()->json(['error' => 'No hay suficiente cantidad disponible para el producto: ' . $producto->nombre], 400);
                }
    
                // Descontar la cantidad utilizada del total disponible en las órdenes de compra
                // Aquí asumimos que tienes una relación entre 'orden_compras' y 'productos'
                foreach ($ordenesCompra as $orden) {
                    $ordenProducto = $orden->productos()->where('producto_id', $producto->id)->first();
    
                    if ($ordenProducto) {
                        $restarCantidad = min($productoSeleccionado['cantidad'], $ordenProducto->cantidad);
                        $ordenProducto->cantidad -= $restarCantidad;
                        $ordenProducto->save();
                        $productoSeleccionado['cantidad'] -= $restarCantidad;
    
                        if ($productoSeleccionado['cantidad'] <= 0) break;
                    }
                }
            }
    
            // Guardar el resumen con los productos seleccionados
            foreach ($validated['productosSeleccionados'] as $productoSeleccionado) {
                $producto = Producto::findOrFail($productoSeleccionado['id']);
    
                $resumen = new Resumen();
                $resumen->tipo = $tipo;
                $resumen->referencia_id = $referenciaId;
                $resumen->producto_id = $producto->id;
                $resumen->cantidad = $productoSeleccionado['cantidad'];
                $resumen->save();
            }
    
            return response()->json(['message' => 'Resumen guardado correctamente'], 201);
    
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }
    

    public function getResumen(Request $request)
    {
        $query = Resumen::query();
    
        // Filtrar por rango de fechas
        if ($request->filled('start_date') && $request->filled('end_date')) {
            // Asegurar que start_date sea el inicio del día y end_date sea el final del día
            $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->input('end_date'))->endOfDay();
    
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }
    
        // Cargar relación de productos
        $resumenes = $query->with(['producto', 'persona', 'departamento'])->get();
    
        // Transformar datos y seleccionar la referencia correcta
        $resumenes = $resumenes->map(function ($resumen) {
            $referenciaNombre = null;
    
            // Determinar si la referencia es una persona o un departamento
            if ($resumen->tipo === 'persona') {
                $referenciaNombre = $resumen->persona->nombre ?? 'No especificado';
            } elseif ($resumen->tipo === 'departamento') {
                $referenciaNombre = $resumen->departamento->nombre ?? 'No especificado';
            }
    
            return [
                'tipo' => $resumen->tipo,
                'producto_nombre' => $resumen->producto->nombre ?? 'Producto no encontrado',
                'cantidad' => $resumen->cantidad,
                'referencia' => $referenciaNombre,
                'created_at' => $resumen->created_at->format('Y-m-d H:i:s'),
            ];
        });
    
        return response()->json($resumenes);
    }
    
    
    
    
}
