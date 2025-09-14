<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use Inertia\Inertia;

class PermisAdminController extends Controller
{
    public function index()
    {
        $permis = PermisExcavation::with('site')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id'            => $p->id,
                    'numero_permis' => $p->numero_permis,
                    'type'          => 'Permis d’excavation',
                    'site'          => $p->site?->name,
                    'contractant'   => $p->contractant,
                    // ✅ formatage en français (ex: 14 septembre 2025)
                    'created_at'    => $p->created_at->translatedFormat('d F Y'),
                    'status'        => $p->status,
                    'pdf_original'  => $p->pdf_original 
                                        ? asset('storage/' . $p->pdf_original) 
                                        : null,
                ];
            });

        return Inertia::render('Admin/Permis/SuiviPermisAdmin', [
            'permis' => $permis,
        ]);
    }
}
