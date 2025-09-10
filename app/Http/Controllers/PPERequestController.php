<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PPERequestController extends Controller
{
    /**
     * Display the PPE requests page.
     */
    public function index()
    {
        return Inertia::render('PPERequests/Index');
    }
}
