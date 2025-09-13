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
    Schema::table('permis_excavations', function (Blueprint $table) {
        $table->boolean('autor_q1')->default(false);
        $table->boolean('autor_q2')->default(false);
        $table->boolean('autor_q3')->default(false);
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permis_excavations', function (Blueprint $table) {
            //
        });
    }
};
