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
            'site' => ['required', 'string', 'max:255'],
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
            'accident_report', 'inspection_report', 'inspection_generales_report',
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

        // Create the record (calculations will be done automatically in the model)
        $hseStat = HseStat::create($data);

        // Send notification to all admins
        $admins = Admin::all();
        \Log::info('Sending notifications to ' . $admins->count() . ' admins');
        foreach ($admins as $admin) {
            \Log::info('Sending notification to admin: ' . $admin->email);
            $admin->notify(new HseStatisticsSubmitted($hseStat));
        }

        return redirect()->route('contractant.hse-statistics.history')->with('success', 'Statistiques HSE soumises avec succès!');
    }

    public function update(Request $request, $id)
    {
        
        $request->validate([
            'site' => ['required', 'string', 'max:255'],
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
        
        // Handle file uploads
        $fileFields = [
            'accident_report', 'inspection_report', 'inspection_generales_report',
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

        // Update the record (calculations will be done automatically in the model)
        $hseStat->update($data);

        // Send notification to all admins about the modification
        $admins = Admin::all();
        \Log::info('Sending modification notifications to ' . $admins->count() . ' admins');
        foreach ($admins as $admin) {
            \Log::info('Sending modification notification to admin: ' . $admin->email);
            $admin->notify(new HseStatisticsSubmitted($hseStat, 'modified'));
        }

        return redirect()->route('contractant.hse-statistics.history')->with('success', 'Statistiques HSE modifiées avec succès!');
    }

    public function show($id)
    {
        $statistic = HseStat::where('user_id', Auth::guard('contractor')->id())
            ->where('id', $id)
            ->firstOrFail();

        return Inertia::render('Contractant/HseStatistics/Show', [
            'statistic' => $statistic
        ]);
    }

    public function edit($id)
    {
        $sites = Site::all();
        $hseStat = HseStat::where('user_id', Auth::guard('contractor')->id())
            ->where('id', $id)
            ->firstOrFail();
            
        // Ensure date is properly formatted for the frontend
        $hseStat->date = $hseStat->date->format('Y-m-d');
            
        return Inertia::render('Contractant/HseStatistics/Edit', [
            'sites' => $sites,
            'hseStat' => $hseStat
        ]);
    }

    public function history()
    {
        $uid = Auth::guard('contractor')->id();
        $contractor = Auth::guard('contractor')->user();

        return Inertia::render('Contractant/HseStatistics/History', [
            'records' => HseStat::query()
                ->where('user_id', $uid) // Show only own statistics
                ->latest('date')->latest('id')
                ->select([
                    'id', 'site', 'date', 'created_at', 'effectif_personnel',
                    'total_heures', 'trir', 'ltir', 'dart',
                    'permis_total', 'inspections_total_hse'
                ])
                ->limit(200)
                ->get(),
            'contractor' => $contractor
        ]);
    }
}
