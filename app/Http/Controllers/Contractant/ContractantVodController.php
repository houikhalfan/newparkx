<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\ContractantVod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContractantVodController extends Controller
{
    // UI shell (tabs) — renders the React page you created
    public function index(Request $request)
    {
        $contractor = auth('contractor')->user();
        return Inertia::render('Contractant/Vods/Index', [
            'contractor' => $contractor
        ]);
    }

    // History data for the React fetcher
    public function historyData(Request $request)
    {
        $user = $request->user();                   // contractor guard or default
        $cid  = $user?->id;

        $rows = ContractantVod::query()
            ->where('contractor_id', $cid)
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->limit(500)                            // tune if you want
            ->get(['id','date','projet','activite','observateur','pdf_path']);

        $vods = $rows->map(fn ($v) => [
            'id'            => $v->id,
            'date'          => optional($v->date)->toDateString(),
            'projet'        => $v->projet,
            'activite'      => $v->activite,
            'observateur'   => $v->observateur,
            'pdf_url'       => $v->pdf_url, // from accessor
            'download_url'  => $v->pdf_url, // same for now
        ]);

        return response()->json(['vods' => $vods]);
    }

    // Store a VOD posted by the contractant form (no quotas)
    public function store(Request $request)
    {
        $user = $request->user();
        $cid  = $user?->id;

        // light validation that matches the UI
        $request->validate([
            'date'                      => ['required','date'],
            'projet'                    => ['required','regex:/^[\pL\s\-\']+$/u'],
            'activite'                  => ['required','regex:/^[\pL\s\-\']+$/u'],

            'personnesObservees'        => ['nullable','array'],
            'personnesObservees.*'      => ['nullable','regex:/^[\pL\s\-\']+$/u'],

            'entrepriseObservee'        => ['nullable','array'],
            'entrepriseObservee.*'      => ['nullable','regex:/^[\pL\s\-\']+$/u'],

            'pratiques'                 => ['nullable','array'],
            'pratiques.*.text'          => ['nullable','string','max:2000'],
            'pratiques.*.photo'         => ['nullable','file','image','max:10240'],

            'comportements'             => ['nullable','array'],
            'comportements.*.type'      => ['nullable','string','max:255'],
            'comportements.*.description'=> ['nullable','string','max:2000'],
            'comportements.*.photo'     => ['nullable','file','image','max:10240'],

            'conditions'                => ['nullable','array'], // { label: "1"/"0" }
            'correctives'               => ['nullable','array'], // { label: { action, responsable, statut, photo } }
            'correctives.*.photo'       => ['nullable','file','image','max:10240'],
        ]);

        return DB::transaction(function () use ($request, $cid) {
            // Create a row first to obtain an ID and a directory
            $vod = ContractantVod::create([
                'contractor_id'        => $cid,
                'date'                 => $request->date,
                'due_year'             => (int)date('Y', strtotime($request->date)),
                'due_month'            => (int)date('n', strtotime($request->date)),
                'week_of_year'         => (int)date('W', strtotime($request->date)),

                'projet'               => $request->projet,
                'activite'             => $request->activite,
                'observateur'          => $request->input('observateur'), // filled by UI (readonly)

                // defaults; will be updated below after files
                'has_danger'           => false,
                'danger_count'         => 0,
            ]);

            $dir = "contractant-vods/{$vod->id}";

            // ---------- pratiques ----------
            $pratiquesIn  = (array) $request->input('pratiques', []);
            $pratiquesOut = [];
            foreach ($pratiquesIn as $i => $row) {
                $text  = trim($row['text'] ?? '');
                $photo = $request->file("pratiques.$i.photo");
                $path  = $photo ? $photo->store("$dir/pratiques", 'public') : null;
                if ($text || $path) {
                    $pratiquesOut[] = ['text' => $text, 'photo_path' => $path];
                }
            }

            // ---------- comportements ----------
            $compsIn  = (array) $request->input('comportements', []);
            $compsOut = [];
            foreach ($compsIn as $i => $row) {
                $type  = trim($row['type'] ?? '');
                $desc  = trim($row['description'] ?? '');
                $photo = $request->file("comportements.$i.photo");
                $path  = $photo ? $photo->store("$dir/comportements", 'public') : null;
                if ($type || $desc || $path) {
                    $compsOut[] = [
                        'type'        => $type,
                        'description' => $desc,
                        'photo_path'  => $path,
                    ];
                }
            }

            // ---------- conditions ----------
            // UI sends "1"/"0" strings; keep only truthy flags
            $conditionsIn  = (array) $request->input('conditions', []);
            $conditionsOut = [];
            foreach ($conditionsIn as $label => $v) {
                $conditionsOut[$label] = in_array($v, [1, '1', true], true);
            }

            // ---------- correctives ----------
            $corrIn  = (array) $request->input('correctives', []);
            $corrOut = [];
            foreach ($corrIn as $label => $obj) {
                $photo = $request->file("correctives.$label.photo");
                $path  = $photo ? $photo->store("$dir/correctives", 'public') : null;
                $corrOut[$label] = [
                    'action'       => trim($obj['action'] ?? ''),
                    'responsable'  => trim($obj['responsable'] ?? ''),
                    'statut'       => trim($obj['statut'] ?? ''),
                    'photo_path'   => $path,
                ];
            }

            // People / companies arrays from form (names in your React code)
            $persons   = array_values(array_filter((array) $request->input('personnesObservees', [])));
            $companies = array_values(array_filter((array) $request->input('entrepriseObservee', [])));

            // quick danger flags/counters
            $dangerFromConditions   = collect($conditionsOut)->filter()->count();
            $dangerFromComportement = collect($compsOut)->filter(function ($c) {
                return ($c['type'] ?? '') !== '' || ($c['description'] ?? '') !== '';
            })->count();

            $dangerCount = $dangerFromConditions + $dangerFromComportement;
            $hasDanger   = $dangerCount > 0;

            // Optional: a small breakdown for stats
            $riskBreakdown = [
                'conditions_count'    => $dangerFromConditions,
                'comportements_count' => $dangerFromComportement,
            ];

            // Save JSON + counters
            $vod->update([
                'personnes_observees' => $persons,
                'entreprise_observee' => $companies,
                'pratiques'           => $pratiquesOut,
                'comportements'       => $compsOut,
                'conditions'          => $conditionsOut,
                'correctives'         => $corrOut,
                'has_danger'          => $hasDanger,
                'danger_count'        => $dangerCount,
                'risk_breakdown'      => $riskBreakdown,
            ]);

            // If you later produce a PDF, set $vod->pdf_path and/or $vod->thumb_path here.

            return redirect()
                ->back()
                ->with('flash', ['type' => 'success', 'text' => 'VOD enregistré avec succès.']);
        });
    }

    // (Optional) Serve PDF if you generate it later
    public function pdf(ContractantVod $vod)
    {
        abort_if(!$vod->pdf_path, 404);
        return response()->file(storage_path('app/public/' . $vod->pdf_path));
    }

    public function download(ContractantVod $vod)
    {
        abort_if(!$vod->pdf_path, 404);
        return response()->download(storage_path('app/public/' . $vod->pdf_path));
    }
}
