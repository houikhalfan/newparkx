<?php

namespace App\Http\Controllers\Contractant;

use App\Models\PermisTravailChaud;
use App\Models\Site;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PermisTravailChaudController extends Controller
{
    public function index()
    {
        $permis = PermisTravailChaud::with(['site', 'createdBy'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Contractant/PermisDeTravailAChaud', [
            'mode' => 'index',
            'permis' => $permis,
            'sites' => Site::all(),
        ]);
    }

    public function create()
    {
        $sites = Site::all();
        $contractor = auth()->user(); // Get authenticated contractor

        return Inertia::render('Contractant/PermisDeTravailAChaud', [
            'sites' => $sites,
            'mode' => 'create',
            'contractor' => [ // Send contractor data to frontend
                'company_name' => $contractor->company_name,
                'name' => $contractor->name,
            ]
        ]);
    }

    public function store(Request $request)
    {
        // Debug: Log the incoming request
        \Log::info('PermisTravailChaud Store Request:', $request->all());

        // Get the authenticated contractor's company name
        $contractorCompanyName = auth()->user()->company_name;

        $validated = $request->validate([
            'numero_permis' => 'required|string|unique:permis_travail_chauds',
            'site_id' => 'required|exists:sites,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'description_tache' => 'required|string|max:100',
            'plan_securitaire_par' => 'required|string',
            'date_plan_securitaire' => 'required|date',
            // Remove validation for contractant_demandeur since it's auto-filled
            'contractant_travail' => 'required|string',
            'activites' => 'required|array',
            'activites.*' => 'string',
            'activite_autre' => 'nullable|string|max:100',
            'dangers' => 'required|array',
            'dangers.*' => 'string',
            'danger_autre' => 'nullable|string|max:100',
            'protection_physique' => 'required|array',
            'protection_physique.*' => 'string',
            'protection_physique_autre' => 'nullable|string|max:100',
            'protection_respiratoire' => 'required|array',
            'protection_respiratoire.*' => 'string',
            'protection_incendie' => 'required|array',
            'protection_incendie.*' => 'string',
            'protection_incendie_autre' => 'nullable|string|max:100',
            'equipement_inspection' => 'required|array',
            'equipement_inspection.*' => 'string',
            'permis_requis' => 'required|array',
            'permis_requis.*' => 'string',
            'surveillance_requise' => 'required|array',
            'surveillance_requise.*' => 'string',
            'commentaires' => 'nullable|string|max:250',
            'resp_construction_nom' => 'required|string',
            'resp_construction_date' => 'required|date',
            'resp_hse_nom' => 'required|string',
            'resp_hse_date' => 'required|date',
            'resp_construction_file' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'resp_hse_file' => 'required|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        DB::beginTransaction();
        
        try {
            // Handle file uploads first
            $respConstructionPath = null;
            $respHsePath = null;

            if ($request->hasFile('resp_construction_file')) {
                $respConstructionPath = $request->file('resp_construction_file')->store('signatures/travail-chaud', 'public');
            }

            if ($request->hasFile('resp_hse_file')) {
                $respHsePath = $request->file('resp_hse_file')->store('signatures/travail-chaud', 'public');
            }

            // Prepare data for creation - use contractor's company name for contractant_demandeur
            $permitData = [
                ...$validated,
                'contractant_demandeur' => $contractorCompanyName, // Auto-filled from contractor profile
                'status' => 'en_attente',
                'meme_que_demandeur' => $request->boolean('meme_que_demandeur'),
                'aucun_commentaire' => $request->boolean('aucun_commentaire'),
                'resp_construction_signature' => $respConstructionPath,
                'resp_hse_signature' => $respHsePath,
                'created_by' => auth()->id(),
                'soumis_le' => now(),
            ];

            // Ensure contractant_travail is set correctly based on meme_que_demandeur
            if ($request->boolean('meme_que_demandeur')) {
                $permitData['contractant_travail'] = $contractorCompanyName;
            }

            \Log::info('Creating permit with data:', $permitData);

            // Create the permit
            $permis = PermisTravailChaud::create($permitData);

            DB::commit();

            \Log::info('Permit created successfully with ID:', ['id' => $permis->id]);

            return redirect()->route('contractant.permis-travail-chaud.index')
                ->with('success', 'Permis de travail à chaud créé avec succès');

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Clean up uploaded files if there's an error
            if (isset($respConstructionPath)) {
                Storage::disk('public')->delete($respConstructionPath);
            }
            if (isset($respHsePath)) {
                Storage::disk('public')->delete($respHsePath);
            }

            \Log::error('Error creating permit:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return redirect()->back()
                ->with('error', 'Erreur lors de la création du permis: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function show(PermisTravailChaud $permisTravailChaud)
    {
        $contractor = auth()->user();

        return Inertia::render('Contractant/PermisDeTravailAChaud', [
            'permis' => $permisTravailChaud->load(['site', 'createdBy']),
            'mode' => 'show',
            'sites' => Site::all(),
            'contractor' => [
                'company_name' => $contractor->company_name,
                'name' => $contractor->name,
            ]
        ]);
    }

    public function approbation(Request $request, PermisTravailChaud $permisTravailChaud)
    {
        $validated = $request->validate([
            'status' => 'required|in:en_cours,rejete,signe',
            'cm_parkx_nom' => 'required_if:status,signe|string|nullable',
            'cm_parkx_date' => 'required_if:status,signe|date|nullable',
            'hse_parkx_nom' => 'required_if:status,signe|string|nullable',
            'hse_parkx_date' => 'required_if:status,signe|date|nullable',
        ]);

        $updateData = $validated;

        // Handle file uploads for Parkx signatures
        if ($request->hasFile('cm_parkx_file')) {
            $updateData['cm_parkx_signature'] = $request->file('cm_parkx_file')->store('signatures/travail-chaud/parkx', 'public');
        }

        if ($request->hasFile('hse_parkx_file')) {
            $updateData['hse_parkx_signature'] = $request->file('hse_parkx_file')->store('signatures/travail-chaud/parkx', 'public');
        }

        $permisTravailChaud->update($updateData);

        return redirect()->back()->with('success', 'Statut du permis mis à jour');
    }
}