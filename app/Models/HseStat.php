<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HseStat extends Model
{
    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contractor()
    {
        return $this->belongsTo(Contractor::class, 'user_id');
    }

    public function siteRelation()
    {
        return $this->belongsTo(Site::class, 'site_id');
    }

    public function creator()
    {
        if ($this->user_type === 'contractor') {
            return $this->belongsTo(Contractor::class, 'user_id');
        }
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getCreatorNameAttribute()
    {
        if ($this->user_type === 'contractor') {
            return $this->contractor->company_name ?? $this->contractor->name ?? 'Contractor';
        }
        return $this->user->name ?? 'User';
    }

    // Fillable fields (all database columns)
    protected $fillable = [
        'user_id', 'user_type', 'site_id', 'site', 'date',
        'effectif_personnel', 'heures_normales', 'heures_supplementaires', 
        'effectif_passant_horaire_normal', 'total_heures',
        'acc_mortel', 'acc_arret', 'acc_soins_medicaux', 'acc_restriction_temporaire',
        'premier_soin', 'presque_accident', 'dommage_materiel', 'incident_environnemental',
        'trir', 'ltir', 'dart',
        'nb_sensibilisations', 'personnes_sensibilisees', 'moyenne_sensibilisation_pourcent',
        'inductions_total_personnes', 'formes_total_personnes', 'inductions_volume_heures',
        'excavation_sessions', 'excavation_participants', 'excavation_duree_h',
        'points_chauds_sessions', 'points_chauds_participants', 'points_chauds_duree_h',
        'espace_confine_sessions', 'espace_confine_participants', 'espace_confine_duree_h',
        'levage_sessions', 'levage_participants', 'levage_duree_h',
        'travail_hauteur_sessions', 'travail_hauteur_participants', 'travail_hauteur_duree_h',
        'sst_sessions', 'sst_participants', 'sst_duree_h',
        'epi_sessions', 'epi_participants', 'epi_duree_h',
        'modes_operatoires_sessions', 'modes_operatoires_participants', 'modes_operatoires_duree_h',
        'permis_spa_sessions', 'permis_spa_participants', 'permis_spa_duree_h',
        'outils_electroportatifs_sessions', 'outils_electroportatifs_participants', 'outils_electroportatifs_duree_h',
        'formations_total_seances', 'formations_total_participants', 'formations_total_heures',
        'permis_general', 'permis_excavation', 'permis_point_chaud', 'permis_espace_confine',
        'permis_travail_hauteur', 'permis_levage', 'permis_consignation_loto', 'permis_electrique_sous_tension',
        'permis_specifiques_total', 'permis_total',
        'ptsr_total', 'ptsr_controles', 'ptsr_controles_pourcent',
        'grue', 'niveleuse', 'pelle_hydraulique', 'tractopelle', 'chargeuse', 'camion_citerne',
        'camion_8x4', 'camion_remorque', 'grue_mobile', 'grue_tour', 'compacteur', 'finisseur_enrobes',
        'chariot_elevateur', 'foreuse_sondeuse', 'brise_roche_hydraulique', 'pompe_a_beton',
        'nacelle_ciseaux', 'compresseur_air', 'groupe_electrogene_mobile',
        'inspections_generales', 'inspections_engins', 'hygiene_base_vie', 'outils_electroportatifs',
        'inspections_electriques', 'extincteurs', 'protections_collectives', 'epi_inspections',
        'observations_hse', 'actions_correctives_cloturees', 'inspections_total_hse', 'taux_fermeture_actions_pourcent',
        'accident_report', 'inspection_generales_report', 'inspection_engins_report',
        'hygiene_base_vie_report', 'outils_electroportatifs_report', 'inspection_electriques_report',
        'extincteurs_report', 'protections_collectives_report', 'epi_inspections_report',
        'observations_hse_report', 'actions_correctives_cloturees_report',
        'due_year', 'due_month', 'week_of_year'
    ];

    // Data type casting
    protected $casts = [
        'date' => 'datetime',
        'effectif_personnel' => 'integer',
        'heures_normales' => 'decimal:2',
        'heures_supplementaires' => 'decimal:2',
        'effectif_passant_horaire_normal' => 'integer',
        'total_heures' => 'decimal:2',
        'acc_mortel' => 'integer',
        'acc_arret' => 'integer',
        'acc_soins_medicaux' => 'integer',
        'acc_restriction_temporaire' => 'integer',
        'premier_soin' => 'integer',
        'presque_accident' => 'integer',
        'dommage_materiel' => 'integer',
        'incident_environnemental' => 'integer',
        'trir' => 'decimal:4',
        'ltir' => 'decimal:4',
        'dart' => 'decimal:4',
        'nb_sensibilisations' => 'integer',
        'personnes_sensibilisees' => 'integer',
        'moyenne_sensibilisation_pourcent' => 'decimal:2',
        'inductions_total_personnes' => 'integer',
        'formes_total_personnes' => 'integer',
        'inductions_volume_heures' => 'decimal:2',
        'excavation_sessions' => 'integer',
        'excavation_participants' => 'integer',
        'excavation_duree_h' => 'decimal:2',
        'points_chauds_sessions' => 'integer',
        'points_chauds_participants' => 'integer',
        'points_chauds_duree_h' => 'decimal:2',
        'espace_confine_sessions' => 'integer',
        'espace_confine_participants' => 'integer',
        'espace_confine_duree_h' => 'decimal:2',
        'levage_sessions' => 'integer',
        'levage_participants' => 'integer',
        'levage_duree_h' => 'decimal:2',
        'travail_hauteur_sessions' => 'integer',
        'travail_hauteur_participants' => 'integer',
        'travail_hauteur_duree_h' => 'decimal:2',
        'sst_sessions' => 'integer',
        'sst_participants' => 'integer',
        'sst_duree_h' => 'decimal:2',
        'epi_sessions' => 'integer',
        'epi_participants' => 'integer',
        'epi_duree_h' => 'decimal:2',
        'modes_operatoires_sessions' => 'integer',
        'modes_operatoires_participants' => 'integer',
        'modes_operatoires_duree_h' => 'decimal:2',
        'permis_spa_sessions' => 'integer',
        'permis_spa_participants' => 'integer',
        'permis_spa_duree_h' => 'decimal:2',
        'outils_electroportatifs_sessions' => 'integer',
        'outils_electroportatifs_participants' => 'integer',
        'outils_electroportatifs_duree_h' => 'decimal:2',
        'formations_total_seances' => 'integer',
        'formations_total_participants' => 'integer',
        'formations_total_heures' => 'decimal:2',
        'permis_general' => 'integer',
        'permis_excavation' => 'integer',
        'permis_point_chaud' => 'integer',
        'permis_espace_confine' => 'integer',
        'permis_travail_hauteur' => 'integer',
        'permis_levage' => 'integer',
        'permis_consignation_loto' => 'integer',
        'permis_electrique_sous_tension' => 'integer',
        'permis_specifiques_total' => 'integer',
        'permis_total' => 'integer',
        'ptsr_total' => 'integer',
        'ptsr_controles' => 'integer',
        'ptsr_controles_pourcent' => 'decimal:2',
        'grue' => 'integer',
        'niveleuse' => 'integer',
        'pelle_hydraulique' => 'integer',
        'tractopelle' => 'integer',
        'chargeuse' => 'integer',
        'camion_citerne' => 'integer',
        'camion_8x4' => 'integer',
        'camion_remorque' => 'integer',
        'grue_mobile' => 'integer',
        'grue_tour' => 'integer',
        'compacteur' => 'integer',
        'finisseur_enrobes' => 'integer',
        'chariot_elevateur' => 'integer',
        'foreuse_sondeuse' => 'integer',
        'brise_roche_hydraulique' => 'integer',
        'pompe_a_beton' => 'integer',
        'nacelle_ciseaux' => 'integer',
        'compresseur_air' => 'integer',
        'groupe_electrogene_mobile' => 'integer',
        'inspections_generales' => 'integer',
        'inspections_engins' => 'integer',
        'hygiene_base_vie' => 'integer',
        'outils_electroportatifs' => 'integer',
        'inspections_electriques' => 'integer',
        'extincteurs' => 'integer',
        'protections_collectives' => 'integer',
        'epi_inspections' => 'integer',
        'observations_hse' => 'integer',
        'actions_correctives_cloturees' => 'integer',
        'inspections_total_hse' => 'integer',
        'taux_fermeture_actions_pourcent' => 'decimal:2',
        'due_year' => 'integer',
        'due_month' => 'integer',
        'week_of_year' => 'integer'
    ];

    // Boot method to automatically calculate derived fields
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            // Calculate total hours
            $model->total_heures = $model->heures_normales + $model->heures_supplementaires;
            $model->effectif_passant_horaire_normal = $model->effectif_personnel;
            
            // Calculate safety indicators
            $totalHours = $model->total_heures;
            if ($totalHours > 0) {
                // TRIR = (Total Recordable Injuries / Total Hours Worked) * 200,000
                $totalRecordableInjuries = $model->acc_mortel + $model->acc_arret + $model->acc_soins_medicaux + $model->acc_restriction_temporaire;
                $model->trir = ($totalRecordableInjuries / $totalHours) * 200000;
                
                // LTIR = (Lost Time Injuries / Total Hours Worked) * 200,000
                $lostTimeInjuries = $model->acc_mortel + $model->acc_arret;
                $model->ltir = ($lostTimeInjuries / $totalHours) * 200000;
                
                // DART = (Days Away, Restricted, or Transferred / Total Hours Worked) * 200,000
                $dartInjuries = $model->acc_mortel + $model->acc_restriction_temporaire;
                $model->dart = ($dartInjuries / $totalHours) * 200000;
            } else {
                $model->trir = 0;
                $model->ltir = 0;
                $model->dart = 0;
            }

            // Calculate training totals
            $model->formations_total_seances = 
                $model->excavation_sessions + $model->points_chauds_sessions + 
                $model->espace_confine_sessions + $model->levage_sessions + 
                $model->travail_hauteur_sessions + $model->sst_sessions + 
                $model->epi_sessions + $model->modes_operatoires_sessions + 
                $model->permis_spa_sessions + $model->outils_electroportatifs_sessions;

            $model->formations_total_participants = 
                $model->excavation_participants + $model->points_chauds_participants + 
                $model->espace_confine_participants + $model->levage_participants + 
                $model->travail_hauteur_participants + $model->sst_participants + 
                $model->epi_participants + $model->modes_operatoires_participants + 
                $model->permis_spa_participants + $model->outils_electroportatifs_participants;

            $model->formations_total_heures = 
                $model->excavation_duree_h + $model->points_chauds_duree_h + 
                $model->espace_confine_duree_h + $model->levage_duree_h + 
                $model->travail_hauteur_duree_h + $model->sst_duree_h + 
                $model->epi_duree_h + $model->modes_operatoires_duree_h + 
                $model->permis_spa_duree_h + $model->outils_electroportatifs_duree_h;

            // Calculate permit totals
            $model->permis_specifiques_total = 
                $model->permis_excavation + $model->permis_point_chaud + 
                $model->permis_espace_confine + $model->permis_travail_hauteur + 
                $model->permis_levage + $model->permis_consignation_loto + 
                $model->permis_electrique_sous_tension;

            $model->permis_total = $model->permis_general + $model->permis_specifiques_total;

            // Calculate inspection totals
            $model->inspections_total_hse = 
                $model->inspections_generales + $model->inspections_engins + 
                $model->hygiene_base_vie + $model->outils_electroportatifs + 
                $model->inspections_electriques + $model->extincteurs + 
                $model->protections_collectives + $model->epi_inspections + 
                $model->observations_hse;

            // Calculate PTSR percentage
            if ($model->ptsr_total > 0) {
                $model->ptsr_controles_pourcent = ($model->ptsr_controles / $model->ptsr_total) * 100;
            }

            // Calculate action closure rate
            if ($model->observations_hse > 0) {
                $model->taux_fermeture_actions_pourcent = ($model->actions_correctives_cloturees / $model->observations_hse) * 100;
            }

            // Calculate awareness percentage
            if ($model->personnes_sensibilisees > 0 && $model->nb_sensibilisations > 0) {
                $model->moyenne_sensibilisation_pourcent = ($model->personnes_sensibilisees / $model->nb_sensibilisations);
            }

            // Set date analysis fields
            if ($model->date) {
                $date = \Carbon\Carbon::parse($model->date);
                $model->due_year = $date->year;
                $model->due_month = $date->month;
                $model->week_of_year = $date->weekOfYear;
            }
        });
    }
}
