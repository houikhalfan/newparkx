<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\HseStat;
use App\Models\Site;
use App\Models\Admin;
use App\Notifications\HseStatisticsSubmitted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    public function index()
    {
        $sites = Site::all();
        $userId = Auth::guard('contractor')->id();
        $contractor = Auth::guard('contractor')->user();
        $today = now()->format('Y-m-d');
        
        // Check if there's already a submission for today
        $todaySubmission = HseStat::where('user_id', $userId)
            ->where('date', $today)
            ->first();
        
        return Inertia::render('Contractant/HseStatistics/Index', [
            'sites' => $sites,
            'todaySubmission' => $todaySubmission,
            'canSubmit' => !$todaySubmission,
            'contractor' => $contractor
        ]);
    }

    public function store(Request $request)
    {
        $userId = Auth::guard('contractor')->id();
        $submissionDate = $request->input('date');
        
        // Check if there's already a submission for this date
        $existingSubmission = HseStat::where('user_id', $userId)
            ->where('date', $submissionDate)
            ->first();
            
        if ($existingSubmission) {
            return redirect()->back()->withErrors([
                'date' => 'Vous avez déjà soumis des statistiques pour cette date. Vous pouvez les modifier dans l\'historique.'
            ]);
        }

        $request->validate([
            'site_id' => ['required', 'exists:sites,id'],
            'date' => ['required', 'date'],
            'effectif_personnel' => ['required', 'numeric', 'min:0'],
            'heures_normales' => ['required', 'numeric', 'min:0'],
            'heures_supplementaires' => ['required', 'numeric', 'min:0'],
            'effectif_passant_horaire_normal' => ['required', 'numeric', 'min:0'],
            
            // Accidents & Incidents
            'acc_mortel' => ['required', 'numeric', 'min:0'],
            'acc_arret' => ['required', 'numeric', 'min:0'],
            'acc_soins_medicaux' => ['required', 'numeric', 'min:0'],
            'acc_restriction_temporaire' => ['required', 'numeric', 'min:0'],
            'premier_soin' => ['required', 'numeric', 'min:0'],
            'presque_accident' => ['required', 'numeric', 'min:0'],
            'dommage_materiel' => ['required', 'numeric', 'min:0'],
            'incident_environnemental' => ['required', 'numeric', 'min:0'],
            
            // Personnel & Sensibilisation
            'nb_sensibilisations' => ['required', 'numeric', 'min:0'],
            'personnes_sensibilisees' => ['required', 'numeric', 'min:0'],
            
            // Formations & Inductions
            'inductions_total_personnes' => ['required', 'numeric', 'min:0'],
            'formes_total_personnes' => ['required', 'numeric', 'min:0'],
            'inductions_volume_heures' => ['required', 'numeric', 'min:0'],
            
            // Formations par thème
            'excavation_sessions' => ['required', 'numeric', 'min:0'],
            'excavation_participants' => ['required', 'numeric', 'min:0'],
            'excavation_duree_h' => ['required', 'numeric', 'min:0'],
            'points_chauds_sessions' => ['required', 'numeric', 'min:0'],
            'points_chauds_participants' => ['required', 'numeric', 'min:0'],
            'points_chauds_duree_h' => ['required', 'numeric', 'min:0'],
            'espace_confine_sessions' => ['required', 'numeric', 'min:0'],
            'espace_confine_participants' => ['required', 'numeric', 'min:0'],
            'espace_confine_duree_h' => ['required', 'numeric', 'min:0'],
            'levage_sessions' => ['required', 'numeric', 'min:0'],
            'levage_participants' => ['required', 'numeric', 'min:0'],
            'levage_duree_h' => ['required', 'numeric', 'min:0'],
            'travail_hauteur_sessions' => ['required', 'numeric', 'min:0'],
            'travail_hauteur_participants' => ['required', 'numeric', 'min:0'],
            'travail_hauteur_duree_h' => ['required', 'numeric', 'min:0'],
            'sst_sessions' => ['required', 'numeric', 'min:0'],
            'sst_participants' => ['required', 'numeric', 'min:0'],
            'sst_duree_h' => ['required', 'numeric', 'min:0'],
            'epi_sessions' => ['required', 'numeric', 'min:0'],
            'epi_participants' => ['required', 'numeric', 'min:0'],
            'epi_duree_h' => ['required', 'numeric', 'min:0'],
            'modes_operatoires_sessions' => ['required', 'numeric', 'min:0'],
            'modes_operatoires_participants' => ['required', 'numeric', 'min:0'],
            'modes_operatoires_duree_h' => ['required', 'numeric', 'min:0'],
            'permis_spa_sessions' => ['required', 'numeric', 'min:0'],
            'permis_spa_participants' => ['required', 'numeric', 'min:0'],
            'permis_spa_duree_h' => ['required', 'numeric', 'min:0'],
            'outils_electroportatifs_sessions' => ['required', 'numeric', 'min:0'],
            'outils_electroportatifs_participants' => ['required', 'numeric', 'min:0'],
            'outils_electroportatifs_duree_h' => ['required', 'numeric', 'min:0'],
            
            // Permis & PTSR
            'permis_general' => ['required', 'numeric', 'min:0'],
            'permis_excavation' => ['required', 'numeric', 'min:0'],
            'permis_point_chaud' => ['required', 'numeric', 'min:0'],
            'permis_espace_confine' => ['required', 'numeric', 'min:0'],
            'permis_travail_hauteur' => ['required', 'numeric', 'min:0'],
            'permis_levage' => ['required', 'numeric', 'min:0'],
            'permis_consignation' => ['required', 'numeric', 'min:0'],
            'permis_electrique_tension' => ['required', 'numeric', 'min:0'],
            'ptsr_total' => ['required', 'numeric', 'min:0'],
            'ptsr_controles' => ['required', 'numeric', 'min:0'],
            
            // Engins & Matériels
            'grue' => ['required', 'numeric', 'min:0'],
            'niveleuse' => ['required', 'numeric', 'min:0'],
            'pelle_hydraulique' => ['required', 'numeric', 'min:0'],
            'tractopelle' => ['required', 'numeric', 'min:0'],
            'chargeuse' => ['required', 'numeric', 'min:0'],
            'camion_citerne' => ['required', 'numeric', 'min:0'],
            'camion_8x4' => ['required', 'numeric', 'min:0'],
            'camion_remorque' => ['required', 'numeric', 'min:0'],
            'grue_mobile' => ['required', 'numeric', 'min:0'],
            'grue_tour' => ['required', 'numeric', 'min:0'],
            'compacteur' => ['required', 'numeric', 'min:0'],
            'finisseur_enrobes' => ['required', 'numeric', 'min:0'],
            'chariot_elevateur' => ['required', 'numeric', 'min:0'],
            'foreuse_sondeuse' => ['required', 'numeric', 'min:0'],
            'brise_roche_hydraulique' => ['required', 'numeric', 'min:0'],
            'pompe_beton' => ['required', 'numeric', 'min:0'],
            'nacelle_ciseaux' => ['required', 'numeric', 'min:0'],
            'compresseur_air' => ['required', 'numeric', 'min:0'],
            'groupe_electrogene_mobile' => ['required', 'numeric', 'min:0'],
            
            // Inspections & Observations
            'inspections_generales' => ['required', 'numeric', 'min:0'],
            'inspections_engins' => ['required', 'numeric', 'min:0'],
            'hygiene_base_vie' => ['required', 'numeric', 'min:0'],
            'outils_electroportatifs_inspections' => ['required', 'numeric', 'min:0'],
            'inspections_electriques' => ['required', 'numeric', 'min:0'],
            'extincteurs' => ['required', 'numeric', 'min:0'],
            'protections_collectives' => ['required', 'numeric', 'min:0'],
            'epi_inspections' => ['required', 'numeric', 'min:0'],
            'observations_hse' => ['required', 'numeric', 'min:0'],
            'actions_correctives_cloturees' => ['required', 'numeric', 'min:0'],
            
            // File upload validations
            'accident_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'inspection_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'inspection_generales_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'inspection_engins_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'hygiene_base_vie_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'outils_electroportatifs_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'inspection_electriques_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'extincteurs_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'protections_collectives_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'epi_inspections_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'observations_hse_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'actions_correctives_cloturees_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ]);

        $data = $request->all();
        
        // Handle file uploads
        $fileFields = [
            'accident_report', 'inspection_generales_report',
            'inspection_engins_report', 'hygiene_base_vie_report', 'outils_electroportatifs_report',
            'inspection_electriques_report', 'extincteurs_report', 'protections_collectives_report',
            'epi_inspections_report', 'observations_hse_report', 'actions_correctives_cloturees_report'
        ];

        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $filename = time() . '_' . $field . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('reports', $filename, 'public');
                $data[$field] = $path;
            }
        }

        // Set user information
        $data['user_id'] = Auth::guard('contractor')->id();
        $data['user_type'] = 'contractor';

        // Get site name from site_id for backward compatibility
        if (isset($data['site_id'])) {
            $site = Site::find($data['site_id']);
            $data['site'] = $site ? $site->name : '';
        }

        // Create the record (calculations will be done automatically in the model)
        $hseStat = HseStat::create($data);

        // Send notification to all admins
        try {
            $admins = Admin::all();
            \Log::info('Sending notifications to ' . $admins->count() . ' admins');
            
            if ($admins->count() > 0) {
                foreach ($admins as $admin) {
                    \Log::info('Sending notification to admin: ' . $admin->email);
                    try {
                        $admin->notify(new HseStatisticsSubmitted($hseStat));
                        \Log::info('Notification sent successfully to: ' . $admin->email);
                    } catch (\Exception $e) {
                        \Log::error('Failed to send notification to ' . $admin->email . ': ' . $e->getMessage());
                    }
                }
            } else {
                \Log::warning('No admin users found to send notifications to');
            }
        } catch (\Exception $e) {
            \Log::error('Error in notification system: ' . $e->getMessage());
            // Don't fail the submission if notifications fail
        }

        return redirect()->route('contractant.hse-statistics.history')->with('success', 'Statistiques HSE soumises avec succès!');
    }

    public function update(Request $request, $id)
    {
        // Debug: Log what we're receiving
        \Log::info('HSE Statistics Update - Raw Request Data:', [
            'id' => $id,
            'has_files' => $request->hasFile('accident_report'),
            'all_files' => $request->allFiles(),
            'all_data' => $request->all(),
            'method' => $request->method()
        ]);
        
        $request->validate([
            'site_id' => ['required', 'exists:sites,id'],
            'date' => ['required', 'date'],
            'effectif_personnel' => ['required', 'numeric', 'min:0'],
            'heures_normales' => ['required', 'numeric', 'min:0'],
            'heures_supplementaires' => ['required', 'numeric', 'min:0'],
            'effectif_passant_horaire_normal' => ['required', 'numeric', 'min:0'],
            
            // Accidents & Incidents
            'acc_mortel' => ['required', 'numeric', 'min:0'],
            'acc_arret' => ['required', 'numeric', 'min:0'],
            'acc_soins_medicaux' => ['required', 'numeric', 'min:0'],
            'acc_restriction_temporaire' => ['required', 'numeric', 'min:0'],
            'premier_soin' => ['required', 'numeric', 'min:0'],
            'presque_accident' => ['required', 'numeric', 'min:0'],
            'dommage_materiel' => ['required', 'numeric', 'min:0'],
            'incident_environnemental' => ['required', 'numeric', 'min:0'],
            
            // Personnel & Sensibilisation
            'nb_sensibilisations' => ['required', 'numeric', 'min:0'],
            'personnes_sensibilisees' => ['required', 'numeric', 'min:0'],
            
            // Formations & Inductions
            'inductions_total_personnes' => ['required', 'numeric', 'min:0'],
            'formes_total_personnes' => ['required', 'numeric', 'min:0'],
            'inductions_volume_heures' => ['required', 'numeric', 'min:0'],
            
            // Formations par thème
            'excavation_sessions' => ['required', 'numeric', 'min:0'],
            'excavation_participants' => ['required', 'numeric', 'min:0'],
            'excavation_duree_h' => ['required', 'numeric', 'min:0'],
            'points_chauds_sessions' => ['required', 'numeric', 'min:0'],
            'points_chauds_participants' => ['required', 'numeric', 'min:0'],
            'points_chauds_duree_h' => ['required', 'numeric', 'min:0'],
            'espace_confine_sessions' => ['required', 'numeric', 'min:0'],
            'espace_confine_participants' => ['required', 'numeric', 'min:0'],
            'espace_confine_duree_h' => ['required', 'numeric', 'min:0'],
            'levage_sessions' => ['required', 'numeric', 'min:0'],
            'levage_participants' => ['required', 'numeric', 'min:0'],
            'levage_duree_h' => ['required', 'numeric', 'min:0'],
            'travail_hauteur_sessions' => ['required', 'numeric', 'min:0'],
            'travail_hauteur_participants' => ['required', 'numeric', 'min:0'],
            'travail_hauteur_duree_h' => ['required', 'numeric', 'min:0'],
            'sst_sessions' => ['required', 'numeric', 'min:0'],
            'sst_participants' => ['required', 'numeric', 'min:0'],
            'sst_duree_h' => ['required', 'numeric', 'min:0'],
            'epi_sessions' => ['required', 'numeric', 'min:0'],
            'epi_participants' => ['required', 'numeric', 'min:0'],
            'epi_duree_h' => ['required', 'numeric', 'min:0'],
            'modes_operatoires_sessions' => ['required', 'numeric', 'min:0'],
            'modes_operatoires_participants' => ['required', 'numeric', 'min:0'],
            'modes_operatoires_duree_h' => ['required', 'numeric', 'min:0'],
            'permis_spa_sessions' => ['required', 'numeric', 'min:0'],
            'permis_spa_participants' => ['required', 'numeric', 'min:0'],
            'permis_spa_duree_h' => ['required', 'numeric', 'min:0'],
            'outils_electroportatifs_sessions' => ['required', 'numeric', 'min:0'],
            'outils_electroportatifs_participants' => ['required', 'numeric', 'min:0'],
            'outils_electroportatifs_duree_h' => ['required', 'numeric', 'min:0'],
            
            // Permis & PTSR
            'permis_general' => ['required', 'numeric', 'min:0'],
            'permis_excavation' => ['required', 'numeric', 'min:0'],
            'permis_point_chaud' => ['required', 'numeric', 'min:0'],
            'permis_espace_confine' => ['required', 'numeric', 'min:0'],
            'permis_travail_hauteur' => ['required', 'numeric', 'min:0'],
            'permis_levage' => ['required', 'numeric', 'min:0'],
            'permis_consignation' => ['required', 'numeric', 'min:0'],
            'permis_electrique_tension' => ['required', 'numeric', 'min:0'],
            'ptsr_total' => ['required', 'numeric', 'min:0'],
            'ptsr_controles' => ['required', 'numeric', 'min:0'],
            
            // Engins & Matériels
            'grue' => ['required', 'numeric', 'min:0'],
            'niveleuse' => ['required', 'numeric', 'min:0'],
            'pelle_hydraulique' => ['required', 'numeric', 'min:0'],
            'tractopelle' => ['required', 'numeric', 'min:0'],
            'chargeuse' => ['required', 'numeric', 'min:0'],
            'camion_citerne' => ['required', 'numeric', 'min:0'],
            'camion_8x4' => ['required', 'numeric', 'min:0'],
            'camion_remorque' => ['required', 'numeric', 'min:0'],
            'grue_mobile' => ['required', 'numeric', 'min:0'],
            'grue_tour' => ['required', 'numeric', 'min:0'],
            'compacteur' => ['required', 'numeric', 'min:0'],
            'finisseur_enrobes' => ['required', 'numeric', 'min:0'],
            'chariot_elevateur' => ['required', 'numeric', 'min:0'],
            'foreuse_sondeuse' => ['required', 'numeric', 'min:0'],
            'brise_roche_hydraulique' => ['required', 'numeric', 'min:0'],
            'pompe_beton' => ['required', 'numeric', 'min:0'],
            'nacelle_ciseaux' => ['required', 'numeric', 'min:0'],
            'compresseur_air' => ['required', 'numeric', 'min:0'],
            'groupe_electrogene_mobile' => ['required', 'numeric', 'min:0'],
            
            // Inspections & Observations
            'inspections_generales' => ['required', 'numeric', 'min:0'],
            'inspections_engins' => ['required', 'numeric', 'min:0'],
            'hygiene_base_vie' => ['required', 'numeric', 'min:0'],
            'outils_electroportatifs_inspections' => ['required', 'numeric', 'min:0'],
            'inspections_electriques' => ['required', 'numeric', 'min:0'],
            'extincteurs' => ['required', 'numeric', 'min:0'],
            'protections_collectives' => ['required', 'numeric', 'min:0'],
            'epi_inspections' => ['required', 'numeric', 'min:0'],
            'observations_hse' => ['required', 'numeric', 'min:0'],
            'actions_correctives_cloturees' => ['required', 'numeric', 'min:0'],
            
            // File upload validations
            'accident_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'inspection_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'inspection_generales_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'inspection_engins_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'hygiene_base_vie_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'outils_electroportatifs_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'inspection_electriques_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'extincteurs_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'protections_collectives_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'epi_inspections_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'observations_hse_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'actions_correctives_cloturees_report' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ]);

        $hseStat = HseStat::where('user_id', Auth::guard('contractor')->id())
            ->where('id', $id)
            ->firstOrFail();

        $data = $request->all();
        
        // Handle file uploads - only update file fields when new files are uploaded
        $fileFields = [
            'accident_report', 'inspection_generales_report',
            'inspection_engins_report', 'hygiene_base_vie_report', 'outils_electroportatifs_report',
            'inspection_electriques_report', 'extincteurs_report', 'protections_collectives_report',
            'epi_inspections_report', 'observations_hse_report', 'actions_correctives_cloturees_report'
        ];

        // Debug: Log all request data
        \Log::info('Update request data:', $request->all());

        // Handle file deletions first - check for _delete_ prefix
        $deletedFiles = [];
        foreach ($fileFields as $field) {
            if ($request->has("_delete_{$field}") && $request->input("_delete_{$field}") === true) {
                $deletedFiles[] = $field;
            }
        }
        
        \Log::info('Files to be deleted:', $deletedFiles);
        
        foreach ($deletedFiles as $field) {
            \Log::info("Processing deletion for field: {$field}");
            if ($hseStat->$field) {
                // Delete the physical file
                $filePath = storage_path('app/public/' . $hseStat->$field);
                \Log::info("Attempting to delete file: {$filePath}");
                
                if (file_exists($filePath)) {
                    unlink($filePath);
                    \Log::info("File deleted successfully for {$field}: {$filePath}");
                } else {
                    \Log::warning("File does not exist for deletion: {$filePath}");
                }
                // Set field to null in database
                $data[$field] = null;
                \Log::info("Set {$field} to null in database");
            } else {
                \Log::warning("No existing file to delete for field: {$field}");
            }
        }

        // Handle file uploads
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // New file uploaded
                $file = $request->file($field);
                $filename = time() . '_' . $field . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('reports', $filename, 'public');
                $data[$field] = $path;
                \Log::info("New file uploaded for {$field}: {$path}");
            } else {
                // No change to this field, remove from data to preserve existing value
                unset($data[$field]);
            }
        }

        // Get site name from site_id for backward compatibility
        if (isset($data['site_id'])) {
            $site = Site::find($data['site_id']);
            $data['site'] = $site ? $site->name : '';
        }

        // Update the record (calculations will be done automatically in the model)
        $hseStat->update($data);

        // Send notification to all admins about the modification
        try {
            $admins = Admin::all();
            \Log::info('Sending modification notifications to ' . $admins->count() . ' admins');
            
            if ($admins->count() > 0) {
                foreach ($admins as $admin) {
                    \Log::info('Sending modification notification to admin: ' . $admin->email);
                    try {
                        $admin->notify(new HseStatisticsSubmitted($hseStat, 'modified'));
                        \Log::info('Modification notification sent successfully to: ' . $admin->email);
                    } catch (\Exception $e) {
                        \Log::error('Failed to send modification notification to ' . $admin->email . ': ' . $e->getMessage());
                    }
                }
            } else {
                \Log::warning('No admin users found to send modification notifications to');
            }
        } catch (\Exception $e) {
            \Log::error('Error in modification notification system: ' . $e->getMessage());
            // Don't fail the update if notifications fail
        }

        return redirect()->route('contractant.hse-statistics.history')->with('success', 'Statistiques HSE modifiées avec succès!');
    }

    public function show($id)
    {
        $contractor = Auth::guard('contractor')->user();
        $statistic = HseStat::with('siteRelation')->where('user_id', $contractor->id)
            ->where('id', $id)
            ->firstOrFail();

        // Debug: Log the site information
        \Log::info('HSE Stat Show - Site Debug:', [
            'id' => $statistic->id,
            'site_id' => $statistic->site_id,
            'site_field' => $statistic->site,
            'site_relationship' => $statistic->siteRelation ? get_class($statistic->siteRelation) : 'null',
            'site_name' => $statistic->siteRelation ? $statistic->siteRelation->name : 'null'
        ]);

        return Inertia::render('Contractant/HseStatistics/Show', [
            'statistic' => $statistic,
            'contractor' => $contractor
        ]);
    }

    public function edit($id)
    {
        $contractor = Auth::guard('contractor')->user();
        $sites = Site::all();
        $hseStat = HseStat::with('siteRelation')->where('user_id', $contractor->id)
            ->where('id', $id)
            ->firstOrFail();
            
        // Ensure date is properly formatted for the frontend
        $hseStat->date = $hseStat->date->format('Y-m-d');
        
        // Debug: Log sites being passed
        \Log::info('Sites being passed to edit form:', [
            'count' => $sites->count(),
            'sites' => $sites->pluck('name')->toArray(),
            'hseStat_site_id' => $hseStat->site_id,
            'hseStat_site_name' => $hseStat->siteRelation?->name
        ]);
            
        return Inertia::render('Contractant/HseStatistics/Edit', [
            'sites' => $sites,
            'hseStat' => $hseStat,
            'contractor' => $contractor
        ]);
    }

    public function history()
    {
        $uid = Auth::guard('contractor')->id();
        $contractor = Auth::guard('contractor')->user();

        return Inertia::render('Contractant/HseStatistics/History', [
            'records' => HseStat::query()
                ->with('siteRelation')
                ->where('user_id', $uid) // Show only own statistics
                ->latest('date')->latest('id')
                ->select([
                    'id', 'site_id', 'site', 'date', 'created_at', 'effectif_personnel',
                    'heures_normales', 'heures_supplementaires', 'total_heures', 
                    'trir', 'ltir', 'dart', 'permis_total', 
                    'inspections_generales', 'inspections_engins', 'inspections_total_hse'
                ])
                ->limit(200)
                ->get(),
            'contractor' => $contractor
        ]);
    }

    public function download(Request $request, $id, $field)
    {
        $contractor = Auth::guard('contractor')->user();
        
        // Debug: Log download request
        \Log::info('Download request:', [
            'id' => $id,
            'field' => $field,
            'contractor_id' => $contractor->id
        ]);
        
        // Security check: ensure contractor can only download their own files
        $statistics = HseStat::where('user_id', $contractor->id)->where('id', $id)->firstOrFail();
        
        // Define the allowed file fields
        $allowedFields = [
            'accident_report', 'inspection_report', 'inspection_generales_report',
            'inspection_engins_report', 'hygiene_base_vie_report', 'outils_electroportatifs_report',
            'inspection_electriques_report', 'extincteurs_report', 'protections_collectives_report',
            'epi_inspections_report', 'observations_hse_report', 'actions_correctives_cloturees_report'
        ];

        // Check if the field is allowed
        if (!in_array($field, $allowedFields)) {
            abort(404, 'Fichier non trouvé');
        }

        // Get the file path from the statistics record
        $filePath = $statistics->$field;
        
        \Log::info('File path info:', [
            'field' => $field,
            'filePath' => $filePath,
            'statistics_id' => $statistics->id
        ]);
        
        if (!$filePath) {
            \Log::warning('File path is empty for field: ' . $field);
            abort(404, 'Fichier non trouvé');
        }

        // Build the full file path
        $fullPath = storage_path('app/public/' . $filePath);
        
        \Log::info('Full file path: ' . $fullPath);
        \Log::info('File exists: ' . (file_exists($fullPath) ? 'yes' : 'no'));
        
        if (!file_exists($fullPath)) {
            \Log::warning('File does not exist: ' . $fullPath);
            abort(404, 'Fichier non trouvé');
        }

        // Get file info
        $fileInfo = pathinfo($fullPath);
        $mimeType = mime_content_type($fullPath);
        
        // Generate a user-friendly filename
        $originalFilename = $fileInfo['basename'];
        $downloadFilename = $statistics->site . '_' . $field . '_' . $originalFilename;

        return response()->download($fullPath, $downloadFilename, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . $downloadFilename . '"'
        ]);
    }
}
