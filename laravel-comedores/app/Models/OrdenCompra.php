<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCompra extends Model
{
    use HasFactory;

    protected $fillable = ['empresa_id', 'departamento_id'];

    protected $table = 'orden_compras';
    public function productos()
    {
        return $this->hasMany(OrdenProducto::class, 'orden_id');
    }
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }

}


