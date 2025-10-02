<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use App\Models\PermisTravailSecuritaire;
use App\Models\PermisTravailChaud;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuiviPermisController extends Controller
{
    public function index(Request $request)
    {
        // Get filters from request
        $search = $request->get('search', '');
        $statusFilter = $request->get('status', '');

        // Get current user info
        $user = auth()->user();
        $userName = $user->name;
        $userCompany = $user->company_name;
        
        // Create the search pattern for demandeur fields
        $demandeurPattern = "{$userName} - {$userCompany}";

        // Récupérer les permis d'excavation avec filtres
        $permisExcavation = PermisExcavation::with('site')
            ->where('demandeur', $demandeurPattern)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('numero_permis', 'like', "%{$search}%")
                      ->orWhereHas('site', function ($siteQuery) use ($search) {
                          $siteQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($statusFilter, function ($query) use ($statusFilter) {
                $query->where('status', $statusFilter);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'type' => 'excavation',
                    'type_label' => "Permis d'Excavation",
                    'numero_permis' => $p->numero_permis,
                    'site' => $p->site ? ['id' => $p->site->id, 'name' => $p->site->name] : null,
                    'status' => $p->status,
                    'created_at' => $p->created_at,
                    'pdf_signed' => $p->pdf_signed,
                ];
            });

        // Récupérer les permis de travail sécuritaire avec filtres
        $permisTravailSecuritaire = PermisTravailSecuritaire::with('site')
            ->where('demandeur', $demandeurPattern)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('numero_permis', 'like', "%{$search}%")
                      ->orWhereHas('site', function ($siteQuery) use ($search) {
                          $siteQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($statusFilter, function ($query) use ($statusFilter) {
                $query->where('status', $statusFilter);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'type' => 'travail_securitaire',
                    'type_label' => "Permis de Travail Sécuritaire",
                    'numero_permis' => $p->numero_permis,
                    'site' => $p->site ? ['id' => $p->site->id, 'name' => $p->site->name] : null,
                    'status' => $p->status,
                    'created_at' => $p->created_at,
                    'pdf_signed' => $p->pdf_signed,
                ];
            });

        // Récupérer les permis de travail à chaud avec filtres
        $permisTravailChaud = PermisTravailChaud::with('site')
            ->where('contractant_demandeur', $demandeurPattern)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('numero_permis', 'like', "%{$search}%")
                      ->orWhereHas('site', function ($siteQuery) use ($search) {
                          $siteQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($statusFilter, function ($query) use ($statusFilter) {
                $query->where('status', $statusFilter);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'type' => 'travail_chaud',
                    'type_label' => "Permis de Travail à Chaud",
                    'numero_permis' => $p->numero_permis,
                    'site' => $p->site ? ['id' => $p->site->id, 'name' => $p->site->name] : null,
                    'status' => $p->status,
                    'created_at' => $p->created_at,
                    'pdf_signed' => $p->pdf_signed,
                ];
            });

        // Combiner et trier par date
        $allPermis = $permisExcavation
            ->concat($permisTravailSecuritaire)
            ->concat($permisTravailChaud)
            ->sortByDesc('created_at')
            ->values();

        return Inertia::render('Contractant/SuiviPermis', [
            'permis' => $allPermis,
            'filters' => [
                'search' => $search,
                'status' => $statusFilter,
            ],
            'contractor' => $user,
        ]);
    }
}