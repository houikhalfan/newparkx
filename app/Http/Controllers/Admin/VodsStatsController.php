<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vod;
use Illuminate\Http\Request;

class VodsStatsController extends Controller
{
    public function statsData(Request $request)
    {
        // --- Quotas par utilisateur
        $byUser = User::select('id', 'name', 'email', 'vods_quota')
            ->get()
            ->map(function ($u) {
                $submitted = Vod::where('user_id', $u->id)
                    ->whereYear('date', now()->year)
                    ->whereMonth('date', now()->month)
                    ->count();

                return [
                    'name'      => $u->name,
                    'email'     => $u->email,
                    'quota'     => $u->vods_quota ?? 0,
                    'submitted' => $submitted,
                    'remaining' => max(($u->vods_quota ?? 0) - $submitted, 0),
                ];
            });

        // --- Répartition par entreprise observée
        $byCompany = Vod::select('entreprise_observee')
            ->get()
            ->flatMap(fn ($v) => $v->entreprise_observee ?? [])
            ->countBy()
            ->map(function ($count, $company) {
                return ['company' => $company, 'count' => $count];
            })
            ->values();

        // --- Risques les plus observés (basé sur comportements.type)
        $risks = Vod::all()
            ->flatMap(fn ($v) => collect($v->comportements)->pluck('type'))
            ->filter()
            ->countBy();

        // --- Conditions dangereuses les plus observées
        $conditions = Vod::all()
            ->flatMap(fn ($v) => array_keys(array_filter($v->conditions ?? [])))
            ->countBy();

        return response()->json([
            'byUser'    => $byUser,
            'byCompany' => $byCompany,
            'risks'     => $risks,
            'conditions'=> $conditions,
        ]);
    }
}
