<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use App\Models\PermisTravailSecuritaire;
use App\Models\PermisTravailChaud;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermisAdminController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('q', '');
        $status = $request->get('s', '');
        $type = $request->get('t', '');

        // Permis d'excavation
        $excavationQuery = PermisExcavation::with('site')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('numero_permis', 'like', "%{$search}%")
                      ->orWhere('contractant', 'like', "%{$search}%")
                      ->orWhereHas('site', function ($siteQuery) use ($search) {
                          $siteQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            });

        $permisExcavation = $excavationQuery->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'numero_permis' => $p->numero_permis ?? '',
                'type' => 'Permis d\'excavation',
                'site' => $p->site?->name ?? '',
                'contractant' => $p->contractant ?? '',
                'created_at' => $p->created_at->translatedFormat('d F Y'),
                'status' => $p->status ?? 'en_attente',
                'pdf_original' => $p->pdf_signed 
                    ? asset('storage/' . $p->pdf_signed) 
                    : null,
                'model_type' => 'excavation'
            ];
        });

        // Permis de travail sécuritaire
        $securitaireQuery = PermisTravailSecuritaire::with('site')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('numero_permis', 'like', "%{$search}%")
                      ->orWhere('contractant', 'like', "%{$search}%")
                      ->orWhere('employeur', 'like', "%{$search}%")
                      ->orWhereHas('site', function ($siteQuery) use ($search) {
                          $siteQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            });

        $permisSecuritaire = $securitaireQuery->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'numero_permis' => $p->numero_permis ?? '',
                'type' => 'Permis de travail sécuritaire',
                'site' => $p->site?->name ?? '',
                'contractant' => $p->contractant ?? $p->employeur ?? '',
                'created_at' => $p->created_at->translatedFormat('d F Y'),
                'status' => $p->status ?? 'en_attente',
                'pdf_original' => $p->pdf_signed 
                    ? asset('storage/' . $p->pdf_signed) 
                    : null,
                'model_type' => 'securitaire'
            ];
        });

        // Permis de travail chaud
        $chaudQuery = PermisTravailChaud::with('site')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('numero_permis', 'like', "%{$search}%")
                      ->orWhere('contractant', 'like', "%{$search}%")
                      ->orWhere('employeur', 'like', "%{$search}%")
                      ->orWhereHas('site', function ($siteQuery) use ($search) {
                          $siteQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            });

        $permisChaud = $chaudQuery->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'numero_permis' => $p->numero_permis ?? '',
                'type' => 'Permis de travail à chaud',
                'site' => $p->site?->name ?? '',
                'contractant' => $p->contractant ?? $p->employeur ?? '',
                'created_at' => $p->created_at->translatedFormat('d F Y'),
                'status' => $p->status ?? 'en_attente',
                'pdf_original' => $p->pdf_signed 
                    ? asset('storage/' . $p->pdf_signed) 
                    : null,
                'model_type' => 'chaud'
            ];
        });

        // Fusionner et filtrer par type si spécifié
        $allPermis = $permisExcavation
            ->merge($permisSecuritaire)
            ->merge($permisChaud);

        if ($type) {
            $allPermis = $allPermis->filter(function ($permis) use ($type) {
                return $permis['model_type'] === $type;
            });
        }

        $permis = $allPermis->sortByDesc('created_at')->values();

        return Inertia::render('Admin/Permis/SuiviPermisAdmin', [
            'permis' => $permis,
            'q' => $search,
            's' => $status,
            't' => $type,
        ]);
    }
}