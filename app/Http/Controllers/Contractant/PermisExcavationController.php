<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use App\Models\Site;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
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
     * Show a single permit (optional – not used if you just want PDFs)
     */
    public function show(PermisExcavation $permisExcavation)
    {
        $permisExcavation->load('site');

        return Inertia::render('Contractant/PermisDetail', [
            'permis' => $permisExcavation,
        ]);
    }

    /**
     * Store new permit
     */
    public function store(Request $request)
    {
       $validated = $request->validate([
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
'proprietaire_signature' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
    'proprietaire_date' => 'required|date',

    // Responsables Contractant (always required)
    'sig_resp_construction_nom' => 'required|string',
    'sig_resp_construction_date' => 'required|date',
    'sig_resp_construction_file' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',

    'sig_resp_hse_nom' => 'required|string',
    'sig_resp_hse_date' => 'required|date',
    'sig_resp_hse_file' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
]);


// Handle propriétaire signature upload
if ($request->hasFile('proprietaire_signature')) {
    $validated['proprietaire_signature'] = $request->file('proprietaire_signature')
        ->store('signatures', 'public');
}



        // Handle signature uploads
        if ($request->hasFile('sig_resp_construction_file')) {
            $validated['sig_resp_construction_file'] = $request->file('sig_resp_construction_file')
                ->store('signatures', 'public');
        }
        if ($request->hasFile('sig_resp_hse_file')) {
            $validated['sig_resp_hse_file'] = $request->file('sig_resp_hse_file')
                ->store('signatures', 'public');
        }

        // Generate unique permit numbers
        $validated['numero_permis_general'] = now()->format('Y');
        $validated['numero_permis'] = strtoupper(Str::random(8));

        // Create the record
        $permis = PermisExcavation::create($validated);

        // Generate PDF + save
        $pdf = Pdf::loadView('pdf.permis_excavation', ['permis' => $permis]);
        $pdfPath = "permis/original/permis_excavation_{$permis->id}.pdf";
        Storage::disk('public')->put($pdfPath, $pdf->output());

        $permis->update(['pdf_original' => $pdfPath]);

        return redirect()
            ->route('contractant.suivi-permis.index')
            ->with('success', 'Votre permis a été soumis et enregistré avec succès.');
    }

    /**
     * Download PDF of original permit
     */
    public function downloadPdf($id)
    {
        $permis = PermisExcavation::with('site')->findOrFail($id);

        $pdf = Pdf::loadView('pdf.permis_excavation', compact('permis'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("permis_excavation_{$permis->numero_permis}.pdf");
    }
}
