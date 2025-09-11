<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('material_requests', function (Blueprint $table) {
        $table->string('matricule')->nullable()->after('site_id');
    });
}

public function down()
{
    Schema::table('material_requests', function (Blueprint $table) {
        $table->dropColumn('matricule');
    });
}

};
