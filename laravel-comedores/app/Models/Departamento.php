<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Departamento extends Model
{
    use HasFactory;

    protected $fillable = ['descripcion'];

    public function resumen()
    {
        return $this->hasMany(Resumen::class, 'referencia_id');
    }


}
