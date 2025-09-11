<?php

namespace App\Http\Controllers\Contractant;

use App\Http\Controllers\Controller;
use App\Models\PermisExcavation;
use Inertia\Inertia;

class PermisExcavationSuiviController extends Controller
{
    public function index()
    {
        // Later, filter by logged-in contractant (auth user)
        $permis = PermisExcavation::latest()->get();

        return Inertia::render('Contractant/SuiviPermis', [
            'permis' => $permis,
        ]);
    }

    public function show(PermisExcavation $permisExcavation)
    {
        return Inertia::render('Contractant/PermisDetail', [
            'permis' => $permisExcavation,
        ]);
    }
}
