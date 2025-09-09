<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password as PasswordRule;
use App\Models\User; // ⬅️ add

class AdminPasswordController extends Controller
{
    public function showLinkRequestForm()
    {
        return Inertia::render('Admin/Forgot', ['status' => session('status')]);
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => ['required','email']]);

        $status = Password::broker('admins')->sendResetLink(['email' => $request->email]);

        Log::info('ADMIN reset: send link', ['email' => $request->email, 'status' => $status]);

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    }

    public function showResetForm(string $token)
    {
        return Inertia::render('Admin/Reset', [
            'token'  => $token,
            'email'  => request('email'),
            'status' => session('status'),
        ]);
    }

    public function reset(Request $request)
    {
        Log::info('ADMIN reset: incoming', $request->only('email','token'));

        $request->validate([
            'token'    => ['required'],
            'email'    => ['required','email'],
            'password' => ['required','confirmed', PasswordRule::min(8)],
        ]);

        // ⬇️ pre-hash once so we can reuse the *same* hash for User
        $hashed = Hash::make($request->password);

        $status = Password::broker('admins')->reset(
            $request->only('email','password','password_confirmation','token'),
            function ($admin) use ($request, $hashed) {
                Log::info('ADMIN reset: closure running for', ['admin_id' => $admin->id, 'email' => $admin->email]);

                $admin->forceFill([
                    'password'       => $hashed,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($admin));
            }
        );

        Log::info('ADMIN reset: status result', ['status' => $status]);

        if ($status === Password::PASSWORD_RESET) {
            // ⬇ Keep ParkX user password in sync for same email (if a User exists)
            User::where('email', $request->email)->update(['password' => $hashed]);

            return redirect()->to('/admin/login')->with('status', __($status));
        }

        return back()->withErrors(['email' => [__($status)]]);
    }
}
