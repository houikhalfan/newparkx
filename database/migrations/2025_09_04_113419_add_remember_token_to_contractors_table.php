<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contractors', function (Blueprint $table) {
            // add after password for clarity; nullable is fine
            if (!Schema::hasColumn('contractors', 'remember_token')) {
                $table->rememberToken()->nullable()->after('password');
            }
        });
    }

    public function down(): void
    {
        Schema::table('contractors', function (Blueprint $table) {
            if (Schema::hasColumn('contractors', 'remember_token')) {
                $table->dropColumn('remember_token');
            }
        });
    }
};
