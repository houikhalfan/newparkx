<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permis_travail_securitaire', function (Blueprint $table) {
            // Drop the old column
            $table->dropColumn('statut');
        });

        Schema::table('permis_travail_securitaire', function (Blueprint $table) {
            // Add the new one
            $table->enum('status', ['en_attente', 'en_cours', 'rejete', 'signe'])
                  ->default('en_attente');
        });
    }

    public function down(): void
    {
        Schema::table('permis_travail_securitaire', function (Blueprint $table) {
            // Drop the new column
            $table->dropColumn('status');
        });

        Schema::table('permis_travail_securitaire', function (Blueprint $table) {
            // Restore the old one
            $table->enum('statut', ['brouillon', 'soumis', 'approuve', 'rejete', 'ferme'])
                  ->default('brouillon');
        });
    }
};
