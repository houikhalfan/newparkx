// database/migrations/2025_09_03_000001_add_remember_token_to_admins.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('admins', 'remember_token')) {
            Schema::table('admins', function (Blueprint $table) {
                $table->rememberToken()->after('password');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('admins', 'remember_token')) {
            Schema::table('admins', function (Blueprint $table) {
                $table->dropColumn('remember_token');
            });
        }
    }
};
