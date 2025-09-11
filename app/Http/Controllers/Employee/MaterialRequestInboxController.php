<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\MaterialRequest as MR;
use App\Models\Site;

class MaterialRequestInboxController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $q = (string) $request->query('q', '');
        $s = (string) $request->query('s', '');

        // ✅ Show all requests assigned to the employee OR linked to a site they manage
        $items = MR::with(['contractor:id,name,email', 'site:id,name'])
            ->where(function ($qb) use ($user) {
                $qb->where('assigned_user_id', $user->id)
                   ->orWhereIn('site_id', Site::where('responsible_user_id', $user->id)->pluck('id'));
            })
            ->when(strlen($q) > 0, function ($qb) use ($q) {
                $like = '%' . $q . '%';
                $qb->where(function ($inner) use ($like) {
                    $inner->orWhereHas('site', fn($sq) => $sq->where('name', 'like', $like))
                          ->orWhereHas('contractor', fn($cq) => $cq->where('name', 'like', $like)
                          ->orWhere('email', 'like', $like))
                          ->orWhere('matricule', 'like', $like); // ✅ Search by matricule too
                });
            })
            ->when(in_array($s, ['pending', 'accepted', 'rejected']), fn($qb) => $qb->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Employee/Material/Index', [
            'items' => $items,
            'q' => $q,
            's' => $s,
        ]);
    }

    public function show(Request $request, int $id)
    {
        $user = $request->user();

        $req = MR::with(['contractor:id,name,email', 'site:id,name'])
            ->where(function ($qb) use ($user) {
                $qb->where('assigned_user_id', $user->id)
                   ->orWhereIn('site_id', Site::where('responsible_user_id', $user->id)->pluck('id'));
            })
            ->findOrFail($id);

        return Inertia::render('Employee/Material/Show', [
            'req' => $req,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function accept(Request $request, int $id)
    {
        $user = $request->user();
        $data = $request->validate([
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $mr = MR::with('contractor')->findOrFail($id);

        $qrText = "ENGIN conforme\n"
            . "Contractant: " . ($mr->contractor->name ?? 'N/A') . "\n"
            . "Matricule: " . ($mr->matricule ?? 'N/A') . "\n"
            . "Date: " . now()->format('Y-m-d');

        $hasImagick = extension_loaded('imagick') && class_exists(\Imagick::class);

        $qrBinary = QrCode::format($hasImagick ? 'png' : 'svg')
            ->size($hasImagick ? 800 : 300)
            ->margin(1)
            ->encoding('UTF-8')
            ->errorCorrection('M')
            ->generate($qrText);

        $relPath = 'qrcodes/material/' . $mr->id . '-' . Str::uuid() . '.' . ($hasImagick ? 'png' : 'svg');
        Storage::disk('public')->put($relPath, $qrBinary);

        $mr->update([
            'status'             => 'accepted',
            'decided_at'         => now(),
            'decided_by_user_id' => $user->id,
            'decision_comment'   => $data['comment'] ?? null,
            'qrcode_path'        => $relPath,
            'qrcode_text'        => $qrText,
        ]);

        return back()->with('swal', [
            'type' => 'success',
            'text' => 'Demande acceptée et QR généré.',
        ]);
    }

    public function reject(Request $request, int $id)
    {
        $user = $request->user();
        $data = $request->validate([
            'comment' => ['required', 'string', 'max:2000'],
        ]);

        $mr = MR::findOrFail($id);
        $mr->update([
            'status'            => 'rejected',
            'decided_at'        => now(),
            'decided_by_user_id'=> $user->id,
            'decision_comment'  => $data['comment'],
        ]);

        return back()->with('swal', ['type' => 'success', 'text' => 'Demande refusée.']);
    }

    public function download(Request $request, int $id, string $field)
    {
        $user = $request->user();
        $allowed = ['controle_reglementaire', 'assurance', 'habilitation_conducteur', 'rapports_conformite'];
        abort_unless(in_array($field, $allowed, true), 404);

        $mr = MR::findOrFail($id);
        $path = $mr->{$field . '_path'} ?? null;
        abort_unless($path, 404);

        return Storage::disk('public')->download($path);
    }
}
