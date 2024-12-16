<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Swnomper extends Model
{
    protected $table = 'swnomper'; // Nombre de la tabla
    protected $primaryKey = 'CEDULA'; // Ajusta esto si la clave primaria tiene otro nombre
    public $timestamps = false;   // Si no usas campos `created_at` o `updated_at`

    protected $fillable = ['CEDULA', 'APENOM', 'DIRECCION', 'SEXO'];
}
