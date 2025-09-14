<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\ContractantVod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ContractantVodController extends Controller
{
    // UI shell (tabs)
   public function index(Request $request)
{
    $contractor = auth('contractor')->user()->load('project'); // ✅ load project relation

    return Inertia::render('Contractant/Vods/Index', [
        'contractor' => $contractor,
    ]);
}


    // History data for the React fetcher
    public function historyData(Request $request)
    {
        $contractor = auth('contractor')->user();
        $cid        = $contractor?->id;

        $rows = ContractantVod::query()
            ->where('contractor_id', $cid)
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->limit(500)
            ->get(['id','date','projet','activite','observateur','pdf_path']);

        $vods = $rows->map(fn ($v) => [
            'id'           => $v->id,
            'date'         => optional($v->date)->toDateString(),
            'projet'       => $v->projet,
            'activite'     => $v->activite,
            'observateur'  => $v->observateur,
            'pdf_url'      => $v->pdf_url,       // accessor on model
            'download_url' => $v->pdf_url,
        ]);

        return response()->json(['vods' => $vods]);
    }

    // Store a VOD posted by the contractant form
    public function store(Request $request)
    {
        $contractor = auth('contractor')->user();
        $cid        = $contractor?->id;

        $request->validate([
            'date'     => ['required','date'],
            'activite' => ['required','regex:/^[\pL\s\-\']+$/u'],
        ]);

        return DB::transaction(function () use ($request, $cid, $contractor) {
                $projectName = $contractor?->project?->name ?? ''; // ✅ fetch from DB

            // Create base record

            $vod = ContractantVod::create([
                'contractor_id' => $cid,
                'date'          => $request->date,
                'due_year'      => (int)date('Y', strtotime($request->date)),
                'due_month'     => (int)date('n', strtotime($request->date)),
                'week_of_year'  => (int)date('W', strtotime($request->date)),
        'projet'        => $projectName,   // ✅ auto-fill
                'activite'      => $request->activite,
                'observateur'   => $contractor?->name,
                'has_danger'    => false,
                'danger_count'  => 0,
            ]);

            /* ---------------- SAVE COMPLEX FIELDS ---------------- */

            // personnes observées
            $persons = array_values(array_filter((array) $request->input('personnesObservees', [])));

            // entreprises observées
            $companies = array_values(array_filter((array) $request->input('entrepriseObservee', [])));

            // pratiques
            $pratiquesOut = [];
            foreach ((array) $request->input('pratiques', []) as $i => $row) {
                $text  = trim($row['text'] ?? '');
                $photo = $request->file("pratiques.$i.photo");
                $path  = $photo ? $photo->store("contractant-vods/{$vod->id}/pratiques", 'public') : null;
                if ($text || $path) {
                    $pratiquesOut[] = ['text' => $text, 'photo' => $path];
                }
            }

            // comportements
            $compsOut = [];
            foreach ((array) $request->input('comportements', []) as $i => $row) {
                $type  = trim($row['type'] ?? '');
                $desc  = trim($row['description'] ?? '');
                $photo = $request->file("comportements.$i.photo");
                $path  = $photo ? $photo->store("contractant-vods/{$vod->id}/comportements", 'public') : null;
                if ($type || $desc || $path) {
                    $compsOut[] = [
                        'type'        => $type,
                        'description' => $desc,
                        'photo'       => $path,
                    ];
                }
            }

            // conditions
            $conditionsOut = [];
            foreach ((array) $request->input('conditions', []) as $label => $v) {
                $conditionsOut[$label] = in_array($v, [1, '1', true], true);
            }

            // correctives
            $corrOut = [];
            foreach ((array) $request->input('correctives', []) as $label => $obj) {
                $photo = $request->file("correctives.$label.photo");
                $path  = $photo ? $photo->store("contractant-vods/{$vod->id}/correctives", 'public') : null;
                $corrOut[$label] = [
                    'action'      => trim($obj['action'] ?? ''),
                    'responsable' => trim($obj['responsable'] ?? ''),
                    'statut'      => trim($obj['statut'] ?? ''),
                    'photo'       => $path,
                ];
            }

            // Save JSON fields
            $vod->update([
                'personnes_observees' => $persons,
                'entreprise_observee' => $companies,
                'pratiques'           => $pratiquesOut,
                'comportements'       => $compsOut,
                'conditions'          => $conditionsOut,
                'correctives'         => $corrOut,
            ]);

            /* ---------------- PDF GENERATION ---------------- */
            $pdf  = Pdf::loadView('vods.pdf', ['vod' => $vod]);
            $dir  = "contractant-vods/{$vod->id}";
            $path = "$dir/vod.pdf";

            Storage::disk('public')->put($path, $pdf->output());
            $vod->update(['pdf_path' => $path]);

            return redirect()
                ->back()
                ->with('flash', [
                    'type' => 'success',
                    'text' => 'VOD enregistré avec succès.',
                ]);
        });
    }

    public function pdf(ContractantVod $vod)
    {
        if (!$vod->pdf_path) {
            $pdf = Pdf::loadView('vods.pdf', ['vod' => $vod]);
            return $pdf->stream("vod-{$vod->id}.pdf");
        }
        return response()->file(storage_path('app/public/' . $vod->pdf_path));
    }

    public function download(ContractantVod $vod)
    {
        if (!$vod->pdf_path) {
            $pdf = Pdf::loadView('vods.pdf', ['vod' => $vod]);
            return $pdf->download("vod-{$vod->id}.pdf");
        }
        return response()->download(storage_path('app/public/' . $vod->pdf_path));
    }
}
