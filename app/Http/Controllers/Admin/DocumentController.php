<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents
     */
    public function index(Request $request)
    {
        $query = Document::with('admin')->latest();

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by visibility
        if ($request->filled('visibility')) {
            $query->whereJsonContains('visibility', $request->visibility);
        }

        $documents = $query->paginate(15);

        return Inertia::render('Admin/Documents/Index', [
            'documents' => $documents,
            'filters' => $request->only(['search', 'visibility']),
        ]);
    }

    /**
     * Show the form for creating a new document
     */
    public function create()
    {
        return Inertia::render('Admin/Documents/Create');
    }

    /**
     * Store a newly created document
     */
    public function store(Request $request)
    {
        // Debug: Log the incoming request
        \Log::info('Document upload request', [
            'data' => $request->all(),
            'files' => $request->files->all(),
            'admin_id' => \Auth::guard('admin')->id(),
        ]);

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'visibility' => ['required', 'array'],
            'visibility.*' => ['in:public,private,contractant'],
            'file' => ['required', 'file', 'max:102400'], // 100MB max
        ]);

        $admin = \Auth::guard('admin')->user();
        
        if (!$admin) {
            \Log::error('Admin not found', ['admin_id' => \Auth::guard('admin')->id()]);
            return redirect()->back()->withErrors(['error' => 'Admin not found']);
        }

        $file = $request->file('file');
        $originalFilename = $file->getClientOriginalName();
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        
        // Store file in public/documents directory
        $path = $file->storeAs('documents', $filename, 'public');

        try {
            $document = Document::create([
                'title' => $request->title,
                'description' => $request->description,
                'filename' => $filename,
                'original_filename' => $originalFilename,
                'file_path' => $path,
                'file_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'visibility' => $request->visibility,
                'admin_id' => $admin->id,
                'full_name' => $admin->email,
                'meta' => [
                    'uploaded_at' => now()->toISOString(),
                    'uploaded_by_ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
            ]);

            \Log::info('Document created successfully', ['document_id' => $document->id]);

            return redirect()->route('admin.documents.index')
                ->with('success', 'Document uploaded successfully!');
        } catch (\Exception $e) {
            \Log::error('Failed to create document', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return redirect()->back()
                ->withErrors(['error' => 'Failed to save document: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified document
     */
    public function show(Document $document)
    {
        return Inertia::render('Admin/Documents/Show', [
            'document' => $document,
        ]);
    }

    /**
     * Show the form for editing the specified document
     */
    public function edit(Document $document)
    {
        return Inertia::render('Admin/Documents/Edit', [
            'document' => $document,
        ]);
    }

    /**
     * Update the specified document
     */
    public function update(Request $request, Document $document)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'visibility' => ['required', 'array'],
            'visibility.*' => ['in:public,private,contractant'],
            'file' => ['nullable', 'file', 'max:102400'], // 100MB max
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'visibility' => $request->visibility,
        ];

        // Handle file replacement
        if ($request->hasFile('file')) {
            // Delete old file
            Storage::disk('public')->delete($document->file_path);
            
            $file = $request->file('file');
            $originalFilename = $file->getClientOriginalName();
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('documents', $filename, 'public');
            
            $data['filename'] = $filename;
            $data['original_filename'] = $originalFilename;
            $data['file_path'] = $path;
            $data['file_type'] = $file->getMimeType();
            $data['file_size'] = $file->getSize();
        }

        $document->update($data);

        return redirect()->route('admin.documents.show', $document)
            ->with('success', 'Document updated successfully!');
    }

    /**
     * Remove the specified document from storage
     */
    public function destroy(Document $document)
    {
        // Delete file from storage
        Storage::disk('public')->delete($document->file_path);
        
        // Delete document record
        $document->delete();

        return redirect()->route('admin.documents.index')
            ->with('success', 'Document deleted successfully!');
    }

    /**
     * Download the specified document
     */
    public function download(Document $document)
    {
        // Check access control
        $userType = $this->getCurrentUserType();
        if (!$document->isVisibleTo($userType)) {
            abort(403, 'Access denied');
        }

        $filePath = storage_path('app/public/' . $document->file_path);
        
        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->download($filePath, $document->original_filename);
    }


    /**
     * Get current user type for access control
     */
    private function getCurrentUserType(): string
    {
        if (\Auth::guard('admin')->check()) {
            return 'admin';
        }
        
        if (auth()->guard('contractor')->check()) {
            return 'contractor';
        }
        
        if (auth()->guard('web')->check()) {
            return 'user';
        }
        
        return 'guest';
    }

    /**
     * Bulk delete documents
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'documents' => ['required', 'array'],
            'documents.*' => ['exists:documents,id'],
        ]);

        $documents = Document::whereIn('id', $request->documents)->get();

        foreach ($documents as $document) {
            // Delete file from storage
            Storage::disk('public')->delete($document->file_path);
            // Delete document record
            $document->delete();
        }

        return redirect()->route('admin.documents.index')
            ->with('success', count($documents) . ' document(s) deleted successfully!');
    }
}