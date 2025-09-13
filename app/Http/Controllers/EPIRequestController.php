<?php

namespace App\Http\Controllers;

use App\Models\EPIRequest;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EPIRequestController extends Controller
{
    /**
     * Display the EPI request form.
     */
    public function index()
    {
        $availableEpiTypes = EPIRequest::getAvailableEpiTypes();
        $availableSizes = EPIRequest::getAvailableSizes();
        $availablePointures = EPIRequest::getAvailablePointures();

        return Inertia::render('EPIRequests/Index', [
            'availableEpiTypes' => $availableEpiTypes,
            'availableSizes' => $availableSizes,
            'availablePointures' => $availablePointures,
        ]);
    }

    /**
     * Store a new EPI request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_prenom' => 'required|string|max:255',
            'date_demande' => 'required|date',
            'liste_epi' => 'required|array|min:1',
            'liste_epi.*' => 'required|string|in:' . implode(',', EPIRequest::getAvailableEpiTypes()),
            'quantites' => 'required|array',
            'quantites.*' => 'required|integer|min:1|max:10',
            'tailles' => 'nullable|array',
            'tailles.*' => 'nullable|string|in:' . implode(',', EPIRequest::getAvailableSizes()),
            'pointures' => 'nullable|array',
            'pointures.*' => 'nullable|integer|in:' . implode(',', EPIRequest::getAvailablePointures()),
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

        $epiRequest = EPIRequest::create([
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
            $admin->notify(new \App\Notifications\EPIRequestNotification($epiRequest));
        }

        return redirect()->route('epi-requests.history')->with('success', 'Votre demande d\'EPI a été soumise avec succès.');
    }

    /**
     * Display user's EPI request history.
     */
    public function history()
    {
        $epiRequests = EPIRequest::where('user_id', Auth::id())
            ->with('admin')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('EPIRequests/History', [
            'epiRequests' => $epiRequests,
            'flash' => session()->get('flash', []),
        ]);
    }

    /**
     * Display the specified EPI request for the user.
     */
    public function show(EPIRequest $epiRequest)
    {
        // Ensure the user can only view their own requests
        if ($epiRequest->user_id !== Auth::id()) {
            abort(403, 'Access denied');
        }

        $epiRequest->load('admin');
        
        return Inertia::render('EPIRequests/Show', [
            'epiRequest' => $epiRequest,
            'availableEpiTypes' => EPIRequest::getAvailableEpiTypes(),
            'availableSizes' => EPIRequest::getAvailableSizes(),
            'availablePointures' => EPIRequest::getAvailablePointures(),
        ]);
    }

    /**
     * Show the form for editing the specified EPI request.
     */
    public function edit(EPIRequest $epiRequest)
    {
        // Ensure the user can only edit their own requests
        if ($epiRequest->user_id !== Auth::id()) {
            abort(403, 'Access denied');
        }

        // Only allow editing if request is still "en cours"
        if ($epiRequest->etat !== 'en_cours') {
            return redirect()->route('epi-requests.show', $epiRequest)->with('error', 'Vous ne pouvez modifier que les demandes en cours.');
        }

        $epiRequest->load('admin');
        
        return Inertia::render('EPIRequests/Edit', [
            'epiRequest' => $epiRequest,
            'availableEpiTypes' => EPIRequest::getAvailableEpiTypes(),
            'availableSizes' => EPIRequest::getAvailableSizes(),
            'availablePointures' => EPIRequest::getAvailablePointures(),
        ]);
    }

    /**
     * Update the specified EPI request.
     */
    public function update(Request $request, EPIRequest $epiRequest)
    {
        // Ensure the user can only update their own requests
        if ($epiRequest->user_id !== Auth::id()) {
            abort(403, 'Access denied');
        }

        // Only allow updating if request is still "en cours"
        if ($epiRequest->etat !== 'en_cours') {
            return redirect()->route('epi-requests.show', $epiRequest)->with('error', 'Vous ne pouvez modifier que les demandes en cours.');
        }

        $validated = $request->validate([
            'nom_prenom' => 'required|string|max:255',
            'date_demande' => 'required|date',
            'liste_epi' => 'required|array|min:1',
            'liste_epi.*' => 'required|string|in:' . implode(',', EPIRequest::getAvailableEpiTypes()),
            'quantites' => 'required|array',
            'quantites.*' => 'required|integer|min:1|max:10',
            'tailles' => 'nullable|array',
            'tailles.*' => 'nullable|string|in:' . implode(',', EPIRequest::getAvailableSizes()),
            'pointures' => 'nullable|array',
            'pointures.*' => 'nullable|integer|in:' . implode(',', EPIRequest::getAvailablePointures()),
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

        $epiRequest->update([
            'nom_prenom' => $validated['nom_prenom'],
            'date_demande' => $validated['date_demande'],
            'liste_epi' => $validated['liste_epi'],
            'quantites' => $validated['quantites'],
            'tailles' => $validated['tailles'] ?? [],
            'pointures' => $validated['pointures'] ?? [],
        ]);

        return redirect()->route('epi-requests.show', $epiRequest)->with('success', 'Votre demande d\'EPI a été mise à jour avec succès.');
    }
}
