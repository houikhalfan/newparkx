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
use App\Http\Controllers\Contractant\PermisExcavationController;
use App\Http\Controllers\Admin\VodController as AdminVodController;
use App\Http\Controllers\Employee\ResponsibleSiteController;

// Signatures
use App\Http\Controllers\Contractant\SignatureRequestController as ContractorSignCtrl;
use App\Http\Controllers\Admin\SignatureRequestController as AdminSignCtrl;
use App\Http\Controllers\Employee\SignatureInboxController;

use App\Http\Controllers\ResponsibleSite\PermisController as ResponsibleSitePermisCtrl;
use App\Http\Controllers\HSEResponsible\PermisController as HSEResponsiblePermisCtrl;

// Sites
use App\Http\Controllers\Admin\SiteController as AdminSiteController;

// Projects
use App\Http\Controllers\Admin\ProjectController;

// Permis d’excavation
use App\Http\Controllers\Admin\PermisAdminController;

// Matériel
use App\Http\Controllers\Employee\MaterialRequestInboxController as EmpMaterialCtrl;
use App\Http\Controllers\Contractant\MaterialRequestController as ContractorMaterialCtrl;

// Password reset controllers
use App\Http\Controllers\UserPasswordController;
use App\Http\Controllers\ContractorPasswordController;
use App\Http\Controllers\Contractant\ContractantVodController;
use App\Http\Controllers\Contractant\StatisticsController as ContractantStatsController;
use App\Http\Controllers\Admin\StatisticsController as AdminStatsController;

/*
|--------------------------------------------------------------------------
| PUBLIC + USER ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/', [AuthController::class, 'welcome'])->name('home');
Route::get('/login', [AuthController::class, 'welcome'])->name('login');

Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
Route::post('/contractor/register', [AuthController::class, 'contractorRegister'])->name('contractor.register');

// ParkX (web) password reset routes
Route::get('/password/reset',         [UserPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/password/email',        [UserPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/password/reset/{token}', [UserPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/password/reset',        [UserPasswordController::class, 'reset'])->name('password.update');

/*
|--------------------------------------------------------------------------
| LOGGED-IN ParkX USERS (web guard)
|--------------------------------------------------------------------------
*/
// routes/web.php (temporary debug route)
Route::get('/debug-permis', function() {
    $user = auth()->user();
    
    if (!$user) {
        return "No user authenticated";
    }
    
    // Check the database structure
    $firstPermis = \App\Models\PermisExcavation::first();
    $fields = $firstPermis ? array_keys($firstPermis->getAttributes()) : [];
    
    return response()->json([
        'user' => $user,
        'database_fields' => $fields,
        'first_permis' => $firstPermis
    ]);
})->middleware('auth');
Route::middleware('auth')->group(function () {

    // Employee – Matériel inbox (site responsables)
    Route::prefix('materiel')->name('employee.materiel.')->group(function () {
        Route::get('/',                       [EmpMaterialCtrl::class, 'index'])->name('index');
        Route::get('/{id}',                   [EmpMaterialCtrl::class, 'show'])->whereNumber('id')->name('show');
        Route::post('/{id}/accept',           [EmpMaterialCtrl::class, 'accept'])->whereNumber('id')->name('accept');
        Route::post('/{id}/reject',           [EmpMaterialCtrl::class, 'reject'])->whereNumber('id')->name('reject');
        Route::get ('/{id}/download/{field}', [EmpMaterialCtrl::class, 'download'])->whereNumber('id')->name('download');
    });
// routes/web.php
Route::middleware(['auth'])->prefix('responsible-site')->name('responsibleSite.')->group(function () {
    Route::get('/permis', [ResponsibleSitePermisCtrl::class, 'index'])->name('permis.index');
    Route::get('/permis/{permisExcavation}', [ResponsibleSitePermisCtrl::class, 'show'])->name('permis.show');
    Route::post('/permis/{permis}/sign', [ResponsibleSitePermisCtrl::class, 'sign'])->name('permis.sign');
});

Route::get('/responsible-site/suivi-permis', [ResponsibleSiteController::class, 'index'])
    ->name('responsible.suivi-permis.index');
    
Route::middleware(['auth'])->prefix('hse-responsible')->name('hseResponsible.')->group(function () {
    Route::get('/permis', [HSEResponsiblePermisCtrl::class, 'index'])->name('permis.index');
    Route::get('/permis/{permisExcavation}', [HSEResponsiblePermisCtrl::class, 'show'])->name('permis.show');
    Route::post('/permis/{permis}/sign', [HSEResponsiblePermisCtrl::class, 'sign'])->name('permis.sign');
});




    // Dashboard
    Route::get('/dashboard', function () {
        $user = auth()->user();
$isHseResponsible = \App\Models\Site::where('responsible_hse_id', $user->id)->exists();

        $isResponsible = \App\Models\Site::where('responsible_user_id', $user->id)->exists();
        $assignedPending = \App\Models\SignatureRequest::where('assigned_user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        $isAdmin = \App\Models\Admin::where('email', $user->email)->exists();

        return Inertia::render('Dashboard', [
            'isResponsible'   => $isResponsible,
            'isHseResponsible' => $isHseResponsible,
            'assignedPending' => $assignedPending,
            'isAdmin'         => $isAdmin,
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

    // EPI Requests
    Route::get('/epi-requests',            [\App\Http\Controllers\EPIRequestController::class, 'index'])->name('epi-requests.index');
    Route::post('/epi-requests',           [\App\Http\Controllers\EPIRequestController::class, 'store'])->name('epi-requests.store');
    Route::get('/epi-requests/history',    [\App\Http\Controllers\EPIRequestController::class, 'history'])->name('epi-requests.history');
    Route::get('/epi-requests/{epiRequest}', [\App\Http\Controllers\EPIRequestController::class, 'show'])->whereNumber('epiRequest')->name('epi-requests.show');
    Route::get('/epi-requests/{epiRequest}/edit', [\App\Http\Controllers\EPIRequestController::class, 'edit'])->whereNumber('epiRequest')->name('epi-requests.edit');
    Route::put('/epi-requests/{epiRequest}', [\App\Http\Controllers\EPIRequestController::class, 'update'])->whereNumber('epiRequest')->name('epi-requests.update');

    // Documents (for regular ParkX users)
    Route::get('/documents',               [\App\Http\Controllers\UserController::class, 'documents'])->name('documents');
    Route::get('/documents/{document}/download', [\App\Http\Controllers\UserController::class, 'downloadDocument'])->whereNumber('document')->name('documents.download');

    // Logout (web guard)
    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('logout');
});

// Public QR verification
Route::get('/verify/material/{token}', [\App\Http\Controllers\QrVerifyController::class, 'material'])->name('qr.material');

// Public contractor approval route (for email links)
Route::post('/contractor/{id}/approve', [AdminController::class, 'approveContractorPublic'])->whereNumber('id')->name('contractor.approve.public');

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', fn () => Inertia::render('Admin/Login'))->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('login.submit');

    // Admin password reset routes
    Route::get('/password/reset',         [AdminPasswordController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/password/email',        [AdminPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/password/reset/{token}', [AdminPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('/password/reset',        [AdminPasswordController::class, 'reset'])->name('password.update');

    Route::get('/materiel', [AdminMaterialCtrl::class, 'index'])->name('material.index');

    Route::middleware([AdminAuth::class])->group(function () {
        Route::get('/home', [AdminController::class, 'home'])->name('home');
        Route::get('/',      [AdminController::class, 'dashboard'])->name('dashboard');

        Route::get('/vods/stats-data', [AdminVodController::class, 'statsData'])
        ->name('vods.stats');

    Route::get('vods', [AdminVodController::class, 'index'])->name('vods.index');
    Route::get('vods/{vod}/pdf', [AdminVodController::class, 'pdf'])->name('vods.pdf');
    Route::get('vods/{vod}/download', [AdminVodController::class, 'download'])->name('vods.download');
    Route::post('vods/{vod}/generate', [AdminVodController::class, 'generate'])->name('vods.generate');


        // Sites
        Route::get ('/sites',               [AdminSiteController::class, 'index'])->name('sites.index');
        Route::post('/sites',               [AdminSiteController::class, 'store'])->name('sites.store');
        Route::post('/sites/{site}/update', [AdminSiteController::class, 'update'])->name('sites.update');
        Route::post('/sites/{site}/delete', [AdminSiteController::class, 'destroy'])->name('sites.delete');
    
        // Permis d’excavation
Route::get('/permis', [PermisAdminController::class, 'index'])
        ->name('permis.index');
        // Projects
        Route::resource('projects', ProjectController::class);

        // ParkX users
        Route::post('/users',                   [AdminController::class, 'createParkxUser'])->name('users.store');
        Route::post('/users/{id}/update-quota', [AdminController::class, 'updateUserVodsQuota'])->whereNumber('id')->name('users.update-quota');
        Route::post('/users/{id}/delete',       [AdminController::class, 'deleteParkxUser'])->whereNumber('id')->name('users.delete');

        // Contractors
        Route::get('/contractors/{id}/show',     [AdminController::class, 'showContractor'])->whereNumber('id')->name('contractors.show');
        Route::post('/contractors/{id}/approve', [AdminController::class, 'approveContractor'])->whereNumber('id')->name('contractors.approve');
        Route::post('/contractors/{id}/reject',  [AdminController::class, 'rejectContractor'])->whereNumber('id')->name('contractors.reject');
        Route::post('/contractors/{id}/delete',  [AdminController::class, 'deleteApprovedContractor'])->whereNumber('id')->name('contractors.delete');

        // Notifications
        Route::get('/notifications', [AdminController::class, 'getNotifications'])->name('notifications.index');
        Route::post('/notifications/{id}/read', [AdminController::class, 'markNotificationAsRead'])->whereNumber('id')->name('notifications.read');
        Route::post('/notifications/mark-all-read', [AdminController::class, 'markAllNotificationsAsRead'])->name('notifications.mark-all-read');

        // Admin signatures
        Route::get ('/signatures',                        [AdminSignCtrl::class, 'index'])->name('signatures.index');
        Route::get ('/signatures/{id}',                   [AdminSignCtrl::class, 'show'])->whereNumber('id')->name('signatures.show');
        Route::get ('/signatures/{id}/download-original', [AdminSignCtrl::class, 'downloadOriginal'])->whereNumber('id')->name('signatures.download.original');
        Route::get ('/signatures/{id}/download-signed',   [AdminSignCtrl::class, 'downloadSigned'])->whereNumber('id')->name('signatures.download.signed');
        Route::post('/signatures/{id}/approve',           [AdminSignCtrl::class, 'approve'])->whereNumber('id')->name('signatures.approve');
        Route::post('/signatures/{id}/reject',            [AdminSignCtrl::class, 'reject'])->whereNumber('id')->name('signatures.reject');
        Route::post('/signatures/{id}/assign',            [AdminSignCtrl::class, 'assign'])->whereNumber('id')->name('signatures.assign');
        Route::get ('/signatures/{id}/sign',              [AdminSignCtrl::class, 'signForm'])->whereNumber('id')->name('signatures.sign.form');
        Route::post('/signatures/{id}/sign',              [AdminSignCtrl::class, 'signSubmit'])->whereNumber('id')->name('signatures.sign.submit');

        // HSE Statistics (Admin)
        Route::get ('/hse-statistics',                        [AdminStatsController::class, 'index'])->name('hse-statistics.index');
        Route::get ('/hse-statistics/{id}',                   [AdminStatsController::class, 'show'])->whereNumber('id')->name('hse-statistics.show');
        Route::get ('/hse-statistics/{id}/download/{field}',  [AdminStatsController::class, 'download'])->whereNumber('id')->name('hse-statistics.download');
        Route::get ('/hse-statistics/aggregated',             [AdminStatsController::class, 'aggregated'])->name('hse-statistics.aggregated');
        Route::get ('/hse-statistics/export',                 [AdminStatsController::class, 'export'])->name('hse-statistics.export');
        Route::get ('/hse-statistics/export-excel',           [AdminStatsController::class, 'exportExcel'])->name('hse-statistics.export-excel');
        
        // Documents (Admin)
        Route::get ('/documents',                         [\App\Http\Controllers\Admin\DocumentController::class, 'index'])->name('documents.index');
        Route::get ('/documents/create',                      [\App\Http\Controllers\Admin\DocumentController::class, 'create'])->name('documents.create');
        Route::post('/documents',                             [\App\Http\Controllers\Admin\DocumentController::class, 'store'])->name('documents.store');
        Route::get ('/documents/{document}',                  [\App\Http\Controllers\Admin\DocumentController::class, 'show'])->whereNumber('document')->name('documents.show');
        Route::get ('/documents/{document}/edit',             [\App\Http\Controllers\Admin\DocumentController::class, 'edit'])->whereNumber('document')->name('documents.edit');
        Route::put ('/documents/{document}',                  [\App\Http\Controllers\Admin\DocumentController::class, 'update'])->whereNumber('document')->name('documents.update');
        Route::delete('/documents/{document}',                [\App\Http\Controllers\Admin\DocumentController::class, 'destroy'])->whereNumber('document')->name('documents.destroy');
        Route::get ('/documents/{document}/download',         [\App\Http\Controllers\Admin\DocumentController::class, 'download'])->whereNumber('document')->name('documents.download');
        Route::post('/documents/bulk-delete',                 [\App\Http\Controllers\Admin\DocumentController::class, 'bulkDelete'])->name('documents.bulk-delete');

        // EPI Requests Management
        Route::get ('/epi-requests',                         [\App\Http\Controllers\Admin\EPIRequestController::class, 'index'])->name('epi-requests.index');
        Route::get ('/epi-requests/{epiRequest}',            [\App\Http\Controllers\Admin\EPIRequestController::class, 'show'])->whereNumber('epiRequest')->name('epi-requests.show');
        Route::put ('/epi-requests/{epiRequest}',            [\App\Http\Controllers\Admin\EPIRequestController::class, 'update'])->whereNumber('epiRequest')->name('epi-requests.update');
        Route::get ('/epi-requests/{epiRequest}/stats',      [\App\Http\Controllers\Admin\EPIRequestController::class, 'stats'])->whereNumber('epiRequest')->name('epi-requests.stats');
        Route::get ('/epi-requests/recent',                  [\App\Http\Controllers\Admin\EPIRequestController::class, 'recent'])->name('epi-requests.recent');
        
        // Debug route to check admin session
        Route::get('/debug-admin', function() {
            return response()->json([
                'admin_id' => \Auth::guard('admin')->id(),
                'admin' => \Auth::guard('admin')->user(),
                'session_all' => session()->all(),
                'is_authenticated' => \Auth::guard('admin')->check(),
            ]);
        });
        
        // Simple test route to create a document manually
        Route::get('/test-create-doc', function() {
            $admin = \App\Models\Admin::first();
            if (!$admin) {
                return response()->json(['error' => 'No admin found']);
            }
            
            try {
                $doc = \App\Models\Document::create([
                    'title' => 'Test Document',
                    'description' => 'Test description',
                    'filename' => 'test.txt',
                    'original_filename' => 'test.txt',
                    'file_path' => 'documents/test.txt',
                    'file_type' => 'text/plain',
                    'file_size' => 100,
                    'visibility' => ['public'],
                    'admin_id' => $admin->id,
                    'full_name' => $admin->email,
                    'category' => 'Test',
                    'meta' => ['test' => true],
                ]);
                
                return response()->json(['success' => true, 'document_id' => $doc->id]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()]);
            }
        });
        
        // Notifications
        Route::get ('/notifications',                         [App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/{id}/read',               [App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])->whereNumber('id')->name('notifications.read');
        Route::post('/notifications/mark-all-read',           [App\Http\Controllers\Admin\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
        Route::get ('/notifications/all',                     [App\Http\Controllers\Admin\NotificationController::class, 'all'])->name('notifications.all');

        // Admin logout
        Route::post('/logout', [AdminController::class, 'logout'])->name('logout');
    });
});

/*
|--------------------------------------------------------------------------
| CONTRACTANT ROUTES (Contractor Portal)
|--------------------------------------------------------------------------
*/
Route::prefix('contractant')->name('contractant.')->group(function () {
    // Contractor auth
    Route::get('/login',  [ContractorAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [ContractorAuthController::class, 'login'])->name('login.submit');
    Route::post('/logout', [ContractorAuthController::class, 'logout'])->name('logout');

    // Contractor password reset
    Route::get('/password/reset',         [ContractorPasswordController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/password/email',        [ContractorPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/password/reset/{token}', [ContractorPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('/password/reset',        [ContractorPasswordController::class, 'reset'])->name('password.update');

    Route::middleware('auth:contractor')->group(function () {
        Route::get('/',                 [ContractantController::class, 'home'])->name('home');
        Route::get('/profile',          [ContractantController::class, 'profile'])->name('profile');
        Route::post('/profile',         [ContractantController::class, 'updateProfile'])->name('profile.update');
        Route::post('/password/change', [ContractantController::class, 'updatePassword'])->name('password.change');
        Route::get('/documents',        [ContractantController::class, 'documents'])->name('documents');
        Route::get('/documents/{document}/download', [ContractantController::class, 'downloadDocument'])->whereNumber('document')->name('documents.download');
        Route::get('/depot-signatures', [ContractantController::class, 'depot'])->name('depot');

// ✅ Suivi des permis
Route::get('/suivi-permis', [PermisExcavationController::class, 'index'])
    ->name('suivi-permis.index');

// ✅ Création d’un nouveau permis
Route::get('/permis-excavation/create', [PermisExcavationController::class, 'create'])
    ->name('permisexcavation.create');

// ✅ Soumission (store)
Route::post('/permis-excavation', [PermisExcavationController::class, 'store'])
    ->name('permisexcavation.store');

// ✅ Consultation (lecture seule)
Route::get('/permis-excavation/{permisExcavation}', [PermisExcavationController::class, 'show'])
    ->name('permisexcavation.show');


        // ✅ Permis de travail sécuritaire (frontend only for now)
        Route::get('/permis-de-travail-securitaire', function () {
            return Inertia::render('Contractant/PermisDeTravailSecuritaire');
        })->name('permis.travail.securitaire');

        // VODS
        Route::get('/vods', [ContractantVodController::class, 'index'])->name('vods.index');
        Route::post('/vods/store', [ContractantVodController::class, 'store'])->name('vods.store');
        Route::get('/vods/history/data', [ContractantVodController::class, 'historyData'])->name('vods.history.data');
        Route::get('/vods/{vod}/pdf', [ContractantVodController::class, 'pdf'])->whereNumber('vod')->name('vods.pdf');
        Route::get('/vods/{vod}/download', [ContractantVodController::class, 'download'])->whereNumber('vod')->name('vods.download');

        // Materiel
        Route::get('/materiel', [ContractorMaterialCtrl::class, 'index'])->name('materiel.index');
        Route::post('/materiel', [ContractorMaterialCtrl::class, 'store'])->name('materiel.store');
        Route::get('/materiel/{id}', [ContractorMaterialCtrl::class, 'show'])->whereNumber('id')->name('materiel.show');

        // Parapheur
        Route::get('/parapheur', [ContractorSignCtrl::class, 'index'])->name('parapheur.index');
        Route::post('/parapheur', [ContractorSignCtrl::class, 'store'])->name('parapheur.store');
        Route::get('/parapheur/{id}', [ContractorSignCtrl::class, 'show'])->whereNumber('id')->name('parapheur.show');
        Route::get('/parapheur/{id}/download-original', [ContractorSignCtrl::class, 'downloadOriginal'])->whereNumber('id')->name('parapheur.download.original');
        Route::get('/parapheur/{id}/download-signed', [ContractorSignCtrl::class, 'downloadSigned'])->whereNumber('id')->name('parapheur.download.signed');
        Route::post('/parapheur/{id}/comment', [ContractorSignCtrl::class, 'comment'])->whereNumber('id')->name('parapheur.comment');

        // HSE Statistics
        Route::get('/hse-statistics', [ContractantStatsController::class, 'index'])->name('hse-statistics.index');
        Route::post('/hse-statistics', [ContractantStatsController::class, 'store'])->name('hse-statistics.store');
        Route::get('/hse-statistics/{id}/edit', [ContractantStatsController::class, 'edit'])->whereNumber('id')->name('hse-statistics.edit');
        Route::put('/hse-statistics/{id}', [ContractantStatsController::class, 'update'])->whereNumber('id')->name('hse-statistics.update');
        Route::post('/hse-statistics/{id}', [ContractantStatsController::class, 'update'])->whereNumber('id')->name('hse-statistics.update.post');
        Route::get('/hse-statistics/{id}', [ContractantStatsController::class, 'show'])->whereNumber('id')->name('hse-statistics.show');
        Route::get('/hse-statistics/{id}/download/{field}', [ContractantStatsController::class, 'download'])->whereNumber('id')->name('hse-statistics.download');
        Route::get('/hse-statistics/history', [ContractantStatsController::class, 'history'])->name('hse-statistics.history');
    });
});

