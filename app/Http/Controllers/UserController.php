<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function documents(Request $request) {
        // Get documents visible to ParkX users (only public)
        $query = Document::whereJsonContains('visibility', 'public')
            ->with('admin')->latest();

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $documents = $query->paginate(15);

        return Inertia::render('User/Documents/Index', [
            'documents' => $documents,
            'filters' => $request->only(['search']),
        ]);
    }

    public function downloadDocument(Document $document) {
        // Check if document is visible to ParkX users (only public)
        if (!$document->isVisibleTo('user')) {
            abort(403, 'Access denied');
        }

        $filePath = storage_path('app/public/' . $document->file_path);
        
        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->download($filePath, $document->original_filename);
    }
}
