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
        Schema::table('projects', function (Blueprint $table) {
            // Drop the existing status column and recreate it with proper enum values
            $table->dropColumn('status');
        });
        
        Schema::table('projects', function (Blueprint $table) {
            // Add the status column with proper enum values
            $table->enum('status', ['actif', 'en_cours', 'termine', 'suspendu'])->default('actif');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        
        Schema::table('projects', function (Blueprint $table) {
            $table->string('status', 50)->default('actif');
        });
    }
};
