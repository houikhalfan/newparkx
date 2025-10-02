<?php

namespace App\Http\Controllers\HSEResponsible;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use App\Models\PermisTravailChaud;
use App\Models\PermisTravailSecuritaire;
use App\Models\Site;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class PermisController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Get site IDs where this user is HSE responsible
        $siteIds = Site::where('responsible_hse_id', $user->id)->pluck('id');

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
                    'site' => $p->site,
                    'site_id' => $p->site_id,
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
                    'site' => $p->site,
                    'site_id' => $p->site_id,
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
                    'site' => $p->site,
                    'site_id' => $p->site_id,
                    'status' => strtolower(trim($p->status)),
                    'created_at' => $p->created_at,
                    'pdf_signed' => $p->pdf_signed 
                        ? asset('storage/' . ltrim($p->pdf_signed, '/'))
                        : null,
                ];
            });

        // Combine all types
        $allPermis = $permisExcavation
            ->concat($permisTravailChaud)
            ->concat($permisTravailSecuritaire);

        // Filter by type if specified
        if ($typeFilter) {
            $allPermis = $allPermis->filter(function ($permis) use ($typeFilter) {
                return $permis['type'] === $typeFilter;
            });
        }

        $allPermis = $allPermis->sortByDesc('created_at')->values();

        return Inertia::render('HSEResponsible/SuiviPermisHSE', [
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

    public function show(PermisExcavation $permisExcavation)
    {
        $readonly = $permisExcavation->status === 'signe';
        $showFermeture = $permisExcavation->status === 'signe';

        return Inertia::render('HSEResponsible/PermisSign', [
            'permis' => $permisExcavation->load('site'),
            'readonly' => $readonly,
            'showSignatureResponsableSite' => !$readonly,
            'showFermeture' => $showFermeture,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function showTravailChaud(PermisTravailChaud $permisTravailChaud)
    {
        $readonly = $permisTravailChaud->status === 'signe';

        return Inertia::render('HSEResponsible/PermisTravailChaudSign', [
            'permis' => $permisTravailChaud->load('site'),
            'readonly' => $readonly,
            'showSignatureHSE' => !$readonly,
        ]);
    }

  // In HSEResponsiblePermisCtrl controller
public function showTravailSecuritaire(PermisTravailSecuritaire $permisTravailSecuritaire)
{
    $readonly = $permisTravailSecuritaire->status === 'signe';

    return Inertia::render('HSEResponsible/PermisTravailSecuritaireSignHSE', [
        'permis' => $permisTravailSecuritaire->load('site'),
        'readonly' => $readonly,
        'showSignatureHSE' => !$readonly,
        'auth' => [
            'user' => auth()->user()
        ]
    ]);
}

    public function sign(Request $request, PermisExcavation $permis)
    {
        $request->validate([
            'hse_parkx_nom'  => 'nullable|string',
            'hse_parkx_date' => 'nullable|date',
            'hse_parkx_file' => 'nullable|file|mimes:jpg,png',
        ]);

        $data = [
            'status' => 'signe',
        ];

        if ($request->filled('hse_parkx_nom')) {
            $data['hse_parkx_nom'] = $request->hse_parkx_nom;
        }

        if ($request->filled('hse_parkx_date')) {
            $data['hse_parkx_date'] = $request->hse_parkx_date;
        }

        if ($request->hasFile('hse_parkx_file')) {
            $data['hse_parkx_file'] = $request->file('hse_parkx_file')
                ->store('signatures', 'public');
        }

        // ✅ Save HSE fields and set status to "signe"
        $permis->update($data);

        // ✅ Reload permit with relations for PDF
        $permis->load('site');

        // ✅ Generate the full PDF
        $pdf = Pdf::loadView('pdf.excavation', ['permis' => $permis])
            ->setPaper('a4', 'portrait');

        $pdfPath = "permis/pdf_signed/permis_excavation_{$permis->id}.pdf";
        Storage::disk('public')->put($pdfPath, $pdf->output());

        // ✅ Save path in DB
        $permis->update(['pdf_signed' => $pdfPath]);

        return redirect()
            ->route('hseResponsible.permis.index')
            ->with('success', 'Signature HSE enregistrée et PDF généré avec succès.');
    }

    public function signTravailChaud(Request $request, PermisTravailChaud $permisTravailChaud)
    {
        $request->validate([
            'hse_parkx_nom'  => 'required|string',
            'hse_parkx_date' => 'required|date',
            'hse_parkx_file' => 'required|file|mimes:jpg,png',
            'hse_parkx_commentaires' => 'nullable|string',
        ]);

        $data = [
            'status' => 'signe',
            'hse_parkx_nom' => $request->hse_parkx_nom,
            'hse_parkx_date' => $request->hse_parkx_date,
        ];

        if ($request->hasFile('hse_parkx_file')) {
            $data['hse_parkx_signature'] = $request->file('hse_parkx_file')
                ->store('signatures', 'public');
        }

        if ($request->filled('hse_parkx_commentaires')) {
            $data['hse_parkx_commentaires'] = $request->hse_parkx_commentaires;
        }

        // ✅ Save HSE fields and set status to "signe"
        $permisTravailChaud->update($data);

        // ✅ Generate PDF for travail à chaud
        $permisTravailChaud->load('site');
        $pdf = Pdf::loadView('pdf.travail_chaud', ['permis' => $permisTravailChaud])
            ->setPaper('a4', 'portrait');

        $pdfPath = "permis/pdf_signed/permis_travail_chaud_{$permisTravailChaud->id}.pdf";
        Storage::disk('public')->put($pdfPath, $pdf->output());

        // ✅ Save path in DB
        $permisTravailChaud->update(['pdf_signed' => $pdfPath]);

        return redirect()
            ->route('hseResponsible.permis.index')
            ->with('success', 'Signature HSE enregistrée et PDF généré avec succès.');
    }

 public function signTravailSecuritaire(Request $request, PermisTravailSecuritaire $permisTravailSecuritaire)
{
    $request->validate([
        'hse_parkx_nom' => 'required|string',
        'hse_parkx_date' => 'required|date',
        'hse_parkx_file' => 'required|file|mimes:jpg,png,jpeg|max:2048',
    ]);

    $data = [
        'status' => 'signe',
        'hse_parkx_nom' => $request->hse_parkx_nom,
        'hse_parkx_date' => $request->hse_parkx_date,
    ];

    // Handle file upload
    if ($request->hasFile('hse_parkx_file')) {
        $file = $request->file('hse_parkx_file');
        $path = $file->store('signatures', 'public');
        $data['hse_parkx_file'] = $path;
    }

    // Update the permit
    $permisTravailSecuritaire->update($data);

    // Generate PDF
    $permisTravailSecuritaire->load('site');
    $pdf = Pdf::loadView('pdf.travail_securitaire', ['permis' => $permisTravailSecuritaire])
        ->setPaper('a4', 'portrait');

    $pdfPath = "permis/pdf_signed/permis_travail_securitaire_{$permisTravailSecuritaire->id}.pdf";
    Storage::disk('public')->put($pdfPath, $pdf->output());

    // Save PDF path in DB
    $permisTravailSecuritaire->update(['pdf_signed' => $pdfPath]);

    return redirect()
        ->route('hseResponsible.permis.index')
        ->with('success', 'Signature HSE enregistrée et PDF généré avec succès.');
}
}