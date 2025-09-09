<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Middleware\AdminAuth;
use App\Http\Controllers\Admin\MaterialRequestController as AdminMaterialCtrl;

// Auth + core
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VodsController;
use App\Http\Controllers\ContractantController;
use App\Http\Controllers\ContractorAuthController;
use App\Http\Controllers\Admin\AdminPasswordController;

use App\Http\Controllers\Admin\VodController as AdminVodController;

// Signatures
use App\Http\Controllers\Contractant\SignatureRequestController as ContractorSignCtrl;
use App\Http\Controllers\Admin\SignatureRequestController as AdminSignCtrl;
use App\Http\Controllers\Employee\SignatureInboxController;

// Sites
use App\Http\Controllers\Admin\SiteController as AdminSiteController;

// Matériel
use App\Http\Controllers\Employee\MaterialRequestInboxController as EmpMaterialCtrl;
use App\Http\Controllers\Contractant\MaterialRequestController as ContractorMaterialCtrl;

/* 🔽 ADDED: controllers for ParkX & Contractor password reset */
use App\Http\Controllers\UserPasswordController;
use App\Http\Controllers\ContractorPasswordController;
use App\Http\Controllers\Contractant\ContractantVodController;

/*
|--------------------------------------------------------------------------
| PUBLIC + USER ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/', fn () => Inertia::render('Welcome'))->name('home');
Route::get('/login', fn () => Inertia::render('Welcome'))->name('login');

Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::post('/contractor/register', [AuthController::class, 'contractorRegister'])->name('contractor.register');

/* 🔽 ParkX (web) password reset routes */
Route::get('/password/reset',         [UserPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/password/email',        [UserPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/password/reset/{token}', [UserPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/password/reset',        [UserPasswordController::class, 'reset'])->name('password.update');

/*
|--------------------------------------------------------------------------
| LOGGED-IN ParkX USERS (web guard)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // Employee – Matériel inbox (site responsables)
    Route::prefix('materiel')->name('employee.materiel.')->group(function () {
        Route::get('/',                       [EmpMaterialCtrl::class, 'index'])->name('index');
        Route::get('/{id}',                   [EmpMaterialCtrl::class, 'show'])->whereNumber('id')->name('show');
        Route::post('/{id}/accept',           [EmpMaterialCtrl::class, 'accept'])->whereNumber('id')->name('accept');
        Route::post('/{id}/reject',           [EmpMaterialCtrl::class, 'reject'])->whereNumber('id')->name('reject');
        Route::get ('/{id}/download/{field}', [EmpMaterialCtrl::class, 'download'])->whereNumber('id')->name('download');
    });

    // Dashboard
    Route::get('/dashboard', function () {
        $user = auth()->user();

        $isResponsible = \App\Models\Site::where('responsible_user_id', $user->id)->exists();
        $assignedPending = \App\Models\SignatureRequest::where('assigned_user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        /* ✅ ADDED: detect if this user is an admin by email */
        $isAdmin = \App\Models\Admin::where('email', $user->email)->exists();

        return Inertia::render('Dashboard', [
            'isResponsible'   => $isResponsible,
            'assignedPending' => $assignedPending,
            'isAdmin'         => $isAdmin,  // ← passed to frontend
        ]);
    })->name('dashboard');

    // Employee – Signatures inbox
    Route::prefix('signatures')->name('employee.signatures.')->group(function () {
        Route::get('/',                       [SignatureInboxController::class, 'index'])->name('index');
        Route::get('/{id}',                   [SignatureInboxController::class, 'show'])->whereNumber('id')->name('show');
        Route::get('/{id}/download-original', [SignatureInboxController::class, 'downloadOriginal'])->whereNumber('id')->name('download.original');
        Route::post('/{id}/approve',          [SignatureInboxController::class, 'approve'])->whereNumber('id')->name('approve');
        Route::post('/{id}/reject',           [SignatureInboxController::class, 'reject'])->whereNumber('id')->name('reject');
        Route::get('/{id}/sign',              [SignatureInboxController::class, 'signForm'])->whereNumber('id')->name('sign.form');
        Route::post('/{id}/sign',             [SignatureInboxController::class, 'signSubmit'])->whereNumber('id')->name('sign.submit');
    });

    // VODS
    Route::get('/vods',                    [VodsController::class, 'show'])->name('vods.show');
    Route::get('/vods/form',               [VodsController::class, 'show'])->name('vods.form');
    Route::post('/vods/store',             [VodsController::class, 'store'])->name('vods.store');
    Route::get('/vods/history',            [VodsController::class, 'history'])->name('vods.history');
    Route::get('/vods/history/data',       [VodsController::class, 'historyData'])->name('vods.history.data');
    Route::get('/vods/notification',       [VodsController::class, 'notification'])->name('vods.notification');
    Route::get('/vods/notifications/data', [VodsController::class, 'notificationsData'])->name('vods.notifications.data');
    Route::get('/vods/{vod}/pdf',          [VodsController::class, 'pdf'])->whereNumber('vod')->name('vods.pdf');

    // Logout (web guard)
    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('logout');
});

// Public QR verification (for external scanners)
Route::get('/verify/material/{token}', [\App\Http\Controllers\QrVerifyController::class, 'material'])->name('qr.material');

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', fn () => Inertia::render('Admin/Login'))->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('login.submit');

    // Admin password reset routes ✅ (unchanged)
    Route::get('/password/reset',         [AdminPasswordController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/password/email',        [AdminPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/password/reset/{token}', [AdminPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('/password/reset',        [AdminPasswordController::class, 'reset'])->name('password.update');

    Route::get('/materiel', [AdminMaterialCtrl::class, 'index'])->name('material.index');

    Route::middleware([AdminAuth::class])->group(function () {
        Route::get('/home', [AdminController::class, 'home'])->name('home');            // KPIs / cards
        Route::get('/',      [AdminController::class, 'dashboard'])->name('dashboard'); // Users/Contractors tabs

        Route::get('vods', [AdminVodController::class, 'index'])->name('vods.index');
        Route::get('vods/{vod}/pdf', [AdminVodController::class, 'pdf'])->name('vods.pdf');
        Route::get('vods/{vod}/download', [AdminVodController::class, 'download'])->name('vods.download');
        Route::post('vods/{vod}/generate', [AdminVodController::class, 'generate'])->name('vods.generate');

        // Sites
        Route::get ('/sites',               [AdminSiteController::class, 'index'])->name('sites.index');
        Route::post('/sites',               [AdminSiteController::class, 'store'])->name('sites.store');
        Route::post('/sites/{site}/update', [AdminSiteController::class, 'update'])->name('sites.update');
        Route::post('/sites/{site}/delete', [AdminSiteController::class, 'destroy'])->name('sites.delete');

        // ParkX users
        Route::post('/users',                   [AdminController::class, 'createParkxUser'])->name('users.store');
        Route::post('/users/{id}/update-quota', [AdminController::class, 'updateUserVodsQuota'])->whereNumber('id')->name('users.update-quota');
        Route::post('/users/{id}/delete',       [AdminController::class, 'deleteParkxUser'])->whereNumber('id')->name('users.delete');

        // Contractors
        Route::post('/contractors/{id}/approve', [AdminController::class, 'approveContractor'])->whereNumber('id')->name('contractors.approve');
        Route::post('/contractors/{id}/reject',  [AdminController::class, 'rejectContractor'])->whereNumber('id')->name('contractors.reject');
        Route::post('/contractors/{id}/delete',  [AdminController::class, 'deleteApprovedContractor'])->whereNumber('id')->name('contractors.delete');

        // Admin signatures
        Route::get ('/signatures',                        [AdminSignCtrl::class, 'index'])->name('signatures.index');
        Route::get ('/signatures/{id}',                   [AdminSignCtrl::class, 'show'])->whereNumber('id')->name('signatures.show');
        Route::get ('/signatures/{id}/download-original', [AdminSignCtrl::class, 'downloadOriginal'])->whereNumber('id')->name('signatures.download.original');
        Route::get ('/signatures/{id}/download-signed',   [AdminSignCtrl::class, 'downloadSigned'])->whereNumber('id')->name('signatures.download.signed');
        Route::post('/signatures/{id}/approve',           [AdminSignCtrl::class, 'approve'])->whereNumber('id')->name('signatures.approve');
        Route::post('/signatures/{id}/reject',            [AdminSignCtrl::class, 'reject'])->whereNumber('id')->name('signatures.reject');

        // Pure in-app flow
        Route::post('/signatures/{id}/assign', [AdminSignCtrl::class, 'assign'])->whereNumber('id')->name('signatures.assign');
        Route::get ('/signatures/{id}/sign',   [AdminSignCtrl::class, 'signForm'])->whereNumber('id')->name('signatures.sign.form');
        Route::post('/signatures/{id}/sign',   [AdminSignCtrl::class, 'signSubmit'])->whereNumber('id')->name('signatures.sign.submit');

        // Admin logout
        Route::post('/logout', function () {
            session()->forget('admin_id');
            return redirect()->route('admin.login');
        })->name('logout');
    });
});

/*
|--------------------------------------------------------------------------
| CONTRACTANT (Contractor portal) – guard: contractor
|--------------------------------------------------------------------------
*/
Route::prefix('contractant')->name('contractant.')->group(function () {
    // Contractor auth
    Route::get('/login',  [ContractorAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [ContractorAuthController::class, 'login'])->name('login.submit');

    /* 🔽 Contractor password reset routes (contractant.*) */
    Route::get('/password/reset',         [ContractorPasswordController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/password/email',        [ContractorPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/password/reset/{token}', [ContractorPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('/password/reset',        [ContractorPasswordController::class, 'reset'])->name('password.update');

    Route::middleware('auth:contractor')->group(function () {
        Route::get('/',                 [ContractantController::class, 'home'])->name('home');
        Route::get('/documents',        [ContractantController::class, 'documents'])->name('documents');
        Route::get('/depot-signatures', [ContractantController::class, 'depot'])->name('depot');

        // VODS (⚠️ fix names to avoid double "contractant." prefix)
        Route::get ('/vods',               [ContractantVodController::class, 'index'])->name('vods.index');
        Route::post('/vods/store',         [ContractantVodController::class, 'store'])->name('vods.store');
        Route::get ('/vods/history/data',  [ContractantVodController::class, 'historyData'])->name('vods.history.data');
        Route::get ('/vods/{vod}/pdf',     [ContractantVodController::class, 'pdf'])->whereNumber('vod')->name('vods.pdf');
        Route::get ('/vods/{vod}/download',[ContractantVodController::class, 'download'])->whereNumber('vod')->name('vods.download');

        // RESSOURCES MATÉRIEL (Contractant)
        Route::get ('/materiel',      \App\Http\Controllers\Contractant\MaterialRequestController::class.'@index')
            ->name('materiel.index');

        Route::post('/materiel',      \App\Http\Controllers\Contractant\MaterialRequestController::class.'@store')
            ->name('materiel.store');

        Route::get ('/materiel/{id}', \App\Http\Controllers\Contractant\MaterialRequestController::class.'@show')
            ->whereNumber('id')
            ->name('materiel.show');

        // Parapheur (contractor uploads + tracking)
        Route::get ('/parapheur',                        [ContractorSignCtrl::class, 'index'])->name('parapheur.index');
        Route::post('/parapheur',                        [ContractorSignCtrl::class, 'store'])->name('parapheur.store');
        Route::get ('/parapheur/{id}',                   [ContractorSignCtrl::class, 'show'])->whereNumber('id')->name('parapheur.show');
        Route::get ('/parapheur/{id}/download-original', [ContractorSignCtrl::class, 'downloadOriginal'])->whereNumber('id')->name('parapheur.download.original');
        Route::get ('/parapheur/{id}/download-signed',   [ContractorSignCtrl::class, 'downloadSigned'])->whereNumber('id')->name('parapheur.download.signed');
        Route::post('/parapheur/{id}/comment',           [ContractorSignCtrl::class, 'comment'])->whereNumber('id')->name('parapheur.comment');

        // Contractor logout
        Route::post('/logout', [ContractorAuthController::class, 'logout'])->name('logout');
    });
});
