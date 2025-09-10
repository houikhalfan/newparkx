<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\HseStat;
use App\Models\User;
use App\Models\Contractor;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $query = HseStat::with(['user', 'contractor'])
            ->where('user_type', 'contractor');

        // Apply filters
        if ($request->filled('site')) {
            $query->where('site', 'like', '%' . $request->site . '%');
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('entreprise')) {
            $query->whereHas('contractor', function ($q) use ($request) {
                $q->where('company_name', 'like', '%' . $request->entreprise . '%');
            });
        }

        $statistics = $query->latest('created_at')->paginate(20);

        return Inertia::render('Admin/HseStatistics/Index', [
            'statistics' => $statistics,
            'filters' => $request->only(['site', 'date', 'entreprise'])
        ]);
    }

    public function aggregated(Request $request)
    {
        $query = HseStat::with(['user', 'contractor'])
            ->where('user_type', 'contractor');

        // Apply date range filter if provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = $request->start_date;
            $endDate = $request->end_date;
            
            $query->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        }

        // Apply site filter if provided
        if ($request->filled('site')) {
            $query->where('site', 'like', '%' . $request->site . '%');
        }

        // Apply entreprise filter if provided
        if ($request->filled('entreprise')) {
            $query->whereHas('contractor', function ($q) use ($request) {
                $q->where('company_name', 'like', '%' . $request->entreprise . '%');
            });
        }

        $allStats = $query->orderBy('created_at', 'desc')->get();

        // Calculate aggregated statistics
        $aggregatedData = [
            // Basic info
            'total_submissions' => $allStats->count(),
            'period_start' => $request->start_date ?? ($allStats->count() > 0 ? $allStats->min('created_at')->format('Y-m-d') : null),
            'period_end' => $request->end_date ?? ($allStats->count() > 0 ? $allStats->max('created_at')->format('Y-m-d') : null),
            
            // Individual statistics for horizontal table
            'statistics' => $allStats->map(function ($stat) {
                return [
                    'id' => $stat->id,
                    'contractor_name' => $stat->contractor->name ?? 'N/A',
                    'entreprise' => $stat->contractor->company_name ?? 'N/A',
                    'site' => $stat->site,
                    'date' => $stat->date->format('Y-m-d'),
                    'effectif_personnel' => $stat->effectif_personnel,
                    'total_heures' => $stat->total_heures,
                    'trir' => $stat->trir,
                    'ltir' => $stat->ltir,
                    'dart' => $stat->dart,
                    'acc_mortel' => $stat->acc_mortel,
                    'acc_arret' => $stat->acc_arret,
                    'acc_soins_medicaux' => $stat->acc_soins_medicaux,
                    'acc_restriction_temporaire' => $stat->acc_restriction_temporaire,
                    'premier_soin' => $stat->premier_soin,
                    'presque_accident' => $stat->presque_accident,
                    'dommage_materiel' => $stat->dommage_materiel,
                    'incident_environnemental' => $stat->incident_environnemental,
                    'nb_sensibilisations' => $stat->nb_sensibilisations,
                    'personnes_sensibilisees' => $stat->personnes_sensibilisees,
                    'inductions_total_personnes' => $stat->inductions_total_personnes,
                    'total_heures_formation' => $stat->formations_total_heures,
                    'total_heures_induction' => $stat->inductions_volume_heures,
                    'total_heures_formation_specifique' => $stat->formations_total_heures,
                    'ptsr_total' => $stat->ptsr_total,
                    'ptsr_controles' => $stat->ptsr_controles,
                    'permis_general' => $stat->permis_general,
                    'permis_excavation' => $stat->permis_excavation,
                    'permis_point_chaud' => $stat->permis_point_chaud,
                    'permis_espace_confine' => $stat->permis_espace_confine,
                    'permis_travail_hauteur' => $stat->permis_travail_hauteur,
                    'permis_levage' => $stat->permis_levage,
                    'permis_consignation' => $stat->permis_consignation,
                    'permis_electrique_tension' => $stat->permis_electrique_tension,
                    'observations_hse' => $stat->observations_hse,
                ];
            }),
            
            // Personnel & Hours
            'effectif_total' => $allStats->sum('effectif_personnel'),
            'volume_horaire_total' => $allStats->sum('total_heures'),
            
            // Safety indicators (averages)
            'trir_moyen' => $allStats->avg('trir') ?? 0,
            'ltir_moyen' => $allStats->avg('ltir') ?? 0,
            'dart_moyen' => $allStats->avg('dart') ?? 0,
            
            // Accidents by type
            'accidents' => [
                'mortel' => $allStats->sum('acc_mortel'),
                'arret' => $allStats->sum('acc_arret'),
                'soins_medicaux' => $allStats->sum('acc_soins_medicaux'),
                'restriction_temporaire' => $allStats->sum('acc_restriction_temporaire'),
                'premier_soin' => $allStats->sum('premier_soin'),
                'presque_accident' => $allStats->sum('presque_accident'),
                'dommage_materiel' => $allStats->sum('dommage_materiel'),
                'incident_environnemental' => $allStats->sum('incident_environnemental'),
            ],
            
            // Sensibilisation
            'nb_sensibilisations' => $allStats->sum('nb_sensibilisations'),
            'personnes_sensibilisees' => $allStats->sum('personnes_sensibilisees'),
            
            // Formations & Inductions
            'inductions_total' => $allStats->sum('inductions_total_personnes'),
            'total_heures_formation' => $allStats->sum('formations_total_heures'),
            'total_heures_induction' => $allStats->sum('inductions_volume_heures'),
            'total_heures_formation_specifique' => $allStats->sum('formations_total_heures'),
            
            // PTSR
            'ptsr_total' => $allStats->sum('ptsr_total'),
            'ptsr_controles' => $allStats->sum('ptsr_controles'),
            
            // Permis
            'permis_general_total' => $allStats->sum('permis_general'),
            'permis_specifiques' => [
                'excavation' => $allStats->sum('permis_excavation'),
                'point_chaud' => $allStats->sum('permis_point_chaud'),
                'espace_confine' => $allStats->sum('permis_espace_confine'),
                'travail_hauteur' => $allStats->sum('permis_travail_hauteur'),
                'levage' => $allStats->sum('permis_levage'),
                'consignation' => $allStats->sum('permis_consignation'),
                'electrique_tension' => $allStats->sum('permis_electrique_tension'),
            ],
            
            // Observations HSE
            'observations_hse_total' => $allStats->sum('observations_hse'),
        ];

        return Inertia::render('Admin/HseStatistics/Aggregated', [
            'aggregatedData' => $aggregatedData,
            'filters' => $request->only(['start_date', 'end_date', 'site', 'entreprise'])
        ]);
    }

    public function show(Request $request, $id)
    {
        $statistics = HseStat::with(['user', 'contractor'])->findOrFail($id);
        $source = $request->get('source', 'regular');
        
        return Inertia::render('Admin/HseStatistics/Show', [
            'statistics' => $statistics,
            'source' => $source
        ]);
    }

    public function download(Request $request, $id, $field)
    {
        $statistics = HseStat::findOrFail($id);
        
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
        
        if (!$filePath) {
            abort(404, 'Fichier non trouvé');
        }

        // Build the full file path
        $fullPath = storage_path('app/public/' . $filePath);
        
        if (!file_exists($fullPath)) {
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

    public function export(Request $request)
    {
        $query = HseStat::with(['user', 'contractor'])
            ->where('user_type', 'contractor');

        // Apply filters
        if ($request->filled('site')) {
            $query->where('site', 'like', '%' . $request->site . '%');
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('entreprise')) {
            $query->whereHas('contractor', function ($q) use ($request) {
                $q->where('company_name', 'like', '%' . $request->entreprise . '%');
            });
        }

        $statistics = $query->orderBy('created_at', 'desc')->get();

        // Create CSV content
        $csvData = [];
        $csvData[] = [
            'Contractant', 'Site', 'Entreprise', 'Date', 'Personnel', 'Heures Total', 
            'TRIR', 'LTIR', 'DART', 'Permis Total', 'Inspections Total', 'Soumis le', 'Modifié le'
        ];

        foreach ($statistics as $stat) {
            $csvData[] = [
                $stat->contractor->name ?? 'N/A',
                $stat->site,
                $stat->contractor->company_name ?? 'N/A',
                $stat->date->format('Y-m-d'),
                $stat->effectif_personnel,
                $stat->total_heures,
                $stat->trir,
                $stat->ltir,
                $stat->dart,
                $stat->permis_total,
                $stat->inspections_total_hse,
                $stat->created_at->format('Y-m-d H:i:s'),
                $stat->updated_at && $stat->updated_at != $stat->created_at ? $stat->updated_at->format('Y-m-d H:i:s') : ''
            ];
        }

        // Generate CSV file
        $filename = 'hse_statistics_' . date('Y-m-d_H-i-s') . '.csv';
        $file = fopen('php://temp', 'w');
        
        foreach ($csvData as $row) {
            fputcsv($file, $row);
        }
        
        rewind($file);
        $csvContent = stream_get_contents($file);
        fclose($file);

        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    public function exportExcel(Request $request)
    {
        $query = HseStat::with(['user', 'contractor'])
            ->where('user_type', 'contractor');

        // Apply date range filter if provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = $request->start_date;
            $endDate = $request->end_date;
            
            $query->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        }

        // Apply site filter if provided
        if ($request->filled('site')) {
            $query->where('site', 'like', '%' . $request->site . '%');
        }

        // Apply entreprise filter if provided
        if ($request->filled('entreprise')) {
            $query->whereHas('contractor', function ($q) use ($request) {
                $q->where('company_name', 'like', '%' . $request->entreprise . '%');
            });
        }

        $statistics = $query->orderBy('created_at', 'desc')->get();

        // Create Excel content with proper table format
        $excelData = [];
        
        // Headers
        $excelData[] = [
            'Contractant', 'Entreprise', 'Site', 'Date', 'Effectif', 'Volume Horaire',
            'TRIR', 'LTIR', 'DART', 'Acc. Mortel', 'Acc. Arrêt', 'Acc. Soins Médicaux',
            'Acc. Restriction', 'Premier Soin', 'Presque Accident', 'Dommage Matériel',
            'Incident Environnemental', 'Sensibilisations', 'Personnes Sensibilisées',
            'Inductions', 'H. Formation', 'H. Induction', 'H. Formation Spécifique',
            'PTSR Total', 'PTSR Contrôlés', 'Permis Général', 'Permis Excavation',
            'Permis Point Chaud', 'Permis Espace Confiné', 'Permis Travail Hauteur',
            'Permis Levage', 'Permis Consignation', 'Permis Électrique', 'Observations HSE'
        ];

        // Data rows
        foreach ($statistics as $stat) {
            $excelData[] = [
                $stat->contractor->name ?? 'N/A',
                $stat->contractor->company_name ?? 'N/A',
                $stat->site,
                $stat->date->format('Y-m-d'),
                $stat->effectif_personnel,
                $stat->total_heures,
                $stat->trir,
                $stat->ltir,
                $stat->dart,
                $stat->acc_mortel,
                $stat->acc_arret,
                $stat->acc_soins_medicaux,
                $stat->acc_restriction_temporaire,
                $stat->premier_soin,
                $stat->presque_accident,
                $stat->dommage_materiel,
                $stat->incident_environnemental,
                $stat->nb_sensibilisations,
                $stat->personnes_sensibilisees,
                $stat->inductions_total_personnes,
                $stat->formations_total_heures,
                $stat->inductions_volume_heures,
                $stat->formations_total_heures,
                $stat->ptsr_total,
                $stat->ptsr_controles,
                $stat->permis_general,
                $stat->permis_excavation,
                $stat->permis_point_chaud,
                $stat->permis_espace_confine,
                $stat->permis_travail_hauteur,
                $stat->permis_levage,
                $stat->permis_consignation,
                $stat->permis_electrique_tension,
                $stat->observations_hse
            ];
        }

        // Generate Excel file content (using HTML format with styling)
        $filename = 'hse_statistics_' . date('Y-m-d_H-i-s') . '.xls';
        
        // Create HTML table with Excel-compatible styling
        $html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <style>
                table { border-collapse: collapse; width: 100%; }
                th { background-color: #4F46E5; color: white; font-weight: bold; text-align: center; padding: 8px; border: 1px solid #ddd; }
                td { padding: 6px; border: 1px solid #ddd; text-align: center; }
                tr:nth-child(even) { background-color: #f9fafb; }
                tr:hover { background-color: #f3f4f6; }
                .contractor { background-color: #dbeafe; font-weight: bold; }
                .entreprise { background-color: #dcfce7; }
                .site { background-color: #fef3c7; }
                .date { background-color: #e0e7ff; }
                .effectif { background-color: #f0f9ff; font-weight: bold; }
                .heures { background-color: #f0fdf4; font-weight: bold; }
                .trir { background-color: #fef2f2; color: #dc2626; font-weight: bold; }
                .ltir { background-color: #fef2f2; color: #dc2626; font-weight: bold; }
                .dart { background-color: #fef2f2; color: #dc2626; font-weight: bold; }
                .accident { background-color: #fef3c7; color: #d97706; font-weight: bold; }
                .sensibilisation { background-color: #f0fdf4; color: #16a34a; font-weight: bold; }
                .formation { background-color: #faf5ff; color: #9333ea; font-weight: bold; }
                .ptsr { background-color: #e0e7ff; color: #4338ca; font-weight: bold; }
                .permis { background-color: #ecfdf5; color: #059669; font-weight: bold; }
                .observations { background-color: #fdf2f8; color: #be185d; font-weight: bold; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>';
        
        // Add headers with styling
        $headers = $excelData[0];
        foreach ($headers as $header) {
            $html .= '<th>' . htmlspecialchars($header) . '</th>';
        }
        $html .= '</tr></thead><tbody>';
        
        // Add data rows with conditional styling
        for ($i = 1; $i < count($excelData); $i++) {
            $row = $excelData[$i];
            $html .= '<tr>';
            
            foreach ($row as $index => $cell) {
                $class = '';
                $header = $headers[$index];
                
                // Apply styling based on column type
                if ($header === 'Contractant') $class = 'contractor';
                elseif ($header === 'Entreprise') $class = 'entreprise';
                elseif ($header === 'Site') $class = 'site';
                elseif ($header === 'Date') $class = 'date';
                elseif ($header === 'Effectif') $class = 'effectif';
                elseif (strpos($header, 'Heures') !== false) $class = 'heures';
                elseif (in_array($header, ['TRIR', 'LTIR', 'DART'])) $class = strtolower($header);
                elseif (strpos($header, 'Acc.') !== false) $class = 'accident';
                elseif (strpos($header, 'Sensibilis') !== false) $class = 'sensibilisation';
                elseif (strpos($header, 'Formation') !== false || strpos($header, 'Induction') !== false) $class = 'formation';
                elseif (strpos($header, 'PTSR') !== false) $class = 'ptsr';
                elseif (strpos($header, 'Permis') !== false) $class = 'permis';
                elseif (strpos($header, 'Observations') !== false) $class = 'observations';
                
                $html .= '<td class="' . $class . '">' . htmlspecialchars($cell) . '</td>';
            }
            $html .= '</tr>';
        }
        
        $html .= '</tbody></table></body></html>';

        return response($html)
            ->header('Content-Type', 'application/vnd.ms-excel')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}
