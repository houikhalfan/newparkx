<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HseStat;
use App\Models\Contractor;
use Carbon\Carbon;

class HseStatSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing contractors
        $contractors = Contractor::all();
        
        if ($contractors->isEmpty()) {
            $this->command->info('No contractors found. Please run the InitialDataSeeder first.');
            return;
        }

        // Create sample statistics for each contractor
        foreach ($contractors as $contractor) {
            // Create 3 sample records for each contractor
            for ($i = 0; $i < 3; $i++) {
                $date = Carbon::now()->subDays($i * 7); // One week apart
                
                HseStat::create([
                    'user_id' => $contractor->id,
                    'user_type' => 'contractor',
                    'site' => 'Benguerir',
                    'date' => $date->format('Y-m-d'),
                    'effectif_personnel' => rand(50, 200),
                    'heures_normales' => rand(800, 1600),
                    'heures_supplementaires' => rand(50, 200),
                    'acc_mortel' => 0,
                    'acc_arret' => rand(0, 2),
                    'acc_soins_medicaux' => rand(1, 5),
                    'acc_restriction_temporaire' => rand(0, 1),
                    'premier_soin' => rand(2, 8),
                    'presque_accident' => rand(3, 10),
                    'dommage_materiel' => rand(0, 2),
                    'incident_environnemental' => rand(0, 1),
                    'nb_sensibilisations' => rand(5, 15),
                    'personnes_sensibilisees' => rand(80, 150),
                    'inductions_total_personnes' => rand(20, 40),
                    'formes_total_personnes' => rand(25, 50),
                    'inductions_volume_heures' => rand(40, 80),
                    'excavation_sessions' => rand(1, 3),
                    'excavation_participants' => rand(15, 30),
                    'excavation_duree_h' => rand(6, 12),
                    'points_chauds_sessions' => rand(1, 2),
                    'points_chauds_participants' => rand(10, 20),
                    'points_chauds_duree_h' => rand(4, 8),
                    'espace_confine_sessions' => rand(1, 2),
                    'espace_confine_participants' => rand(8, 15),
                    'espace_confine_duree_h' => rand(4, 8),
                    'levage_sessions' => rand(1, 3),
                    'levage_participants' => rand(12, 25),
                    'levage_duree_h' => rand(6, 12),
                    'travail_hauteur_sessions' => rand(1, 2),
                    'travail_hauteur_participants' => rand(8, 15),
                    'travail_hauteur_duree_h' => rand(4, 8),
                    'sst_sessions' => rand(2, 4),
                    'sst_participants' => rand(30, 60),
                    'sst_duree_h' => rand(8, 16),
                    'epi_sessions' => rand(1, 3),
                    'epi_participants' => rand(20, 40),
                    'epi_duree_h' => rand(4, 8),
                    'modes_operatoires_sessions' => rand(1, 2),
                    'modes_operatoires_participants' => rand(10, 20),
                    'modes_operatoires_duree_h' => rand(3, 6),
                    'permis_spa_sessions' => rand(1, 2),
                    'permis_spa_participants' => rand(5, 12),
                    'permis_spa_duree_h' => rand(2, 4),
                    'outils_electroportatifs_sessions' => rand(1, 3),
                    'outils_electroportatifs_participants' => rand(15, 30),
                    'outils_electroportatifs_duree_h' => rand(4, 8),
                    'permis_general' => rand(30, 60),
                    'permis_excavation' => rand(15, 30),
                    'permis_point_chaud' => rand(10, 20),
                    'permis_espace_confine' => rand(8, 15),
                    'permis_levage' => rand(12, 25),
                    'permis_travail_hauteur' => rand(8, 15),
                    'permis_consignation_loto' => rand(5, 12),
                    'permis_electrique_sous_tension' => rand(3, 8),
                    'ptsr_total' => rand(100, 200),
                    'ptsr_controles' => rand(80, 150),
                    'grue' => rand(2, 5),
                    'niveleuse' => rand(1, 3),
                    'pelle_hydraulique' => rand(3, 8),
                    'tractopelle' => rand(2, 5),
                    'chargeuse' => rand(1, 3),
                    'camion_citerne' => rand(1, 2),
                    'camion_8x4' => rand(2, 4),
                    'camion_remorque' => rand(1, 3),
                    'grue_mobile' => rand(1, 2),
                    'grue_tour' => rand(0, 1),
                    'compacteur' => rand(1, 3),
                    'finisseur_enrobes' => rand(0, 1),
                    'chariot_elevateur' => rand(1, 2),
                    'foreuse_sondeuse' => rand(0, 2),
                    'brise_roche_hydraulique' => rand(0, 1),
                    'pompe_a_beton' => rand(0, 1),
                    'nacelle_ciseaux' => rand(1, 2),
                    'compresseur_air' => rand(2, 4),
                    'groupe_electrogene_mobile' => rand(1, 3),
                    'inspections_generales' => rand(5, 15),
                    'inspections_engins' => rand(8, 20),
                    'hygiene_base_vie' => rand(3, 8),
                    'outils_electroportatifs' => rand(5, 12),
                    'inspections_electriques' => rand(3, 8),
                    'extincteurs' => rand(2, 6),
                    'protections_collectives' => rand(4, 10),
                    'epi_inspections' => rand(6, 15),
                    'observations_hse' => rand(10, 25),
                    'actions_correctives_cloturees' => rand(8, 20),
                ]);
            }
        }

        $this->command->info('Sample HSE statistics data created successfully!');
    }
}