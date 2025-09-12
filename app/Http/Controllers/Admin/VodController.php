<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vod;
use App\Models\ContractantVod;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class VodController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q');

        // --- ParkX VODs (done by employees)
        $parkx = Vod::with('user')
            ->when($q, function ($query, $q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('projet', 'like', "%{$q}%")
                        ->orWhere('activite', 'like', "%{$q}%")
                        ->orWhere('observateur', 'like', "%{$q}%")
                        ->orWhereJsonContains('entreprise_observee', $q);
                });
            })
            ->get()
            ->map(function ($vod) {
                return [
                    'id'          => "parkx-{$vod->id}",
                    'type'        => 'parkx',
                    'user'        => [
                        'name'  => $vod->user?->name,
                        'email' => $vod->user?->email,
                    ],
                    'origine'     => 'ParkX',
                    'emitted_at'  => $vod->created_at,
                    'visit_date'  => $vod->date,
                    'projet'      => $vod->projet,
                    'entreprises' => $vod->entreprise_observee,
                    'pdf_url'     => $vod->pdf_url,
                ];
            });

        // --- Contractant VODs
        $contractants = ContractantVod::when($q, function ($query, $q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('projet', 'like', "%{$q}%")
                        ->orWhere('activite', 'like', "%{$q}%")
                        ->orWhere('observateur', 'like', "%{$q}%")
                        ->orWhereJsonContains('entreprise_observee', $q);
                });
            })
            ->get()
            ->map(function ($vod) {
                return [
                    'id'          => "contractant-{$vod->id}",
                    'type'        => 'contractant',
                    'user'        => [
                        'name'  => $vod->observateur,
                        'email' => null,
                    ],
                    'origine'     => 'Contractant',
                    'emitted_at'  => $vod->created_at,
                    'visit_date'  => $vod->date,
                    'projet'      => $vod->projet,
                    'entreprises' => $vod->entreprise_observee,
                    'pdf_url'     => $vod->pdf_url,
                ];
            });

        // --- Merge + sort
        $all = $parkx->merge($contractants)->sortByDesc('emitted_at');

        // --- Paginate manually (since merged collections don’t paginate automatically)
        $page = LengthAwarePaginator::resolveCurrentPage();
        $perPage = 20;
        $items = $all->slice(($page - 1) * $perPage, $perPage)->values();
        $vods = new LengthAwarePaginator($items, $all->count(), $perPage, $page, [
            'path' => request()->url(),
            'query' => request()->query(),
        ]);

        return inertia('Admin/Vods/Index', [
            'vods'    => $vods,
            'filters' => $request->only('q'),
        ]);
    }

    public function statsData(Request $request)
    {
        $year = $request->get('year', now()->year);

        $users = User::all();

        // --- Quotas employés (annuels)
        $byUser = $users->map(function ($u) use ($year) {
            $quota = (int) ($u->vods_quota ?? 0);

            $submitted = Vod::where('user_id', $u->id)
                ->whereYear('created_at', $year)
                ->count();

            $expected = $quota * 12;
            $missed   = max($expected - $submitted, 0);

            return [
                'id'        => $u->id,
                'name'      => $u->name,
                'email'     => $u->email,
                'quota'     => $quota,
                'submitted' => $submitted,
                'missed'    => $missed,
            ];
        });

        // --- Statistiques mensuelles par utilisateur
        $byMonthRaw = Vod::selectRaw('user_id, MONTH(created_at) as m, COUNT(*) as cnt')
            ->whereYear('created_at', $year)
            ->groupBy('user_id', 'm')
            ->get();

        $byMonth = [];
        foreach ($byMonthRaw as $row) {
            $byMonth[$row->user_id][] = [
                'm'   => (int) $row->m,
                'cnt' => (int) $row->cnt,
            ];
        }

        // --- Répartition par entreprise (ParkX + Contractants)
        $byCompany = collect()
            ->merge(
                Vod::selectRaw('JSON_UNQUOTE(JSON_EXTRACT(entreprise_observee, "$[0]")) as company, COUNT(*) as count')
                    ->whereYear('created_at', $year)
                    ->groupBy('company')
                    ->get()
            )
            ->merge(
                ContractantVod::selectRaw('JSON_UNQUOTE(JSON_EXTRACT(entreprise_observee, "$[0]")) as company, COUNT(*) as count')
                    ->whereYear('created_at', $year)
                    ->groupBy('company')
                    ->get()
            )
            ->map(function ($row) {
                return [
                    'company' => $row->company ?: 'Inconnue',
                    'count'   => $row->count,
                ];
            });

        // --- Risques
        $risks = [];
        Vod::whereYear('created_at', $year)->get()->each(function ($vod) use (&$risks) {
            foreach ($vod->comportements ?? [] as $c) {
                if (!empty($c['type'])) {
                    $risks[$c['type']] = ($risks[$c['type']] ?? 0) + 1;
                }
            }
        });
        ContractantVod::whereYear('created_at', $year)->get()->each(function ($vod) use (&$risks) {
            foreach ($vod->comportements ?? [] as $c) {
                if (!empty($c['type'])) {
                    $risks[$c['type']] = ($risks[$c['type']] ?? 0) + 1;
                }
            }
        });

        // --- Conditions
        $conditions = [];
        Vod::whereYear('created_at', $year)->get()->each(function ($vod) use (&$conditions) {
            foreach ($vod->conditions ?? [] as $label => $val) {
                if ($val) {
                    $conditions[$label] = ($conditions[$label] ?? 0) + 1;
                }
            }
        });
        ContractantVod::whereYear('created_at', $year)->get()->each(function ($vod) use (&$conditions) {
            foreach ($vod->conditions ?? [] as $label => $val) {
                if ($val) {
                    $conditions[$label] = ($conditions[$label] ?? 0) + 1;
                }
            }
        });

        return response()->json([
            'byUser'     => $byUser,
            'byMonth'    => $byMonth,
            'byCompany'  => $byCompany,
            'risks'      => $risks,
            'conditions' => $conditions,
        ]);
    }
}
