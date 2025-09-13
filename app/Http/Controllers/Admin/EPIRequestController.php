<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EPIRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EPIRequestController extends Controller
{
    /**
     * Display a listing of EPI requests.
     */
    public function index(Request $request)
    {
        $query = EPIRequest::with(['user', 'admin'])->latest();

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

        $epiRequests = $query->paginate(15);

        return Inertia::render('Admin/EPIRequests/Index', [
            'epiRequests' => $epiRequests,
            'filters' => $request->only(['search', 'etat', 'date']),
        ]);
    }

    /**
     * Display the specified EPI request.
     */
    public function show(EPIRequest $epiRequest)
    {
        $epiRequest->load(['user', 'admin']);
        
        return Inertia::render('Admin/EPIRequests/Show', [
            'epiRequest' => $epiRequest,
        ]);
    }

    /**
     * Update the specified EPI request.
     */
    public function update(Request $request, EPIRequest $epiRequest)
    {
        $validated = $request->validate([
            'etat' => 'required|in:en_cours,en_traitement,done,rejected',
            'commentaires_admin' => 'nullable|string|max:1000',
        ]);

        $epiRequest->update([
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
            'total' => EPIRequest::count(),
            'en_cours' => EPIRequest::where('etat', 'en_cours')->count(),
            'en_traitement' => EPIRequest::where('etat', 'en_traitement')->count(),
            'done' => EPIRequest::where('etat', 'done')->count(),
            'rejected' => EPIRequest::where('etat', 'rejected')->count(),
            'recent' => EPIRequest::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get recent EPI requests for notifications.
     */
    public function recent()
    {
        $recentRequests = EPIRequest::with(['user'])
            ->where('created_at', '>=', now()->subDays(1))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($recentRequests);
    }
}