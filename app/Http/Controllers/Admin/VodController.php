<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vod;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class VodController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));

        $query = Vod::with('user')->latest();

        if ($q !== '') {
            $query->where(function ($x) use ($q) {
                $x->where('projet', 'like', "%{$q}%")
                  ->orWhere('activite', 'like', "%{$q}%")
                  ->orWhere('entreprise_observee', 'like', "%{$q}%"); // JSON stored as text -> LIKE works
            })->orWhereHas('user', function ($u) use ($q) {
                $u->where('name', 'like', "%{$q}%")
                  ->orWhere('email', 'like', "%{$q}%");
            });
        }

        $vods = $query
            ->paginate(15)
            ->withQueryString()
            ->through(function (Vod $vod) {
                return [
                    'id'           => $vod->id,
                    'user'         => [
                        'name'  => $vod->user->name  ?? '—',
                        'email' => $vod->user->email ?? '—',
                    ],
                    // send ISO strings so the frontend formats consistently
                    'emitted_at'   => optional($vod->created_at)->toIso8601String(),
                    'visit_date'   => optional($vod->date)->toDateString(),
                    'projet'       => $vod->projet,
                    'entreprises'  => $vod->entreprise_observee ?? [],

                    // actions
                    'pdf_url'      => route('admin.vods.pdf', $vod),                     // stream on the fly
                    'download_url' => $vod->pdf_path ? route('admin.vods.download', $vod) : null,
                ];
            });

        return inertia('Admin/Vods/Index', [
            'vods'    => $vods,                     // 👈 what your React expects
            'filters' => $request->only('q'),
        ]);
    }

    public function pdf(Vod $vod)
    {
        $vod->load('user');
        $pdf = Pdf::loadView('vods.pdf', ['vod' => $vod])->setPaper('a4');
        return $pdf->stream("vod-{$vod->id}.pdf");
    }

    public function generate(Vod $vod)
    {
        $vod->load('user');
        $pdf = Pdf::loadView('vods.pdf', ['vod' => $vod])->setPaper('a4');

        $file = "vods/vod-{$vod->id}.pdf";
        Storage::disk('public')->put($file, $pdf->output());

        $vod->update(['pdf_path' => $file]);

        return back()->with('success', 'PDF généré avec succès.');
    }

    public function download(Vod $vod)
    {
        if (!$vod->pdf_path || !Storage::disk('public')->exists($vod->pdf_path)) {
            return back()->with('error', 'PDF introuvable. Cliquez sur “Générer”.');
        }
        return Storage::disk('public')->download($vod->pdf_path, "vod-{$vod->id}.pdf");
    }
}
