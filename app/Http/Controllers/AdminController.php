<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\Admin;
use App\Models\Contractor;
use App\Models\User;
use App\Models\Vod;
use App\Models\Site;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    /**
     * Admin login (uses the `admin` guard).
     * Make sure your frontend posts to route('admin.login.post').
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! \Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Invalid admin credentials.',
            ]);
        }

        $request->session()->regenerate();

        return \Inertia\Inertia::location(route('admin.home'));
    }

    /**
     * Optional: admin logout
     */
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    /**
     * Admin dashboard.
     */
    public function dashboard()
    {
        $sites = Site::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Dashboard', [
            'users' => User::orderBy('created_at', 'desc')
                ->get(['id', 'name', 'email', 'vods_quota', 'created_at', 'site_id']),
            'pendingContractors'  => Contractor::where('is_approved', false)
                ->orderBy('created_at', 'desc')->get(),
            'approvedContractors' => Contractor::where('is_approved', true)
                ->orderBy('created_at', 'desc')->get(),
            'sites'      => $sites,
            'csrf_token' => csrf_token(),
            'url'        => request()->getRequestUri(),
        ]);
    }

    /**
     * Create ParkX employee (+ optionally create/update Admin if toggle checked).
     */
    public function createParkxUser(Request $request)
    {
        Log::info('createParkxUser HIT', $request->only('name','email','site_id','as_admin'));

        // Normalize "" to null so 'nullable' works properly
        $request->merge(['site_id' => $request->site_id !== '' ? $request->site_id : null]);

        try {
            $data = $request->validate([
                'name'                  => ['required','string','max:255'],
                'email'                 => ['required','email','max:255','unique:users,email'],
                'password'              => ['required','string','min:8','confirmed'],
                'site_id'               => ['nullable','integer','exists:sites,id'],
                'as_admin'              => ['nullable'], // checkbox
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('createParkxUser VALIDATION FAILED', $e->errors());
            return back()->withErrors($e->errors())->withInput();
        }

        // If your User model casts password to 'hashed', this will be hashed automatically.
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],  // hashed by cast
            'site_id'  => $data['site_id'],
        ]);

        Log::info('createParkxUser OK', ['id' => $user->id]);

        /**
         * ✅ NEW: If "Créer aussi un compte Admin" is checked,
         * create or update the Admin row with the SAME hashed password.
         * This lets the new admin log in immediately with the same credentials.
         */
        if ($request->boolean('as_admin')) {
            Admin::updateOrCreate(
                ['email' => $user->email],
                [
                    'name'     => $user->name,
                    'password' => $user->password, // reuse hashed value from User
                ]
            );
            Log::info('Admin synced from ParkX user', ['email' => $user->email]);
        }

        return back()->with('success', 'Utilisateur créé.');
    }

    /**
     * Update ParkX user's VOD quota
     */
    public function updateUserVodsQuota($id, Request $request)
    {
        $data = $request->validate([
            'vods_quota' => ['required','integer','min:0'],
        ]);

        $user = User::findOrFail($id);
        $user->update(['vods_quota' => $data['vods_quota']]);

        return back()->with('success', 'Quota updated.');
    }

    /**
     * Delete ParkX user
     */
    public function deleteParkxUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('success', 'User deleted.');
    }

    /**
     * Approve contractor
     */
    public function approveContractor($id)
    {
        $contractor = Contractor::findOrFail($id);
        $contractor->is_approved = true;
        $contractor->save();

        return back()->with('success', 'Contractor approved.');
    }

    /**
     * Reject contractor
     */
    public function rejectContractor($id)
    {
        $contractor = Contractor::findOrFail($id);
        $contractor->delete();

        return back()->with('success', 'Contractor rejected and deleted.');
    }

    /**
     * Delete approved contractor
     */
    public function deleteApprovedContractor($id)
    {
        $contractor = Contractor::where('is_approved', true)->findOrFail($id);
        $contractor->delete();

        return back()->with('success', 'Contractor account deleted.');
    }

    /**
     * Show contractor details
     */
    public function showContractor($id)
    {
        $contractor = Contractor::findOrFail($id);
        
        // Load related data
        $contractor->load('project');
        
        return response()->json([
            'contractor' => [
                'id' => $contractor->id,
                'name' => $contractor->name,
                'email' => $contractor->email,
                'phone' => $contractor->phone,
                'company_name' => $contractor->company_name,
                'role' => $contractor->role,
                'project_id' => $contractor->project_id,
                'project_name' => $contractor->project ? $contractor->project->name : null,
                'is_approved' => $contractor->is_approved,
                'created_at' => $contractor->created_at,
                'updated_at' => $contractor->updated_at,
            ]
        ]);
    }

    /**
     * Admin Home
     */
    public function home()
    {
        $totalUsers       = User::count();
        $totalContractors = Contractor::count();

        $vodsCompleted = Vod::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();

        $vodsDue = (int) User::sum('vods_quota');

        $recentLogins = User::whereNotNull('last_login_at')
            ->orderByDesc('last_login_at')
            ->limit(8)
            ->get(['id','name','email','last_login_at']);

        $pendingApprovals = Contractor::where('is_approved', false)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['id','name','email','company_name','created_at']);

        $pendingCount = Contractor::where('is_approved', false)->count();

        $monthLabel = Carbon::now()->locale('fr')->isoFormat('MMMM YYYY');

        return Inertia::render('Admin/Home', [
            'stats' => [
                'users'        => $totalUsers,
                'contractors'  => $totalContractors,
                'vods_due'     => $vodsDue,
                'vods_done'    => $vodsCompleted,
                'month_label'  => $monthLabel,
            ],
            'recentLogins'     => $recentLogins,
            'pendingApprovals' => $pendingApprovals,
            'pendingCount'     => $pendingCount,
            'csrf_token'       => csrf_token(),
        ]);
    }
}
