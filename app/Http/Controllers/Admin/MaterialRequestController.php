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
        $q = trim($request->query('q', ''));
        $s = $request->query('s', '');

        $items = MaterialRequest::with(['contractor:id,name,email', 'site:id,name'])
            ->when(strlen($q) > 0, function ($qb) use ($q) {
                $like = '%' . $q . '%';
                $qb->where(function ($inner) use ($like) {
                    $inner
                        ->orWhereHas('site', fn($sq) => $sq->where('name', 'like', $like))
                        ->orWhereHas('contractor', fn($cq) => $cq
                            ->where('name', 'like', $like)
                            ->orWhere('email', 'like', $like))
                        ->orWhere('matricule', 'like', $like);
                });
            })
            ->when(in_array($s, ['pending', 'accepted', 'rejected']), fn($qb) => $qb->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString()
            ->through(function ($mr) {
                return [
                    'id'   => $mr->id,
                    'matricule'  => $mr->matricule,
                    'status'     => $mr->status,
                    'created_at' => $mr->created_at,

                    // relations
                    'site'       => ['name' => $mr->site->name ?? null],
                    'contractor' => [
                        'name'  => $mr->contractor->name ?? null,
                        'email' => $mr->contractor->email ?? null,
                    ],

                    // fichiers
                    'controle_reglementaire_path'   => $mr->controle_reglementaire_path,
                    'assurance_path'                => $mr->assurance_path,
                    'carte_grise_path'              => $mr->carte_grise_path,   // ✅ added
                    'habilitation_conducteur_path'  => $mr->habilitation_conducteur_path,
                    'rapports_conformite_path'      => $mr->rapports_conformite_path,
                ];
            });

        return Inertia::render('Admin/Material/Index', [
            'items' => $items,
            'q' => $q,
            's' => $s,
        ]);
    }
}
