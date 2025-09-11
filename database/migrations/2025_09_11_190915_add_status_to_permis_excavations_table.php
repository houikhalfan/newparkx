<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::table('permis_excavations', function (Blueprint $table) {
        $table->enum('status', ['en_attente', 'rejete', 'signe'])->default('en_attente')->after('sig_resp_hse_file');
    });
}

public function down(): void
{
    Schema::table('permis_excavations', function (Blueprint $table) {
        $table->dropColumn('status');
    });
}

};
