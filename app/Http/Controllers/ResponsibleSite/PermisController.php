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

        // ✅ fetch only permits for sites managed by this user
        $permis = PermisExcavation::whereHas('site', function ($q) use ($user) {
            $q->where('responsible_user_id', $user->id);
        })
        ->orderByDesc('created_at')
        ->get();

        return Inertia::render('ResponsibleSite/SuiviPermisSite', [
            'permis' => $permis,
        ]);
    }
public function show(PermisExcavation $permisExcavation)
{
    $readonly = $permisExcavation->status === 'signe';
    $showFermeture = $permisExcavation->status === 'signe';

    return Inertia::render('ResponsibleSite/PermisSign', [
        'permis' => $permisExcavation->load('site'),
        'readonly' => $readonly,
        'showSignatureResponsableSite' => !$readonly, // autoriser signature seulement si pas signé
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

        // ✅ After site responsible signs → move status to "en_cours"
        $data['status'] = 'en_cours';

        $permis->update($data);

        return redirect()
            ->route('responsibleSite.permis.index')
            ->with('success', 'Signature enregistrée avec succès.');
    }
}
