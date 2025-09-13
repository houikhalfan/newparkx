<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Make sure defaults are set at schema level
        Schema::table('permis_excavations', function (Blueprint $table) {
            $table->boolean('autor_q1')->default(false)->change();
            $table->boolean('autor_q2')->default(false)->change();
            $table->boolean('autor_q3')->default(false)->change();
        });

        // Backfill old NULL values
        DB::table('permis_excavations')
            ->whereNull('autor_q1')
            ->update(['autor_q1' => false]);

        DB::table('permis_excavations')
            ->whereNull('autor_q2')
            ->update(['autor_q2' => false]);

        DB::table('permis_excavations')
            ->whereNull('autor_q3')
            ->update(['autor_q3' => false]);
    }

    public function down(): void
    {
        Schema::table('permis_excavations', function (Blueprint $table) {
            // If you rollback, they become nullable again
            $table->boolean('autor_q1')->nullable()->change();
            $table->boolean('autor_q2')->nullable()->change();
            $table->boolean('autor_q3')->nullable()->change();
        });
    }
};
