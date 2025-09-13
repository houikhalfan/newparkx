<?php

namespace App\Http\Controllers\ResponsibleSite;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class PermisController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $permis = PermisExcavation::whereHas('site', function ($q) use ($user) {
                $q->where('responsible_user_id', $user->id);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id'           => $p->id,
                    'type'         => 'Excavation',
                    'date'         => $p->created_at->format('Y-m-d'),
                    'numero_permis'=> $p->numero_permis,
                    'status'       => $p->status,
                    'pdf_original' => $p->pdf_original ? asset('storage/' . $p->pdf_original) : null,
                    'pdf_signed'   => $p->pdf_signed ? asset('storage/' . $p->pdf_signed) : null,
                ];
            });

        return Inertia::render('ResponsibleSite/SuiviPermisSite', [
            'permis' => $permis,
        ]);
    }

    public function show(PermisExcavation $permisExcavation)
    {
        $readonly = $permisExcavation->status === 'signe';
        $showFermeture = $permisExcavation->status === 'signe';

        $permisExcavation->pdf_original = $permisExcavation->pdf_original 
            ? asset('storage/' . $permisExcavation->pdf_original) 
            : null;

        $permisExcavation->pdf_signed = $permisExcavation->pdf_signed 
            ? asset('storage/' . $permisExcavation->pdf_signed) 
            : null;

        return Inertia::render('ResponsibleSite/PermisSign', [
            'permis' => $permisExcavation->load('site'),
            'readonly' => $readonly,
            'showSignatureResponsableSite' => !$readonly,
            'showFermeture' => $showFermeture,
        ]);
    }

    public function sign(Request $request, PermisExcavation $permis)
    {
        $request->validate([
            'cm_parkx_nom'  => 'nullable|string',
            'cm_parkx_date' => 'nullable|date',
            'cm_parkx_file' => 'nullable|file|mimes:jpg,png',
        ]);

        $data = [];

        if ($request->filled('cm_parkx_nom')) {
            $data['cm_parkx_nom'] = $request->cm_parkx_nom;
        }

        if ($request->filled('cm_parkx_date')) {
            $data['cm_parkx_date'] = $request->cm_parkx_date;
        }

        if ($request->hasFile('cm_parkx_file')) {
            $data['cm_parkx_file'] = $request->file('cm_parkx_file')
                ->store('signatures', 'public');
        }

        // ✅ Après signature du responsable site → statut "en_cours"
        $data['status'] = 'en_cours';

        $permis->update($data);

        // ✅ Recharger pour PDF
        $permis->load('site');

        // ✅ Générer le PDF original à ce stade
        $pdf = Pdf::loadView('pdf.excavation', ['permis' => $permis])
            ->setPaper('a4', 'portrait');

        $pdfPath = "permis/pdf_original/permis_excavation_{$permis->id}.pdf";
        Storage::disk('public')->put($pdfPath, $pdf->output());

        // ✅ Mettre à jour en DB
        $permis->update(['pdf_original' => $pdfPath]);

        return redirect()
            ->route('responsibleSite.permis.index')
            ->with('success', 'Signature enregistrée et PDF généré avec succès.');
    }
}
