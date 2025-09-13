<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::table('permis_excavations', function (Blueprint $table) {
        $table->enum('status', ['en_attente', 'en_cours', 'rejete', 'signe'])
              ->default('en_attente')
              ->change();
    });
}

public function down(): void
{
    Schema::table('permis_excavations', function (Blueprint $table) {
        $table->enum('status', ['en_attente', 'rejete', 'signe'])
              ->default('en_attente')
              ->change();
    });
}

};
