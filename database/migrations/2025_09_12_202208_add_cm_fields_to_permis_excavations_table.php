<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permis_excavations', function (Blueprint $table) {
            $table->string('cm_parkx_nom')->nullable()->after('sig_resp_hse_file');
            $table->date('cm_parkx_date')->nullable()->after('cm_parkx_nom');
            $table->string('cm_parkx_file')->nullable()->after('cm_parkx_date');
        });
    }

    public function down(): void
    {
        Schema::table('permis_excavations', function (Blueprint $table) {
            $table->dropColumn(['cm_parkx_nom', 'cm_parkx_date', 'cm_parkx_file']);
        });
    }
};
