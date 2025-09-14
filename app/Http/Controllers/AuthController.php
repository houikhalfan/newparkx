<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Contractor;
use App\Models\Project;
use App\Models\Vod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function welcome()
    {
        $projects = Project::with('site')->get();
        return Inertia::render('Welcome', [
            'projects' => $projects
        ]);
    }
    public function login(Request $request)
    {
        $type = $request->input('type', 'parkx'); // 'parkx' or 'contractor'

        // Basic validation
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        /* ---------------------------------------------------------
         | Contractor login
         * --------------------------------------------------------- */
        if ($type === 'contractor') {
            $contractor = Contractor::where('email', $request->email)->first();

            if (!$contractor || !Hash::check($request->password, $contractor->password)) {
                throw ValidationException::withMessages([
                    'email' => 'Invalid contractor credentials.',
                ]);
            }

            if (!$contractor->is_approved) {
                throw ValidationException::withMessages([
                    'email' => 'Your account is pending admin approval.',
                ]);
            }

            // ✅ log the user into the contractor guard
            Auth::guard('contractor')->login($contractor);
            $request->session()->regenerate();

            return redirect()->route('contractant.home'); // e.g. /contractant
        }

        /* ---------------------------------------------------------
         | ParkX (standard) login
         * --------------------------------------------------------- */
        if (!Auth::guard('web')->attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => 'Invalid ParkX credentials.',
            ]);
        }

        $request->session()->regenerate();

        // Quota flash (based on records created this month)
        $user  = Auth::user();
        $quota = (int) ($user->vods_quota ?? 0);

        $start = now()->startOfMonth()->startOfDay();
        $end   = now()->endOfMonth()->endOfDay();

        $submitted = Vod::where('user_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $remaining = max($quota - $submitted, 0);
        $daysLeft  = max((int) now()->startOfDay()->diffInDays($end, false), 0);

        if ($quota > 0) {
            if ($remaining > 0) {
                session()->flash('success', "Il vous reste {$remaining} VOD(s) à soumettre ce mois-ci. Jours restants : {$daysLeft}.");
            } else {
                $next = now()->startOfMonth()->addMonth()->format('d/m/Y');
                session()->flash('success', "Quota mensuel atteint. Le formulaire VODS est bloqué jusqu’au {$next}.");
            }
        }

        // ✅ stamp last login
        $user->forceFill(['last_login_at' => now()])->save();

        return redirect()->intended('/dashboard');
    }

    public function contractorRegister(Request $request)
    {
        $validated = $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255|unique:contractors,email',
            'password'              => 'required|string|confirmed|min:8',
            'phone'                 => 'nullable|string|max:20',
            'company_name'          => 'nullable|string|max:255',
            'role'                  => 'nullable|string|max:100',
            'project_id'            => 'nullable|exists:projects,id',
        ]);

        $contractor = Contractor::create([
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'password'     => bcrypt($validated['password']),
            'phone'        => $validated['phone'] ?? null,
            'company_name' => $validated['company_name'] ?? null,
            'role'         => $validated['role'] ?? null,
            'project_id'   => $validated['project_id'] ?? null,
            'is_approved'  => false,
        ]);

        // Send notification to all admins
        $admins = \App\Models\Admin::all();
        \Log::info('Sending contractor registration notifications to ' . $admins->count() . ' admins');
        foreach ($admins as $admin) {
            \Log::info('Sending contractor registration notification to admin: ' . $admin->email);
            $admin->notify(new \App\Notifications\ContractorRegistrationNotification($contractor));
        }

        return back()->with('message', 'Registration submitted. Admin approval is required.');
    }
}
