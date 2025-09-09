<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use App\Models\User;
use App\Models\Contractor;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // ✅ Generate different password reset URLs for ParkX & Contractor accounts
        ResetPassword::createUrlUsing(function ($notifiable, string $token) {
            $email = $notifiable->getEmailForPasswordReset();

            // Contractor → send to contractor reset page
            if ($notifiable instanceof Contractor) {
                return route('contractant.password.reset', [
                    'token' => $token,
                    'email' => $email,
                ]);
            }

            // ParkX user → default
            if ($notifiable instanceof User) {
                return route('password.reset', [
                    'token' => $token,
                    'email' => $email,
                ]);
            }

            // Fallback
            return route('password.reset', [
                'token' => $token,
                'email' => $email,
            ]);
        });
    }
}
