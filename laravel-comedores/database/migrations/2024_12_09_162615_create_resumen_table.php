<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResumenTable extends Migration
{
    public function up()
    {
        Schema::create('resumen', function (Blueprint $table) {
            $table->id(); // ID principal
            $table->string('tipo'); // 'persona' o 'departamento'
            $table->unsignedBigInteger('referencia_id'); // ID de persona o departamento
            $table->unsignedBigInteger('producto_id'); // ID del producto
            $table->integer('cantidad'); // Cantidad del producto
            $table->timestamps(); // created_at y updated_at

            // Llaves foráneas
            $table->foreign('producto_id')->references('id')->on('productos')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('resumen');
    }
}
