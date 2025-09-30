<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('permis_travail_chauds', function (Blueprint $table) {
            // Ajouter les champs manquants
            $table->date('date_debut')->after('site_id');
            $table->date('date_fin')->after('date_debut');
            $table->date('date_plan_securitaire')->after('plan_securitaire_par');
            
            // Corriger le nom du champ activities (optionnel)
            // $table->renameColumn('activities', 'activites');
        });
    }

    public function down()
    {
        Schema::table('permis_travail_chauds', function (Blueprint $table) {
            $table->dropColumn(['date_debut', 'date_fin', 'date_plan_securitaire']);
            // $table->renameColumn('activites', 'activities');
        });
    }
};