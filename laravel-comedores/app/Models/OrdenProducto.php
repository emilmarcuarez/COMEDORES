<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenProducto extends Model
{
    use HasFactory;

    protected $fillable = ['orden_id', 'producto_id', 'cantidad'];

    protected $table = 'orden_productos';
    public $timestamps = false;
    public function orden()
    {
        return $this->belongsTo(OrdenCompra::class, 'orden_id');
    }
    public function producto()
{
    return $this->belongsTo(Producto::class, 'producto_id');
}

}
