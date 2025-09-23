<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use App\Models\PermisTravailSecuritaire;
use Inertia\Inertia;

class SuiviPermisController extends Controller
{
    public function index()
    {
        // Récupérer les permis des DEUX tables
        $permisExcavation = PermisExcavation::with('site')
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

        $permisTravailSecuritaire = PermisTravailSecuritaire::with('site')
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

        // Combiner et trier par date
        $allPermis = $permisExcavation->concat($permisTravailSecuritaire)
            ->sortByDesc('created_at')
            ->values();

        return Inertia::render('Contractant/SuiviPermis', [
            'permis' => $allPermis,
        ]);
    }
}