<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personal extends Model
{
    use HasFactory;

    protected $table = 'personal';
    public $timestamps = false;
    protected $fillable = [
        'nombre',
        'apellido',
        'telefono',
        'direccion',
        'sexo',
        'cedula_rif',
        'departamento_id',
        'empresa_id',
    ];

    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
}
