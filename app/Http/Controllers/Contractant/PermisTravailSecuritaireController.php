<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\PermisTravailSecuritaire;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PermisTravailSecuritaireController extends Controller
{
    public function index()
    {
        return Inertia::render('Contractant/PermisDeTravailSecuritaire', [
            'mode'   => 'index',
            'permis' => PermisTravailSecuritaire::with(['site', 'createdBy'])
                ->latest()
                ->paginate(10),
            'sites'  => Site::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Contractant/PermisDeTravailSecuritaire', [
            'mode'  => 'create',
            'sites' => Site::all(),
        ]);
    }

    public function store(Request $request)
    { 
        // ✅ Validation complète avec tous les champs
        $validated = $request->validate([
            // Identification
            'site_id' => 'required|exists:sites,id',
            'duree_de' => 'required|date',
            'duree_a' => 'required|date|after_or_equal:duree_de',
            'description' => 'required|string|min:10',
            'plan_securitaire_par' => 'required|string|max:255',
            'date_analyse' => 'required|date',
            'demandeur' => 'required|string|max:255',
            'contractant' => 'required|string|max:255',
            'meme_que_demandeur' => 'nullable|boolean',
            
            // Activités et dangers
            'activites' => 'required|array|min:1',
            'activites.*' => 'string',
            'activite_autre' => 'nullable|string|max:255',
            'permis_supp' => 'required|array|min:1',
            'permis_supp.*' => 'string',
            'dangers' => 'required|array|min:1',
            'dangers.*' => 'string',
            'danger_autre' => 'nullable|string|max:255',
            
            // EPI
            'epi_sans_additionnel' => 'nullable|boolean',
            'epi_chimique' => 'array',
            'epi_chimique.*' => 'string',
            'epi_respiratoire' => 'array',
            'epi_respiratoire.*' => 'string',
            
            // Équipements
            'equip_comms' => 'array',
            'equip_comms.*' => 'string',
            'equip_barrieres' => 'array',
            'equip_barrieres.*' => 'string',
            'equip_qualite_air' => 'array',
            'equip_qualite_air.*' => 'string',
            'equip_etincelles' => 'array',
            'equip_etincelles.*' => 'string',
            
            // Commentaires
            'commentaires' => 'required|string|min:10',
            
            // Confirmations
            'confirmation_travail' => 'required|accepted',
            'confirmation_conditions' => 'required|accepted',
            'confirmation_equipement' => 'required|accepted',
            'confirmation_epi' => 'required|accepted',
            
            // Signatures contractant
            'sig_resp_construction_nom' => 'required|string|max:255',
            'sig_resp_construction_date' => 'required|date',
            'sig_resp_construction_file' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'sig_resp_hse_nom' => 'required|string|max:255',
            'sig_resp_hse_date' => 'required|date',
            'sig_resp_hse_file' => 'required|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        try {
            // ✅ Gestion des fichiers signatures
            if ($request->hasFile('sig_resp_construction_file')) {
                $validated['sig_resp_construction_file'] = $request->file('sig_resp_construction_file')
                    ->store('permis-travail/signatures', 'public');
            }

            if ($request->hasFile('sig_resp_hse_file')) {
                $validated['sig_resp_hse_file'] = $request->file('sig_resp_hse_file')
                    ->store('permis-travail/signatures', 'public');
            }

            // ✅ Champs supplémentaires
            $validated['created_by'] = auth()->id();
            $validated['statut'] = 'en attente';
            $validated['soumis_le'] = now();

            // ✅ Convertir les checkboxes en boolean
            $validated['meme_que_demandeur'] = (bool)($validated['meme_que_demandeur'] ?? false);
            $validated['epi_sans_additionnel'] = (bool)($validated['epi_sans_additionnel'] ?? false);
            $validated['confirmation_travail'] = true;
            $validated['confirmation_conditions'] = true;
            $validated['confirmation_equipement'] = true;
            $validated['confirmation_epi'] = true;

            // ✅ Créer le permis
            $permit = PermisTravailSecuritaire::create($validated);

            return redirect()->route('contractant.permis-travail-securitaire.index')
                ->with('success', 'Permis de travail sécuritaire soumis avec succès.');

        } catch (\Exception $e) {
            // ✅ Gestion d'erreur
            return redirect()->back()
                ->with('error', 'Erreur lors de la soumission du permis: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function show(PermisTravailSecuritaire $permisTravailSecuritaire)
    {
        return Inertia::render('Contractant/PermisDeTravailSecuritaire', [
            'mode'   => 'show',
            'permis' => $permisTravailSecuritaire->load(['site', 'createdBy']),
            'sites'  => Site::all(),
        ]);
    }

    public function approbation(Request $request, PermisTravailSecuritaire $permisTravailSecuritaire)
    {
        $validated = $request->validate([
            'cm_parkx_nom' => 'required|string|max:255',
            'cm_parkx_date' => 'required|date',
            'cm_parkx_file' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'hse_parkx_nom' => 'required|string|max:255',
            'hse_parkx_date' => 'required|date',
            'hse_parkx_file' => 'required|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('cm_parkx_file')) {
            $validated['cm_parkx_file'] = $request->file('cm_parkx_file')
                ->store('permis-travail/signatures-parkx', 'public');
        }

        if ($request->hasFile('hse_parkx_file')) {
            $validated['hse_parkx_file'] = $request->file('hse_parkx_file')
                ->store('permis-travail/signatures-parkx', 'public');
        }

        $permisTravailSecuritaire->update(array_merge($validated, [
            'statut' => 'approuve',
            'approuve_le' => now(),
        ]));

        return redirect()->back()->with('success', 'Permis approuvé avec succès.');
    }
}