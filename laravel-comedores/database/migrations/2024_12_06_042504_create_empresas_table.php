<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('empresas', function (Blueprint $table) {
            $table->id(); // Clave primaria autoincremental
            $table->string('descripcion', 255); // Nombre o descripción de la empresa
            $table->string('ubicacion', 255); // Ubicación física
            $table->string('rif', 20)->unique(); // Registro de Información Fiscal
            $table->timestamps(); // Campos created_at y updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
