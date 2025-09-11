<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\MaterialRequest;
use App\Models\Site;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialRequestController extends Controller
{
    /**
     * Show list of material requests for the contractor.
     */
    public function index(Request $request)
    {
        $c = auth('contractor')->user();

        // ✅ Include matricule to avoid missing data issues
        $cols = [
            'id',
            'site_id',
            'contractor_id',
            'matricule',
            'assigned_user_id',
            'status',
            'created_at',
            'controle_reglementaire_path',
            'assurance_path',
            'habilitation_conducteur_path',
            'rapports_conformite_path',
            'qrcode_path',
            'qrcode_text',
            'decision_comment',
        ];

        // Fetch pending requests
        $pending = MaterialRequest::with(['site:id,name'])
            ->where('contractor_id', $c->id)
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get($cols);

        // Fetch accepted requests
        $accepted = MaterialRequest::with(['site:id,name'])
            ->where('contractor_id', $c->id)
            ->where('status', 'accepted')
            ->orderByDesc('created_at')
            ->get($cols);

        // Fetch rejected requests
        $rejected = MaterialRequest::with(['site:id,name'])
            ->where('contractor_id', $c->id)
            ->where('status', 'rejected')
            ->orderByDesc('created_at')
            ->get($cols);

        // Fetch list of available sites
        $sites = Site::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Contractant/Material/Index', [
            'pending'   => $pending,
            'accepted'  => $accepted,
            'rejected'  => $rejected,
            'counts'    => [
                'pending'  => $pending->count(),
                'accepted' => $accepted->count(),
                'rejected' => $rejected->count(),
            ],
            'sites'      => $sites,
            'csrf_token' => csrf_token(),
            'swal'       => session('swal'),
        ]);
    }

    /**
     * Store a new material request.
     */
    public function store(Request $request)
    {
        $contractor = auth('contractor')->user();

        // ✅ Validate matricule field
        $data = $request->validate([
            'site_id'                 => ['required', 'exists:sites,id'],
            'matricule'               => ['required', 'string', 'max:50'],
            'controle_reglementaire'  => ['required', 'file', 'mimes:pdf,doc,docx,png,jpg,jpeg', 'max:10240'],
            'assurance'               => ['required', 'file', 'mimes:pdf,doc,docx,png,jpg,jpeg', 'max:10240'],
            'habilitation_conducteur' => ['required', 'file', 'mimes:pdf,doc,docx,png,jpg,jpeg', 'max:10240'],
            'rapports_conformite'     => ['required', 'file', 'mimes:pdf,doc,docx,png,jpg,jpeg', 'max:10240'],
        ]);

        // ✅ Store uploaded files in organized folders
        $cr  = $request->file('controle_reglementaire')->store('materials/controle', 'public');
        $as  = $request->file('assurance')->store('materials/assurance', 'public');
        $hab = $request->file('habilitation_conducteur')->store('materials/habilitation', 'public');
        $rep = $request->file('rapports_conformite')->store('materials/rapports', 'public');

        // ✅ Automatically assign site responsible if available
        $assignedUserId = optional(Site::find($data['site_id']))->responsible_user_id;

        // ✅ Create new material request
        MaterialRequest::create([
            'contractor_id'               => $contractor->id,
            'site_id'                     => $data['site_id'],
            'matricule'                   => $data['matricule'],
            'assigned_user_id'            => $assignedUserId,
            'controle_reglementaire_path' => $cr,
            'assurance_path'              => $as,
            'habilitation_conducteur_path'=> $hab,
            'rapports_conformite_path'    => $rep,
            'status'                      => 'pending',
        ]);

        return back()->with('swal', [
            'type' => 'success',
            'text' => "Demande envoyée à l'administration.",
        ]);
    }
}
