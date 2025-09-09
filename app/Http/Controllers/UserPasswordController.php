<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Admin; // ⬅️ add

class UserPasswordController extends Controller
{
    public function showLinkRequestForm()
    {
        return Inertia::render('Auth/Forgot');
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => ['required','email']]);

        $status = Password::broker('users')->sendResetLink(['email' => $request->email]);

        // ⬇ Redirect back to main login with banner (as you do on the frontend)
        if ($status === Password::RESET_LINK_SENT) {
            return redirect()->to(route('login') . '?reset_link=sent&type=parkx');
        }

        return back()->withErrors(['email' => __($status)]);
    }

    public function showResetForm(string $token)
    {
        return Inertia::render('Auth/Reset', [
            'token' => $token,
            'email' => request('email'),
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token'    => ['required'],
            'email'    => ['required','email'],
            'password' => ['required','confirmed','min:8'],
        ]);

        // ⬇️ pre-hash once so we can reuse the *same* hash for Admin
        $hashed = Hash::make($request->password);

        $status = Password::broker('users')->reset(
            $request->only('email','password','password_confirmation','token'),
            function ($user) use ($request, $hashed) {
                $user->forceFill([
                    'password'       => $hashed,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            // ⬇ Keep Admin password in sync for same email (if an Admin exists)
            Admin::where('email', $request->email)->update(['password' => $hashed]);

            return redirect()->to(route('login') . '?reset_done=parkx');
        }

        return back()->withErrors(['email' => [__($status)]]);
    }
}
