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
        Schema::table('material_requests', function (Blueprint $table) {
            $table->string('qrcode_path')->nullable()->after('rapports_conformite_path');
            $table->text('qrcode_text')->nullable()->after('qrcode_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('material_requests', function (Blueprint $table) {
            $table->dropColumn(['qrcode_path', 'qrcode_text']);
        });
    }
};
