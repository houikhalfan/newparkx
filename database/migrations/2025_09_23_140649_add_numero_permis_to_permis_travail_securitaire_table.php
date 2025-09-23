<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('permis_travail_securitaire', function (Blueprint $table) {
            $table->string('numero_permis')->unique()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('permis_travail_securitaire', function (Blueprint $table) {
            $table->dropColumn('numero_permis');
        });
    }
};
