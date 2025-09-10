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
        Schema::table('hse_stats', function (Blueprint $table) {
            // Update TRIR, LTIR, DART to handle larger values
            $table->decimal('trir', 12, 4)->change();  // Increased from 8,4 to 12,4
            $table->decimal('ltir', 12, 4)->change();  // Increased from 8,4 to 12,4
            $table->decimal('dart', 12, 4)->change();  // Increased from 8,4 to 12,4
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hse_stats', function (Blueprint $table) {
            // Revert back to original precision
            $table->decimal('trir', 8, 4)->change();
            $table->decimal('ltir', 8, 4)->change();
            $table->decimal('dart', 8, 4)->change();
        });
    }
};