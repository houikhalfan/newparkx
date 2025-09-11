<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractantController extends Controller
{
    public function home() {
        $contractor = auth('contractor')->user();
        return Inertia::render('Contractant/Home', [
            'contractor' => $contractor
        ]);
    }

    public function documents(Request $request) {
        $contractor = auth('contractor')->user();
        
        // Get documents visible to contractors (only contractant, not public)
        $query = Document::whereJsonContains('visibility', 'contractant')
            ->with('admin')->latest();

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $documents = $query->paginate(15);

        return Inertia::render('Contractant/Documents/Index', [
            'documents' => $documents,
            'filters' => $request->only(['search']),
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
