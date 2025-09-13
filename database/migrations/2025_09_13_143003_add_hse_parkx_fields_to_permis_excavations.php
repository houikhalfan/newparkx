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
        $table->string('hse_parkx_nom')->nullable();
        $table->date('hse_parkx_date')->nullable();
        $table->string('hse_parkx_file')->nullable(); // store signature file path
    });
}

public function down()
{
    Schema::table('permis_excavations', function (Blueprint $table) {
        $table->dropColumn(['hse_parkx_nom', 'hse_parkx_date', 'hse_parkx_file']);
    });
}

};
