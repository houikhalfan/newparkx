<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use App\Models\Site;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PermisExcavationController extends Controller
{
    /**
     * Show form to create new permit
     */
    public function create()
    {
        $sites = Site::all(['id', 'name']);

        return Inertia::render('Contractant/PermisExcavation', [
            'sites' => $sites,
            'readonly' => false,
            'showFermeture' => false, // 👈 toujours masqué côté contractant
        ]);
    }

    /**
     * List all permits (suivi)
     */
    public function index()
    {
        $permis = PermisExcavation::with('site')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Contractant/SuiviPermis', [
            'permis' => $permis,
        ]);
    }

    /**
     * Show a single permit (consultation only)
     */
    public function show(PermisExcavation $permisExcavation)
    {
        $permisExcavation->load('site');

        return Inertia::render('Contractant/PermisExcavation', [
            'sites' => Site::all(['id','name']),
            'permis' => $permisExcavation,
            'readonly' => true,
            'showFermeture' => false,
        ]);
    }

    /**
     * Store new permit
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero_permis_general' => 'nullable|string',

            'site_id' => 'required|exists:sites,id',
            'duree_de' => 'required|date',
            'duree_a' => 'required|date|after_or_equal:duree_de',
            'description' => 'required|string',
            'analyse_par' => 'required|string',
            'date_analyse' => 'required|date',
            'demandeur' => 'required|string',
            'contractant' => 'required|string',

            // Propriétaire
            'proprietaire_nom' => 'required|string',
            'proprietaire_signature' => 'required|image|mimes:png,jpg,jpeg|max:2048',
            'proprietaire_date' => 'required|date',

            // Responsables Contractant
            'sig_resp_construction_nom' => 'required|string',
            'sig_resp_construction_date' => 'required|date',
            'sig_resp_construction_file' => 'required|image|mimes:png,jpg,jpeg|max:2048',

            'sig_resp_hse_nom' => 'required|string',
            'sig_resp_hse_date' => 'required|date',
            'sig_resp_hse_file' => 'required|image|mimes:png,jpg,jpeg|max:2048',

            // Arrays of checkboxes
            'excavation_est' => 'nullable|array',
            'conduites' => 'nullable|array',
            'situations' => 'nullable|array',
            'epi_simples' => 'nullable|array',
            'equip_checks' => 'nullable|array',

            // Optional
            'situation_autre' => 'nullable|string',
            'epi_autre' => 'nullable|string',
            'equip_autre' => 'nullable|string',
            'commentaires' => 'nullable|string',

            // Booleans
            'danger_aucun' => 'boolean',
            'epi_sans_additionnel' => 'boolean',
            'equip_non_requis' => 'boolean',
            'aucun_commentaire' => 'boolean',
        ]);

        // Uploads
        if ($request->hasFile('proprietaire_signature')) {
            $validated['proprietaire_signature'] = $request->file('proprietaire_signature')
                ->store('signatures', 'public');
        }
        if ($request->hasFile('sig_resp_construction_file')) {
            $validated['sig_resp_construction_file'] = $request->file('sig_resp_construction_file')
                ->store('signatures', 'public');
        }
        if ($request->hasFile('sig_resp_hse_file')) {
            $validated['sig_resp_hse_file'] = $request->file('sig_resp_hse_file')
                ->store('signatures', 'public');
        }

        // ✅ keep user’s numero_permis_general, fallback only if missing
        $validated['numero_permis_general'] = $validated['numero_permis_general'] ?: now()->format('Y');

        // Always generate unique numero_permis
        $validated['numero_permis'] = 'PX-' . strtoupper(Str::slug($validated['contractant'], '-'))
            . '-' . now()->format('Ymd') . '-' . rand(1000, 9999);

        // Create record
        PermisExcavation::create($validated);

        return redirect()
            ->route('contractant.suivi-permis.index')
            ->with('success', 'Votre permis a été soumis et enregistré avec succès.');
    }
}
