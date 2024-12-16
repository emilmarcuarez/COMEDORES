<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resumen extends Model
{
    use HasFactory;

    protected $table = 'resumen';

    protected $fillable = [
        'tipo',
        'referencia_id',
        'producto_id',
        'cantidad',
    ];

    // Relación con el modelo Producto
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    // Relación directa con Personal (si aplica)
    public function persona()
    {
        return $this->belongsTo(Personal::class, 'referencia_id');
    }

    // Relación directa con Departamento (si aplica)
    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'referencia_id');
    }
}
