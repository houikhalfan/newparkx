<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PPERequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PPERequestController extends Controller
{
    /**
     * Display a listing of PPE requests.
     */
    public function index(Request $request)
    {
        $query = PPERequest::with(['user', 'admin'])->latest();

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nom_prenom', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function ($userQuery) use ($request) {
                      $userQuery->where('name', 'like', '%' . $request->search . '%')
                               ->orWhere('email', 'like', '%' . $request->search . '%');
                  });
            });
        }

        // Filter by status
        if ($request->filled('etat')) {
            $query->where('etat', $request->etat);
        }

        // Filter by date
        if ($request->filled('date')) {
            $query->whereDate('date_demande', $request->date);
        }

        $ppeRequests = $query->paginate(15);

        return Inertia::render('Admin/PPERequests/Index', [
            'ppeRequests' => $ppeRequests,
            'filters' => $request->only(['search', 'etat', 'date']),
        ]);
    }

    /**
     * Display the specified PPE request.
     */
    public function show(PPERequest $ppeRequest)
    {
        $ppeRequest->load(['user', 'admin']);
        
        return Inertia::render('Admin/PPERequests/Show', [
            'ppeRequest' => $ppeRequest,
        ]);
    }

    /**
     * Update the specified PPE request.
     */
    public function update(Request $request, PPERequest $ppeRequest)
    {
        $validated = $request->validate([
            'etat' => 'required|in:en_cours,en_traitement,done,rejected',
            'commentaires_admin' => 'nullable|string|max:1000',
        ]);

        $ppeRequest->update([
            'etat' => $validated['etat'],
            'commentaires_admin' => $validated['commentaires_admin'],
            'admin_id' => Auth::guard('admin')->id(),
        ]);

        return redirect()->back()->with('success', 'Demande d\'EPI mise à jour avec succès.');
    }

    /**
     * Get statistics for the dashboard.
     */
    public function stats()
    {
        $stats = [
            'total' => PPERequest::count(),
            'en_cours' => PPERequest::where('etat', 'en_cours')->count(),
            'en_traitement' => PPERequest::where('etat', 'en_traitement')->count(),
            'done' => PPERequest::where('etat', 'done')->count(),
            'rejected' => PPERequest::where('etat', 'rejected')->count(),
            'recent' => PPERequest::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get recent PPE requests for notifications.
     */
    public function recent()
    {
        $recentRequests = PPERequest::with(['user'])
            ->where('created_at', '>=', now()->subDays(1))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($recentRequests);
    }
}