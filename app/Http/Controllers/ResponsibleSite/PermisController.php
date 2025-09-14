<?php

namespace App\Http\Controllers\ResponsibleSite;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;


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
                'id'            => $p->id,
                'numero_permis' => $p->numero_permis,
                'status'        => strtolower(trim($p->status)),
                // 👇 On envoie une vraie date/heure ISO
'date' => $p->created_at->translatedFormat('d/m/Y H:i'),
                // 👇 On vérifie bien l’existence du PDF signé
                'pdf_signed'    => $p->pdf_signed && Storage::disk('public')->exists($p->pdf_signed)
                    ? asset('storage/' . $p->pdf_signed)
                    : null,
            ];
        });

    return Inertia::render('ResponsibleSite/SuiviPermisSite', [
        'permis' => $permis,
    ]);
}


    public function show(PermisExcavation $permisExcavation)
    {
        $readonly = $permisExcavation->status === 'signe';

        $permisExcavation->pdf_signed = $permisExcavation->pdf_signed
            ? asset('storage/'.$permisExcavation->pdf_signed)
            : null;

        return Inertia::render('ResponsibleSite/PermisSign', [
            'permis' => $permisExcavation->load('site'),
            'readonly' => $readonly,
            'showSignatureResponsableSite' => !$readonly, // peut signer si pas encore signé
            'showFermeture' => $readonly,                 // affiche PDF si signé
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
            'status' => 'en_cours', // après signature Responsable Site
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
