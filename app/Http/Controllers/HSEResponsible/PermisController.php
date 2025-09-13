<?php

namespace App\Http\Controllers\HSEResponsible;

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

    $permis = PermisExcavation::whereIn('status', ['en_cours', 'signe'])
        ->whereHas('site', function ($q) use ($user) {
            $q->where('responsible_hse_id', $user->id);
        })
        ->orderByDesc('created_at')
        ->get()
        ->map(function ($p) {
            return [
                'id'           => $p->id,
                'type'         => 'Excavation',
                'date'         => $p->created_at->format('Y-m-d'),
                'status'       => $p->status,
                'pdf_original' => $p->pdf_original ? asset('storage/' . $p->pdf_original) : null,
                'pdf_signed'   => $p->pdf_signed ? asset('storage/' . $p->pdf_signed) : null,
                'commentaire'  => $p->commentaire,
                'site'         => $p->site?->name,
            ];
        });

    return Inertia::render('HSEResponsible/SuiviPermisHSE', [
        'permis' => $permis,
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

    // ✅ Generate the full PDF (with excavation.blade.php)
    $pdf = Pdf::loadView('pdf.excavation', ['permis' => $permis])
        ->setPaper('a4', 'portrait');

    $pdfPath = "permis/pdf_original/permis_excavation_{$permis->id}.pdf";
    Storage::disk('public')->put($pdfPath, $pdf->output());

    // ✅ Save path in DB
    $permis->update(['pdf_original' => $pdfPath]);

    return redirect()
        ->route('hseResponsible.permis.index')
        ->with('success', 'Signature HSE enregistrée et PDF généré avec succès.');
}

}
