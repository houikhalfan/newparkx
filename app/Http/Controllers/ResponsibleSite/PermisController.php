<?php

namespace App\Http\Controllers\ResponsibleSite;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use App\Models\PermisTravailSecuritaire;
use App\Models\PermisTravailChaud;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermisController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get excavation permits
        $permisExcavation = PermisExcavation::with('site')
            ->whereHas('site', function ($q) use ($user) {
                $q->where('responsible_user_id', $user->id);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'type' => 'excavation',
                    'type_label' => "Permis d'Excavation",
                    'numero_permis' => $p->numero_permis,
                    'site' => $p->site ? ['name' => $p->site->name] : null,
                    'status' => strtolower(trim($p->status)),
                    'created_at' => $p->created_at,
                    'pdf_signed' => !empty($p->pdf_signed) 
                                    ? asset('storage/' . ltrim($p->pdf_signed, '/'))
                                    : null,
                ];
            });

        // Get travail sécuritaire permits
        $permisTravailSecuritaire = PermisTravailSecuritaire::with('site')
            ->whereHas('site', function ($q) use ($user) {
                $q->where('responsible_user_id', $user->id);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'type' => 'travail_securitaire',
                    'type_label' => "Permis de Travail Sécuritaire",
                    'numero_permis' => $p->numero_permis,
                    'site' => $p->site ? ['name' => $p->site->name] : null,
                    'status' => strtolower(trim($p->status)),
                    'created_at' => $p->created_at,
                    'pdf_signed' => !empty($p->pdf_signed) 
                                    ? asset('storage/' . ltrim($p->pdf_signed, '/'))
                                    : null,
                ];
            });

        // Get travail chaud permits
        $permisTravailChaud = PermisTravailChaud::with('site')
            ->whereHas('site', function ($q) use ($user) {
                $q->where('responsible_user_id', $user->id);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'type' => 'travail_chaud',
                    'type_label' => "Permis de Travail à Chaud",
                    'numero_permis' => $p->numero_permis,
                    'site' => $p->site ? ['name' => $p->site->name] : null,
                    'status' => strtolower(trim($p->status)),
                    'created_at' => $p->created_at,
                    'pdf_signed' => !empty($p->pdf_signed) 
                                    ? asset('storage/' . ltrim($p->pdf_signed, '/'))
                                    : null,
                ];
            });

        // Combine all types
        $allPermis = $permisExcavation->concat($permisTravailSecuritaire)
            ->concat($permisTravailChaud)
            ->sortByDesc('created_at')
            ->values();

        return Inertia::render('ResponsibleSite/SuiviPermisSite', [
            'permis' => $allPermis,
        ]);
    }

    public function show(PermisExcavation $permisExcavation)
    {
        $readonly = $permisExcavation->status === 'signe';

        $permisExcavation->pdf_signed = $permisExcavation->pdf_signed
            ? asset('storage/' . ltrim($permisExcavation->pdf_signed, '/'))
            : null;

        return Inertia::render('ResponsibleSite/PermisSign', [
            'permis' => $permisExcavation->load('site'),
            'readonly' => $readonly,
            'showSignatureResponsableSite' => !$readonly,
            'showFermeture' => $readonly,
        ]);
    }

    public function showTravailSecuritaire(PermisTravailSecuritaire $permisTravailSecuritaire)
    {
        $readonly = $permisTravailSecuritaire->status === 'signe';

        $permisTravailSecuritaire->pdf_signed = $permisTravailSecuritaire->pdf_signed
            ? asset('storage/' . ltrim($permisTravailSecuritaire->pdf_signed, '/'))
            : null;

        return Inertia::render('ResponsibleSite/PermisTravailSecuritaireSign', [
            'permis' => $permisTravailSecuritaire->load('site'),
            'readonly' => $readonly,
            'showSignatureResponsableSite' => !$readonly,
        ]);
    }

    public function showTravailChaud(PermisTravailChaud $permisTravailChaud)
{
    $readonly = $permisTravailChaud->status === 'signe';

   return Inertia::render('ResponsibleSite/PermisTravailAChaude', [
        'permis' => $permisTravailChaud->load('site'),
        'readonly' => $readonly,
        'showSignatureResponsableSite' => !$readonly,
    ]);
}

    public function sign(Request $request, PermisExcavation $permis)
    {
        $request->validate([
            'cm_parkx_nom'  => 'required|string',
            'cm_parkx_date' => 'required|date',
            'cm_parkx_file' => 'required|file|mimes:jpg,png',
        ]);

        $data = [
            'status' => 'en_cours',
            'cm_parkx_nom' => $request->cm_parkx_nom,
            'cm_parkx_date' => $request->cm_parkx_date,
        ];

        if ($request->hasFile('cm_parkx_file')) {
            $data['cm_parkx_file'] = $request->file('cm_parkx_file')
                ->store('signatures', 'public');
        }

        $permis->update($data);

        return redirect()
            ->route('responsibleSite.permis.index')
            ->with('success', 'Permis d\'excavation signé avec succès.');
    }

    public function signTravailSecuritaire(Request $request, PermisTravailSecuritaire $permis)
    {
        $request->validate([
            'cm_parkx_nom'  => 'required|string',
            'cm_parkx_date' => 'required|date',
            'cm_parkx_file' => 'required|file|mimes:jpg,png',
        ]);

        $data = [
            'status' => 'en_cours',
            'cm_parkx_nom' => $request->cm_parkx_nom,
            'cm_parkx_date' => $request->cm_parkx_date,
        ];

        if ($request->hasFile('cm_parkx_file')) {
            $data['cm_parkx_file'] = $request->file('cm_parkx_file')
                ->store('signatures', 'public');
        }

        $permis->update($data);

        return redirect()
            ->route('responsibleSite.permis.index')
            ->with('success', 'Permis de travail sécuritaire signé avec succès.');
    }

    public function signTravailChaud(Request $request, PermisTravailChaud $permisTravailChaud)
{
    $request->validate([
        'cm_parkx_nom'  => 'required|string', // Changed from resp_site_nom
        'cm_parkx_date' => 'required|date',   // Changed from resp_site_date
        'cm_parkx_file' => 'required|file|mimes:jpg,png', // Changed from resp_site_file
        'resp_site_commentaires' => 'nullable|string|max:500', // Keep this if it exists
    ]);

    $data = [
        'status' => 'en_cours',
        'cm_parkx_nom' => $request->cm_parkx_nom, // Changed from resp_site_nom
        'cm_parkx_date' => $request->cm_parkx_date, // Changed from resp_site_date
        'resp_site_commentaires' => $request->resp_site_commentaires,
    ];

    if ($request->hasFile('cm_parkx_file')) { // Changed from resp_site_file
        $data['cm_parkx_signature'] = $request->file('cm_parkx_file') // Changed field name
            ->store('signatures/permis-chaud', 'public');
    }

    $permisTravailChaud->update($data);

    return redirect()
        ->route('responsibleSite.permis.index')
        ->with('success', 'Permis de travail à chaud signé avec succès.');
}
}