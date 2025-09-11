<?php

namespace App\Http\Controllers;

use App\Models\PPERequest;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PPERequestController extends Controller
{
    /**
     * Display the PPE request form.
     */
    public function index()
    {
        $availableEpiTypes = PPERequest::getAvailableEpiTypes();
        $availableSizes = PPERequest::getAvailableSizes();
        $availablePointures = PPERequest::getAvailablePointures();

        return Inertia::render('PPERequests/Index', [
            'availableEpiTypes' => $availableEpiTypes,
            'availableSizes' => $availableSizes,
            'availablePointures' => $availablePointures,
        ]);
    }

    /**
     * Store a new PPE request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_prenom' => 'required|string|max:255',
            'date_demande' => 'required|date',
            'liste_epi' => 'required|array|min:1',
            'liste_epi.*' => 'required|string|in:' . implode(',', PPERequest::getAvailableEpiTypes()),
            'quantites' => 'required|array',
            'quantites.*' => 'required|integer|min:1|max:10',
            'tailles' => 'nullable|array',
            'tailles.*' => 'nullable|string|in:' . implode(',', PPERequest::getAvailableSizes()),
            'pointures' => 'nullable|array',
            'pointures.*' => 'nullable|integer|in:' . implode(',', PPERequest::getAvailablePointures()),
        ]);

        // Ensure arrays have the same length
        $epiCount = count($validated['liste_epi']);
        if (count($validated['quantites']) !== $epiCount) {
            return back()->withErrors(['quantites' => 'Le nombre de quantités doit correspondre au nombre d\'EPI.']);
        }

        if (isset($validated['tailles']) && count($validated['tailles']) !== $epiCount) {
            return back()->withErrors(['tailles' => 'Le nombre de tailles doit correspondre au nombre d\'EPI.']);
        }

        if (isset($validated['pointures']) && count($validated['pointures']) !== $epiCount) {
            return back()->withErrors(['pointures' => 'Le nombre de pointures doit correspondre au nombre d\'EPI.']);
        }

        $ppeRequest = PPERequest::create([
            'nom_prenom' => $validated['nom_prenom'],
            'date_demande' => $validated['date_demande'],
            'liste_epi' => $validated['liste_epi'],
            'quantites' => $validated['quantites'],
            'tailles' => $validated['tailles'] ?? [],
            'pointures' => $validated['pointures'] ?? [],
            'user_id' => Auth::id(),
            'etat' => 'en_cours',
        ]);

        // Send notification to all admins
        $admins = Admin::all();
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\PPERequestNotification($ppeRequest));
        }

        return redirect()->route('ppe-requests.history')->with('success', 'Votre demande d\'EPI a été soumise avec succès.');
    }

    /**
     * Display user's PPE request history.
     */
    public function history()
    {
        $ppeRequests = PPERequest::where('user_id', Auth::id())
            ->with('admin')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('PPERequests/History', [
            'ppeRequests' => $ppeRequests,
            'flash' => session()->get('flash', []),
        ]);
    }

    /**
     * Display the specified PPE request for the user.
     */
    public function show(PPERequest $ppeRequest)
    {
        // Ensure the user can only view their own requests
        if ($ppeRequest->user_id !== Auth::id()) {
            abort(403, 'Access denied');
        }

        $ppeRequest->load('admin');
        
        return Inertia::render('PPERequests/Show', [
            'ppeRequest' => $ppeRequest,
            'availableEpiTypes' => PPERequest::getAvailableEpiTypes(),
            'availableSizes' => PPERequest::getAvailableSizes(),
            'availablePointures' => PPERequest::getAvailablePointures(),
        ]);
    }

    /**
     * Show the form for editing the specified PPE request.
     */
    public function edit(PPERequest $ppeRequest)
    {
        // Ensure the user can only edit their own requests
        if ($ppeRequest->user_id !== Auth::id()) {
            abort(403, 'Access denied');
        }

        // Only allow editing if request is still "en cours"
        if ($ppeRequest->etat !== 'en_cours') {
            return redirect()->route('ppe-requests.show', $ppeRequest)->with('error', 'Vous ne pouvez modifier que les demandes en cours.');
        }

        $ppeRequest->load('admin');
        
        return Inertia::render('PPERequests/Edit', [
            'ppeRequest' => $ppeRequest,
            'availableEpiTypes' => PPERequest::getAvailableEpiTypes(),
            'availableSizes' => PPERequest::getAvailableSizes(),
            'availablePointures' => PPERequest::getAvailablePointures(),
        ]);
    }

    /**
     * Update the specified PPE request.
     */
    public function update(Request $request, PPERequest $ppeRequest)
    {
        // Ensure the user can only update their own requests
        if ($ppeRequest->user_id !== Auth::id()) {
            abort(403, 'Access denied');
        }

        // Only allow updating if request is still "en cours"
        if ($ppeRequest->etat !== 'en_cours') {
            return redirect()->route('ppe-requests.show', $ppeRequest)->with('error', 'Vous ne pouvez modifier que les demandes en cours.');
        }

        $validated = $request->validate([
            'nom_prenom' => 'required|string|max:255',
            'date_demande' => 'required|date',
            'liste_epi' => 'required|array|min:1',
            'liste_epi.*' => 'required|string|in:' . implode(',', PPERequest::getAvailableEpiTypes()),
            'quantites' => 'required|array',
            'quantites.*' => 'required|integer|min:1|max:10',
            'tailles' => 'nullable|array',
            'tailles.*' => 'nullable|string|in:' . implode(',', PPERequest::getAvailableSizes()),
            'pointures' => 'nullable|array',
            'pointures.*' => 'nullable|integer|in:' . implode(',', PPERequest::getAvailablePointures()),
        ]);

        // Ensure arrays have the same length
        $epiCount = count($validated['liste_epi']);
        if (count($validated['quantites']) !== $epiCount) {
            return back()->withErrors(['quantites' => 'Le nombre de quantités doit correspondre au nombre d\'EPI.']);
        }
        if (isset($validated['tailles']) && count($validated['tailles']) !== $epiCount) {
            return back()->withErrors(['tailles' => 'Le nombre de tailles doit correspondre au nombre d\'EPI.']);
        }
        if (isset($validated['pointures']) && count($validated['pointures']) !== $epiCount) {
            return back()->withErrors(['pointures' => 'Le nombre de pointures doit correspondre au nombre d\'EPI.']);
        }

        $ppeRequest->update([
            'nom_prenom' => $validated['nom_prenom'],
            'date_demande' => $validated['date_demande'],
            'liste_epi' => $validated['liste_epi'],
            'quantites' => $validated['quantites'],
            'tailles' => $validated['tailles'] ?? [],
            'pointures' => $validated['pointures'] ?? [],
        ]);

        return redirect()->route('ppe-requests.show', $ppeRequest)->with('success', 'Votre demande d\'EPI a été mise à jour avec succès.');
    }
}
