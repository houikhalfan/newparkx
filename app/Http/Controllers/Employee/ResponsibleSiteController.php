<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use App\Models\Site;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResponsibleSiteController extends Controller
{
    public function index()
{
    $user = Auth::user();

    // get all site IDs where this user is the responsible
    $siteIds = Site::where('responsible_user_id', $user->id)->pluck('id');

    // fetch all permits linked to those sites - INCLUDE pdf_signed!
    $permis = PermisExcavation::with('site')
        ->whereIn('site_id', $siteIds)
        ->orderByDesc('created_at')
        ->get([
            'id',
            'site_id',
            'numero_permis',
            'numero_permis_general',
            'status',
            'created_at',
            'pdf_signed', // ← ADD THIS LINE
        ])
        ->map(function ($p) {
            return [
                'id' => $p->id,
                'numero_permis' => $p->numero_permis,
                'status' => strtolower(trim($p->status)),
                // Format the date
                'date' => $p->created_at->translatedFormat('d/m/Y H:i'),
                // Include the pdf_signed field with proper URL
                'pdf_signed' => $p->pdf_signed 
                    ? asset('storage/' . ltrim($p->pdf_signed, '/'))
                    : null,
            ];
        });

    return Inertia::render('ResponsibleSite/SuiviPermisSite', [
        'permis' => $permis,
    ]);
}
}
