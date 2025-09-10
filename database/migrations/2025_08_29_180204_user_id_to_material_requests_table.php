<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('material_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('material_requests', 'assigned_user_id')) {
                $table->unsignedBigInteger('assigned_user_id')->nullable()->after('site_id');
                $table->foreign('assigned_user_id')->references('id')->on('users')->nullOnDelete();
            }
        });

        // Optional but handy: backfill for existing rows based on the site's responsible
        // SQLite-compatible version
        $materialRequests = DB::table('material_requests')
            ->whereNull('assigned_user_id')
            ->get();
            
        foreach ($materialRequests as $mr) {
            $site = DB::table('sites')->where('id', $mr->site_id)->first();
            if ($site && $site->responsible_user_id) {
                DB::table('material_requests')
                    ->where('id', $mr->id)
                    ->update(['assigned_user_id' => $site->responsible_user_id]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('material_requests', function (Blueprint $table) {
            if (Schema::hasColumn('material_requests', 'assigned_user_id')) {
                $table->dropForeign(['assigned_user_id']);
                $table->dropColumn('assigned_user_id');
            }
        });
    }
};

