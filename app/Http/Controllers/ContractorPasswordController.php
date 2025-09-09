<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\Rules\Password as PasswordRule;

class ContractorPasswordController extends Controller
{
    public function showLinkRequestForm()
    {
        // Forgot page (contractor)
        return Inertia::render('Contractant/Forgot', ['status' => session('status')]);
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => ['required','email']]);

        $status = Password::broker('contractors')->sendResetLink(
            ['email' => $request->email]
        );

        // Always redirect to login with banner (like ParkX)
        if ($status === Password::RESET_LINK_SENT) {
            return redirect()->to(route('login').'?tab=contractor&reset_link=sent');
        }

        // If something failed, return with the translated error
        return back()->withErrors(['email' => __($status)]);
    }

    public function showResetForm(string $token)
    {
        // Reset page (contractor)
        return Inertia::render('Contractant/Reset', [
            'token'  => $token,
            'email'  => request('email'),
            'status' => session('status'),
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token'    => ['required'],
            'email'    => ['required','email'],
            'password' => ['required','confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::broker('contractors')->reset(
            $request->only('email','password','password_confirmation','token'),
            function ($contractor) use ($request) {
                // Hash password and save (no SweetAlert; just redirect after)
                $contractor->forceFill([
                    'password' => Hash::make($request->password),
                ])->save();

                event(new PasswordReset($contractor));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            // Redirect to login with success banner, and select contractor tab
            return redirect()->to(route('login').'?tab=contractor&reset_done=contractor');
        }

        return back()->withErrors(['email' => [__($status)]]);
    }
}
