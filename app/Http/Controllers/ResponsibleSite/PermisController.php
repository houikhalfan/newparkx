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

        $permis = PermisExcavation::whereHas('site', function ($q) use ($user) {
            $q->where('responsible_user_id', $user->id);
        })->orderByDesc('created_at')->get();

        return Inertia::render('ResponsibleSite/SuiviPermisSite', [
            'permis' => $permis
        ]);
    }

public function show(PermisExcavation $permisExcavation)
{
    return Inertia::render('ResponsibleSite/PermisSign', [
        'permis' => $permisExcavation->load('site'),
        'sites'  => \App\Models\Site::all(['id','name']), // 👈 add this
    ]);
}

   public function sign(Request $request, PermisExcavation $permis)
{
    $data = $request->validate([
        'cm_parkx_nom' => 'required|string|max:255',
        'cm_parkx_date' => 'required|date',
        'cm_parkx_file' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    // upload si fichier
    if ($request->hasFile('cm_parkx_file')) {
        $data['cm_parkx_file'] = $request->file('cm_parkx_file')->store('signatures', 'public');
    }

    $permis->update($data);

    return redirect()->route('responsibleSite.permis.index')
        ->with('success', 'Le permis a été signé avec succès.');
}


}
