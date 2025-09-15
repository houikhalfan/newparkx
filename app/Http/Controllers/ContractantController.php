<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ContractantController extends Controller
{
    public function home() {
        $contractor = auth('contractor')->user();
        return Inertia::render('Contractant/Home', [
            'contractor' => $contractor
        ]);
    }

    public function profile() {
        $contractor = auth('contractor')->user()->load('project');
        return Inertia::render('Contractant/Profile', [
            'contractor' => $contractor
        ]);
    }


    public function updateProfile(Request $request) {
        $contractor = auth('contractor')->user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:contractors,email,' . $contractor->id,
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
        ]);

        $contractor->update($request->only(['name', 'email', 'phone', 'company_name']));

        return back()->with('success', 'Profil mis à jour avec succès!');
    }

    public function updatePassword(Request $request) {
        $contractor = auth('contractor')->user();
        
        try {
            $request->validate([
                'current_password' => 'required',
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);

            if (!Hash::check($request->current_password, $contractor->password)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Le mot de passe actuel est incorrect. Veuillez vérifier et réessayer.'
                ], 422);
            }

            $contractor->update([
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Mot de passe modifié avec succès!'
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Les données fournies ne sont pas valides.',
                'validation_errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Une erreur est survenue. Veuillez réessayer.'
            ], 500);
        }
    }

    public function documents(Request $request) {
        $contractor = auth('contractor')->user()->load('project');
        
        // Get documents visible to contractors (only contractant, not public)
        $query = Document::whereJsonContains('visibility', 'contractant')
            ->with('admin')->latest();

        // Debug: Log the search parameters
        \Log::info('Documents search request', [
            'search' => $request->get('search'),
            'date' => $request->get('date'),
            'contractor_id' => $contractor->id
        ]);

        // Search
        if ($request->filled('search')) {
            $searchTerm = $request->get('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                  ->orWhere('description', 'like', '%' . $searchTerm . '%');
            });
        }

        // Date filter
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->get('date'));
        }

        $documents = $query->paginate(15);

        // Debug: Log the results
        \Log::info('Documents query results', [
            'total' => $documents->total(),
            'count' => $documents->count(),
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings()
        ]);

        return Inertia::render('Contractant/Documents/Index', [
            'documents' => $documents,
            'filters' => $request->only(['search', 'date']),
            'contractor' => $contractor
        ]);
    }

    public function stats() {
        return Inertia::render('Contractant/Stats/Index');
    }

    public function depot() {
        $contractor = auth('contractor')->user();
        // service name ideas: "Parapheur", "Dépôt & Signature", "SignLab", "e-Parapheur"
        return Inertia::render('Contractant/Depot/Index', [
            'serviceLabel' => 'Parapheur (Signature)',
            'contractor' => $contractor
        ]);
    }

    public function downloadDocument(Document $document) {
        // Check if document is visible to contractors (only contractant, not public)
        if (!in_array('contractant', $document->visibility)) {
            abort(403, 'Access denied');
        }

        $filePath = storage_path('app/public/' . $document->file_path);
        
        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->download($filePath, $document->original_filename);
    }
}
