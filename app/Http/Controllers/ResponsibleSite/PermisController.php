<?php

namespace App\Http\Controllers\ResponsibleSite;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermisController extends Controller
{
public function index()
{
    $user = auth()->user();

    // Get raw data without transformation for debugging
    $rawPermis = PermisExcavation::with('site')
        ->whereHas('site', function ($q) use ($user) {
            $q->where('responsible_user_id', $user->id);
        })
        ->orderByDesc('created_at')
        ->get();
    
    // Log raw data
    \Log::info('Raw permis data:', $rawPermis->toArray());
    
    // Transform for frontend
    $permis = $rawPermis->map(function ($p) {
        return [
            'id'            => $p->id,
            'numero_permis' => $p->numero_permis,
            'status'        => strtolower(trim($p->status)),
            'date'          => $p->created_at ? $p->created_at->translatedFormat('d/m/Y H:i') : '—',
            'pdf_signed'    => !empty($p->pdf_signed) 
                                ? asset('storage/' . ltrim($p->pdf_signed, '/'))
                                : null,
        ];
    });

    return Inertia::render('ResponsibleSite/SuiviPermisSite', [
        'permis' => $permis,
        'debug_raw' => $rawPermis->toArray(), // Temporary for debugging
    ]);
}  public function show(PermisExcavation $permisExcavation)
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

    public function sign(Request $request, PermisExcavation $permis)
    {
        $request->validate([
            'cm_parkx_nom'  => 'nullable|string',
            'cm_parkx_date' => 'nullable|date',
            'cm_parkx_file' => 'nullable|file|mimes:jpg,png',
        ]);

        $data = [
            'status' => 'en_cours',
        ];

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

        $permis->update($data);

        return redirect()
            ->route('responsibleSite.permis.index')
            ->with('success', 'Signature enregistrée avec succès.');
    }
}
