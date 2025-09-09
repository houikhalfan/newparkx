<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaterialRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialRequestController extends Controller
{
    public function index(Request $request)
    {
        $items = MaterialRequest::with(['contractor:id,name,email', 'site:id,name'])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->through(function ($mr) {
                return [
                    'id'   => $mr->id,
                    'status'     => $mr->status,
                    'created_at' => $mr->created_at,

                    // relations allégées
                    'site'       => ['name' => $mr->site->name ?? null],
                    'contractor' => [
                        'name'  => $mr->contractor->name ?? null,
                        'email' => $mr->contractor->email ?? null,
                    ],

                    // 🔽🔽 les 4 fichiers demandés
                    'controle_reglementaire_path'   => $mr->controle_reglementaire_path,
                    'assurance_path'                => $mr->assurance_path,
                    'habilitation_conducteur_path'  => $mr->habilitation_conducteur_path,
                    'rapports_conformite_path'      => $mr->rapports_conformite_path,
                ];
            });

        return Inertia::render('Admin/Material/Index', [
            'items' => $items,
        ]);
    }
}
