<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add missing Youssoufia site
        DB::table('sites')->insertOrIgnore([
            'name' => 'Youssoufia',
            'responsible_user_id' => null,
            'responsible_hse_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Add site_id column to hse_stats if it doesn't exist
        if (!Schema::hasColumn('hse_stats', 'site_id')) {
            Schema::table('hse_stats', function (Blueprint $table) {
                $table->unsignedBigInteger('site_id')->nullable()->after('user_id');
                $table->foreign('site_id')->references('id')->on('sites')->onDelete('set null');
            });
        }

        // Update existing hse_stats to link with sites
        $siteMapping = [
            'Ben Geurir' => 'Ben Geurir',
            'Jorf Lasfar' => 'Jorf Lasfar', 
            'Khouribgua' => 'Khouribgua',
            'Youssoufia' => 'Youssoufia',
            'Mzinda' => 'Mzinda',
        ];

        foreach ($siteMapping as $hseSiteName => $dbSiteName) {
            $site = DB::table('sites')->where('name', $dbSiteName)->first();
            if ($site) {
                DB::table('hse_stats')
                    ->where('site', $hseSiteName)
                    ->update(['site_id' => $site->id]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove site_id column
        Schema::table('hse_stats', function (Blueprint $table) {
            $table->dropForeign(['site_id']);
            $table->dropColumn('site_id');
        });

        // Remove Youssoufia site
        DB::table('sites')->where('name', 'Youssoufia')->delete();
    }
};
