<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('permis_travail_chauds', function (Blueprint $table) {
            $table->dropForeign(['contractant_id']); // if there's a foreign key
            $table->dropColumn('contractant_id');
        });
    }

    public function down()
    {
        Schema::table('permis_travail_chauds', function (Blueprint $table) {
            $table->foreignId('contractant_id')->constrained()->onDelete('cascade');
        });
    }
};