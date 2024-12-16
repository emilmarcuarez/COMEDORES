<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('orden_compras', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('empresa_id');
        $table->unsignedBigInteger('departamento_id')->nullable(); // Nullable si es general
        $table->timestamps();
        
        $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
        $table->foreign('departamento_id')->references('id')->on('departamentos')->onDelete('set null');
    });

    Schema::create('orden_productos', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('orden_id');
        $table->unsignedBigInteger('producto_id');
        $table->integer('cantidad');
        
        $table->foreign('orden_id')->references('id')->on('orden_compras')->onDelete('cascade');
        $table->foreign('producto_id')->references('id')->on('productos')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_compras');
        Schema::dropIfExists('orden_producto');
    }
};
