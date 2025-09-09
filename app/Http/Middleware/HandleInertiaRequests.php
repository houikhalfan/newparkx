<?php

namespace App\Http\Middleware;

use App\Models\Vod;
use App\Models\SignatureRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Share data with every Inertia response.
     */
    public function share(Request $request): array
    {
        // Current ParkX user (web guard) and contractor (contractor guard)
        $webUser        = Auth::guard('web')->user();
        $contractorUser = Auth::guard('contractor')->user();

        // ✅ Case-insensitive check: does the current ParkX user's email exist in admins table?
        $isAdmin = false;
        if ($webUser && $webUser->email) {
            $isAdmin = DB::table('admins')
                ->whereRaw('LOWER(email) = ?', [mb_strtolower($webUser->email)])
                ->exists();
        }

        return array_merge(parent::share($request), [
            // ✅ NEW: make CSRF token globally available (AdminLayout expects it)
            'csrf_token' => csrf_token(),

            // ✅ NEW: share the currently authenticated admin (admin guard)
            // Will be null outside /admin pages or when not logged in as admin.
            'admin' => fn () => Auth::guard('admin')->user(),

            // Expose both guards + isAdmin flag
            'auth' => [
                'user'       => $webUser,         // ParkX user
                'contractor' => $contractorUser,  // Contractor user
                'isAdmin'    => $isAdmin,         // for "Go to Admin" button on user dashboard
            ],

            // Common flash messages
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
                'status'  => fn () => $request->session()->get('status'),
            ],

            // Quota only for ParkX users
            'quota' => function () use ($webUser) {
                if (!$webUser) return null;

                $quota = (int) ($webUser->vods_quota ?? 0);
                $start = now()->startOfMonth()->startOfDay();
                $end   = now()->endOfMonth()->endOfDay();

                $submitted = Vod::where('user_id', $webUser->id)
                    ->whereBetween('created_at', [$start, $end])
                    ->count();

                $daysLeft = max((int) now()->startOfDay()->diffInDays($end, false), 0);

                return [
                    'quota'     => $quota,
                    'submitted' => $submitted,
                    'remaining' => $quota === 0 ? 0 : max($quota - $submitted, 0),
                    'daysLeft'  => $daysLeft,
                    'canSubmit' => $quota === 0 ? true : ($submitted < $quota),
                    'period'    => [
                        'start' => $start->toDateString(),
                        'end'   => $end->toDateString(),
                    ],
                ];
            },

            // Counts used by the header/notifications in Dashboard
            'counts' => function () use ($webUser) {
                if (!$webUser) return [];

                $assigned = SignatureRequest::where('assigned_user_id', $webUser->id)
                    ->whereIn('status', ['assigned', 'pending'])
                    ->count();

                $quota = (int) ($webUser->vods_quota ?? 0);
                $start = now()->startOfMonth()->startOfDay();
                $end   = now()->endOfMonth()->endOfDay();

                $submitted = Vod::where('user_id', $webUser->id)
                    ->whereBetween('created_at', [$start, $end])
                    ->count();

                $remaining = $quota === 0 ? 0 : max($quota - $submitted, 0);

                return [
                    'assigned_papers' => $assigned,
                    'vods_remaining'  => $remaining,
                    'notifications'   => 0,
                ];
            },
        ]);
    }
}
