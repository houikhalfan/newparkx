<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use App\Models\PermisTravailSecuritaire;
use App\Models\PermisTravailChaud;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResponsibleSiteController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Get site IDs where this user is responsible
        $siteIds = Site::where('responsible_user_id', $user->id)->pluck('id');

        // Get filters from request
        $search = $request->get('q', '');
        $statusFilter = $request->get('s', '');
        $typeFilter = $request->get('t', '');

        // Fetch excavation permits with filters
        $permisExcavation = PermisExcavation::with('site')
            ->whereIn('site_id', $siteIds)
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
                    'numero_permis' => $p->numero_permis,
                    'status' => strtolower(trim($p->status)),
                    'created_at' => $p->created_at,
                    'pdf_signed' => $p->pdf_signed 
                        ? asset('storage/' . ltrim($p->pdf_signed, '/'))
                        : null,
                ];
            });

        // Fetch travail sécuritaire permits with filters
        $permisTravailSecuritaire = PermisTravailSecuritaire::with('site')
            ->whereIn('site_id', $siteIds)
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
                    'numero_permis' => $p->numero_permis,
                    'status' => strtolower(trim($p->status)),
                    'created_at' => $p->created_at,
                    'pdf_signed' => $p->pdf_signed 
                        ? asset('storage/' . ltrim($p->pdf_signed, '/'))
                        : null,
                ];
            });

        // Fetch travail à chaud permits with filters
        $permisTravailChaud = PermisTravailChaud::with('site')
            ->whereIn('site_id', $siteIds)
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
                    'numero_permis' => $p->numero_permis,
                    'status' => strtolower(trim($p->status)),
                    'created_at' => $p->created_at,
                    'pdf_signed' => $p->pdf_signed 
                        ? asset('storage/' . ltrim($p->pdf_signed, '/'))
                        : null,
                ];
            });

        // Combine all types
        $allPermis = $permisExcavation
            ->concat($permisTravailSecuritaire)
            ->concat($permisTravailChaud);

        // Filter by type if specified
        if ($typeFilter) {
            $allPermis = $allPermis->filter(function ($permis) use ($typeFilter) {
                return $permis['type'] === $typeFilter;
            });
        }

        $allPermis = $allPermis->sortByDesc('created_at')->values();

        return Inertia::render('ResponsibleSite/SuiviPermisSite', [
            'permis' => $allPermis,
            'filters' => [
                'q' => $search,
                's' => $statusFilter,
                't' => $typeFilter,
            ],
            'auth' => [
                'user' => $user
            ]
        ]);
    }
}