<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermisExcavationRequest;
use App\Models\PermisExcavation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PermisExcavationController extends Controller
{
    public function store(StorePermisExcavationRequest $request)
    {
        $data = $request->validated();

        // Upload images if present
        foreach (['proprietaire_signature', 'sig_resp_construction_file', 'sig_resp_hse_file'] as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('signatures', 'public');
            }
        }

        // Numéros uniques
        if (empty($data['numero_permis_general'])) {
            $data['numero_permis_general'] = now()->format('Y');
        }

        $data['numero_permis'] = 'PX-' . strtoupper(Str::slug($data['contractant'], '-')) . '-' . now()->format('Ymd') . '-' . rand(1000, 9999);

        // Create record
        $permis = PermisExcavation::create($data);

        // Ensure relation loaded for the PDF
        $permis->load('site');

        // Generate PDF original
        $pdf = Pdf::loadView('pdf.excavation', ['permis' => $permis])
            ->setPaper('a4', 'portrait');

        $pdfPath = "permis/original/permis_excavation_{$permis->id}.pdf"; // ✅ unified folder name
        Storage::disk('public')->put($pdfPath, $pdf->output());

        // Save path in DB
        $permis->update(['pdf_original' => $pdfPath]);

        return redirect()
            ->route('contractant.suivi-permis.index')
            ->with('success', 'Permis d\'excavation enregistré avec succès !');
    }

    public function index()
    {
    $permis = PermisExcavation::with('site')
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

        return Inertia::render('Contractant/SuiviPermis', [
            'permis' => $permis,
        ]);
    }

    public function updateOrSign(Request $request, PermisExcavation $permis)
    {
        // update DB with submitted data
        $permis->update($request->all());

        // force status if HSE signed
        if ($request->has('hse_parkx_nom') || $request->hasFile('hse_parkx_file')) {
            $permis->status = 'signe';
            $permis->save();
        }

        // regenerate PDF with latest data
        $pdf = Pdf::loadView('pdf.excavation', ['permis' => $permis])
            ->setPaper('a4', 'portrait');

       $pdfPath = "permis/pdf_original/permis_excavation_{$permis->id}.pdf";
Storage::disk('public')->put($pdfPath, $pdf->output());
$permis->update(['pdf_original' => $pdfPath]);
        return redirect()
            ->route('permis.show', $permis)
            ->with('success', 'Permis mis à jour et PDF régénéré.');
    }
}
