<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permis_excavations', function (Blueprint $table) {
            // store the path to the generated original PDF
            $table->string('pdf_original')->nullable()->after('status');
            // later you might also want to add pdf_signe if needed
            // $table->string('pdf_signe')->nullable()->after('pdf_original');
        });
    }

    public function down(): void
    {
        Schema::table('permis_excavations', function (Blueprint $table) {
            $table->dropColumn('pdf_original');
            // $table->dropColumn('pdf_signe'); // if you add it later
        });
    }
};
