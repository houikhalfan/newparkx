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
        Schema::create('hse_stats', function (Blueprint $table) {
            $table->id();
            
            // Basic Information
            $table->unsignedBigInteger('user_id');
            $table->enum('user_type', ['user', 'contractor'])->default('user');
            $table->unsignedBigInteger('site_id')->nullable();
            $table->string('site');
            $table->date('date');
            
            // Personnel & Hours
            $table->integer('effectif_personnel')->default(0);
            $table->decimal('heures_normales', 10, 2)->default(0);
            $table->decimal('heures_supplementaires', 10, 2)->default(0);
            $table->integer('effectif_passant_horaire_normal')->default(0);
            $table->decimal('total_heures', 10, 2)->default(0);
            
            // Accident Statistics
            $table->integer('acc_mortel')->default(0);
            $table->integer('acc_arret')->default(0);
            $table->integer('acc_soins_medicaux')->default(0);
            $table->integer('acc_restriction_temporaire')->default(0);
            $table->integer('premier_soin')->default(0);
            $table->integer('presque_accident')->default(0);
            $table->integer('dommage_materiel')->default(0);
            $table->integer('incident_environnemental')->default(0);
            
            // Calculated Safety Indicators
            $table->decimal('trir', 8, 4)->default(0);  // Total Recordable Incident Rate
            $table->decimal('ltir', 8, 4)->default(0);  // Lost Time Incident Rate
            $table->decimal('dart', 8, 4)->default(0);  // Days Away, Restricted, or Transferred
            
            // Awareness & Training
            $table->integer('nb_sensibilisations')->default(0);
            $table->integer('personnes_sensibilisees')->default(0);
            $table->decimal('moyenne_sensibilisation_pourcent', 5, 2)->default(0);
            
            // General Training
            $table->integer('inductions_total_personnes')->default(0);
            $table->integer('formes_total_personnes')->default(0);
            $table->decimal('inductions_volume_heures', 10, 2)->default(0);
            
            // Specific Training Sessions (each with sessions, participants, duration)
            $table->integer('excavation_sessions')->default(0);
            $table->integer('excavation_participants')->default(0);
            $table->decimal('excavation_duree_h', 8, 2)->default(0);
            
            $table->integer('points_chauds_sessions')->default(0);
            $table->integer('points_chauds_participants')->default(0);
            $table->decimal('points_chauds_duree_h', 8, 2)->default(0);
            
            $table->integer('espace_confine_sessions')->default(0);
            $table->integer('espace_confine_participants')->default(0);
            $table->decimal('espace_confine_duree_h', 8, 2)->default(0);
            
            $table->integer('levage_sessions')->default(0);
            $table->integer('levage_participants')->default(0);
            $table->decimal('levage_duree_h', 8, 2)->default(0);
            
            $table->integer('travail_hauteur_sessions')->default(0);
            $table->integer('travail_hauteur_participants')->default(0);
            $table->decimal('travail_hauteur_duree_h', 8, 2)->default(0);
            
            $table->integer('sst_sessions')->default(0);
            $table->integer('sst_participants')->default(0);
            $table->decimal('sst_duree_h', 8, 2)->default(0);
            
            $table->integer('epi_sessions')->default(0);
            $table->integer('epi_participants')->default(0);
            $table->decimal('epi_duree_h', 8, 2)->default(0);
            
            $table->integer('modes_operatoires_sessions')->default(0);
            $table->integer('modes_operatoires_participants')->default(0);
            $table->decimal('modes_operatoires_duree_h', 8, 2)->default(0);
            
            $table->integer('permis_spa_sessions')->default(0);
            $table->integer('permis_spa_participants')->default(0);
            $table->decimal('permis_spa_duree_h', 8, 2)->default(0);
            
            $table->integer('outils_electroportatifs_sessions')->default(0);
            $table->integer('outils_electroportatifs_participants')->default(0);
            $table->decimal('outils_electroportatifs_duree_h', 8, 2)->default(0);
            
            // Training Totals
            $table->integer('formations_total_seances')->default(0);
            $table->integer('formations_total_participants')->default(0);
            $table->decimal('formations_total_heures', 10, 2)->default(0);
            
            // Permits (Individual counts)
            $table->integer('permis_general')->default(0);
            $table->integer('permis_excavation')->default(0);
            $table->integer('permis_point_chaud')->default(0);
            $table->integer('permis_espace_confine')->default(0);
            $table->integer('permis_travail_hauteur')->default(0);
            $table->integer('permis_levage')->default(0);
            $table->integer('permis_consignation_loto')->default(0);
            $table->integer('permis_electrique_sous_tension')->default(0);
            $table->integer('permis_specifiques_total')->default(0);
            $table->integer('permis_total')->default(0);
            
            // PTSR (Pre-Task Safety Review)
            $table->integer('ptsr_total')->default(0);
            $table->integer('ptsr_controles')->default(0);
            $table->decimal('ptsr_controles_pourcent', 5, 2)->default(0);
            
            // Equipment Inventory
            $table->integer('grue')->default(0);
            $table->integer('niveleuse')->default(0);
            $table->integer('pelle_hydraulique')->default(0);
            $table->integer('tractopelle')->default(0);
            $table->integer('chargeuse')->default(0);
            $table->integer('camion_citerne')->default(0);
            $table->integer('camion_8x4')->default(0);
            $table->integer('camion_remorque')->default(0);
            $table->integer('grue_mobile')->default(0);
            $table->integer('grue_tour')->default(0);
            $table->integer('compacteur')->default(0);
            $table->integer('finisseur_enrobes')->default(0);
            $table->integer('chariot_elevateur')->default(0);
            $table->integer('foreuse_sondeuse')->default(0);
            $table->integer('brise_roche_hydraulique')->default(0);
            $table->integer('pompe_a_beton')->default(0);
            $table->integer('nacelle_ciseaux')->default(0);
            $table->integer('compresseur_air')->default(0);
            $table->integer('groupe_electrogene_mobile')->default(0);
            
            // Inspections
            $table->integer('inspections_generales')->default(0);
            $table->integer('inspections_engins')->default(0);
            $table->integer('hygiene_base_vie')->default(0);
            $table->integer('outils_electroportatifs')->default(0);
            $table->integer('inspections_electriques')->default(0);
            $table->integer('extincteurs')->default(0);
            $table->integer('protections_collectives')->default(0);
            $table->integer('epi_inspections')->default(0);
            $table->integer('observations_hse')->default(0);
            $table->integer('actions_correctives_cloturees')->default(0);
            $table->integer('inspections_total_hse')->default(0);
            $table->decimal('taux_fermeture_actions_pourcent', 5, 2)->default(0);
            
            // File Uploads (PDF reports)
            $table->string('accident_report')->nullable();
            $table->string('inspection_report')->nullable();
            $table->string('inspection_generales_report')->nullable();
            $table->string('inspection_engins_report')->nullable();
            $table->string('hygiene_base_vie_report')->nullable();
            $table->string('outils_electroportatifs_report')->nullable();
            $table->string('inspection_electriques_report')->nullable();
            $table->string('extincteurs_report')->nullable();
            $table->string('protections_collectives_report')->nullable();
            $table->string('epi_inspections_report')->nullable();
            $table->string('observations_hse_report')->nullable();
            $table->string('actions_correctives_cloturees_report')->nullable();
            
            // Date Analysis Fields
            $table->integer('due_year')->nullable();
            $table->integer('due_month')->nullable();
            $table->integer('week_of_year')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('user_type');
            $table->index('site_id');
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hse_stats');
    }
};
