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
        $type = $request->input('type', 'parkx'); // 'parkx' ou 'contractor'

        // Validation de base
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        /* ---------------------------------------------------------
         | Connexion entrepreneur
         * --------------------------------------------------------- */
        if ($type === 'contractor') {
            $contractor = Contractor::where('email', $request->email)->first();

            if (!$contractor || !Hash::check($request->password, $contractor->password)) {
                throw ValidationException::withMessages([
                    'email' => 'Identifiants entrepreneur invalides.',
                ]);
            }

            if (!$contractor->is_approved) {
                throw ValidationException::withMessages([
                    'email' => 'Votre compte est en attente de validation par l\'administrateur.',
                ]);
            }

            // ✅ connecter l'utilisateur avec le guard entrepreneur
            Auth::guard('contractor')->login($contractor);
            $request->session()->regenerate();

            return redirect()->route('contractant.home'); // ex: /contractant
        }

        /* ---------------------------------------------------------
         | Connexion ParkX (standard)
         * --------------------------------------------------------- */
        if (!Auth::guard('web')->attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => 'Identifiants ParkX invalides.',
            ]);
        }

        $request->session()->regenerate();

        // Flash quota (basé sur les enregistrements créés ce mois-ci)
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
                session()->flash('success', "Quota mensuel atteint. Le formulaire VODS est bloqué jusqu'au {$next}.");
            }
        }

        // ✅ enregistrer la dernière connexion
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

        // Envoyer une notification à tous les administrateurs (avec gestion d'erreurs)
        try {
            $admins = \App\Models\Admin::all();
            \Log::info('Envoi des notifications d\'inscription d\'entrepreneur à ' . $admins->count() . ' administrateurs');
            
            foreach ($admins as $admin) {
                try {
                    \Log::info('Envoi de la notification d\'inscription d\'entrepreneur à l\'administrateur : ' . $admin->email);
                    $admin->notify(new \App\Notifications\ContractorRegistrationNotification($contractor));
                    \Log::info('Notification envoyée avec succès à l\'administrateur : ' . $admin->email);
                } catch (\Exception $e) {
                    \Log::error('Échec de l\'envoi de la notification à l\'administrateur ' . $admin->email . ' : ' . $e->getMessage());
                    // Continuer avec les autres administrateurs même si un échoue
                }
            }
        } catch (\Exception $e) {
            \Log::error('Échec de l\'envoi des notifications d\'inscription d\'entrepreneur : ' . $e->getMessage());
            // Ne pas faire échouer l'inscription si les notifications échouent
        }

        return back()->with('message', 'Inscription soumise. Une validation par l\'administrateur est requise.');
    }
}