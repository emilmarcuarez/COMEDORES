<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;
    protected $fillable = ['nombre', 'precio', 'stock'];
    // Relación con Resumen
    public function resumen()
    {
        return $this->hasMany(Resumen::class, 'producto_id');
    }
}

