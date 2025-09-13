<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $q = trim($request->query('q', ''));
        $site = $request->query('site', '');
        $status = $request->query('status', '');

        // Add test data if no projects exist
        if (Project::count() === 0) {
            $this->createTestProjects();
        }

        $projects = Project::with('site')
            ->when(strlen($q) > 0, function ($query) use ($q) {
                $like = '%' . $q . '%';
                $query->where(function ($inner) use ($like) {
                    $inner
                        ->where('name', 'like', $like)
                        ->orWhere('description', 'like', $like)
                        ->orWhere('project_manager', 'like', $like)
                        ->orWhereHas('site', fn($sq) => $sq->where('name', 'like', $like));
                });
            })
            ->when(strlen($site) > 0, fn($query) => $query->where('site_id', $site))
            ->when(in_array($status, ['actif', 'en_cours', 'termine', 'suspendu']), function($query) use ($status) {
                // Handle both old English and new French status values
                if ($status === 'actif') {
                    $query->whereIn('status', ['actif', 'active']);
                } else {
                    $query->where('status', $status);
                }
            })
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString()
            ->through(function ($project) {
                // Convert old English status to French for display
                $statusMap = [
                    'active' => 'actif',
                    'completed' => 'termine',
                    'on_hold' => 'suspendu',
                    'cancelled' => 'annule'
                ];
                
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'status' => $statusMap[$project->status] ?? $project->status,
                    'start_date' => $project->start_date,
                    'end_date' => $project->end_date,
                    'budget' => $project->budget,
                    'project_manager' => $project->project_manager,
                    'created_at' => $project->created_at,
                    'site' => [
                        'id' => $project->site?->id,
                        'name' => $project->site?->name,
                    ],
                ];
            });

        $sites = Site::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'sites' => $sites,
            'filters' => $request->only(['q', 'site', 'status']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'csrf_token' => csrf_token(),
        ]);
    }

    public function create()
    {
        $sites = Site::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Projects/Create', [
            'sites' => $sites,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'site_id' => ['required', 'integer', 'exists:sites,id'],
            'status' => ['required', 'string', 'in:actif,en_cours,termine,suspendu'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget' => ['required', 'numeric', 'min:0'],
            'project_manager' => ['required', 'string', 'max:255'],
        ]);

        Project::create($data);

        return redirect()->route('admin.projects.index')->with('success', 'Projet créé avec succès.');
    }

    public function show(Project $project)
    {
        $project->load('site');

        return Inertia::render('Admin/Projects/Show', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'budget' => $project->budget,
                'project_manager' => $project->project_manager,
                'created_at' => $project->created_at,
                'updated_at' => $project->updated_at,
                'site' => [
                    'id' => $project->site?->id,
                    'name' => $project->site?->name,
                ],
            ],
        ]);
    }

    public function edit(Project $project)
    {
        $sites = Site::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Projects/Edit', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'site_id' => $project->site_id,
                'status' => $project->status,
                'start_date' => $project->start_date?->format('Y-m-d'),
                'end_date' => $project->end_date?->format('Y-m-d'),
                'budget' => $project->budget,
                'project_manager' => $project->project_manager,
            ],
            'sites' => $sites,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'site_id' => ['required', 'integer', 'exists:sites,id'],
            'status' => ['required', 'string', 'in:actif,en_cours,termine,suspendu'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget' => ['required', 'numeric', 'min:0'],
            'project_manager' => ['required', 'string', 'max:255'],
        ]);

        $project->update($data);

        return redirect()->route('admin.projects.index')->with('success', 'Projet mis à jour avec succès.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('admin.projects.index')->with('success', 'Projet supprimé avec succès.');
    }

    private function createTestProjects()
    {
        // Create sites if they don't exist
        $sites = [
            ['name' => 'Jorf lasfar'],
            ['name' => 'Bengeurir'],
            ['name' => 'Khouribgua'],
            ['name' => 'Mzinda'],
        ];

        $createdSites = [];
        foreach ($sites as $siteData) {
            $site = Site::firstOrCreate(
                ['name' => $siteData['name']],
                $siteData
            );
            $createdSites[$siteData['name']] = $site;
        }

        // Create test projects
        $projects = [
            [
                'name' => 'VRD et clôture',
                'description' => 'Travaux de Voirie et Réseaux Divers (VRD) incluant les routes, trottoirs, réseaux d\'eau et d\'électricité, ainsi que la pose de la clôture périphérique du site.',
                'site_id' => $createdSites['Jorf lasfar']->id,
                'status' => 'actif',
                'start_date' => '2024-05-15',
                'end_date' => '2024-11-30',
                'budget' => 4500000.00,
                'project_manager' => 'Karim El Amrani',
            ],
            [
                'name' => 'Canal',
                'description' => 'Construction et aménagement du canal de drainage des eaux pluviales pour la gestion des eaux de surface sur l\'ensemble du site.',
                'site_id' => $createdSites['Bengeurir']->id,
                'status' => 'actif',
                'start_date' => '2024-02-10',
                'end_date' => '2024-07-15',
                'budget' => 2200000.00,
                'project_manager' => 'Leila Benjelloun',
            ],
            [
                'name' => 'STEP',
                'description' => 'Projet de construction de la Station de Traitement des Eaux Usées (STEP) avec installation des équipements de traitement biologiques.',
                'site_id' => $createdSites['Khouribgua']->id,
                'status' => 'en_cours',
                'start_date' => '2024-01-05',
                'end_date' => '2024-10-20',
                'budget' => 9800000.00,
                'project_manager' => 'Dr. Youssef Khallouki',
            ],
            [
                'name' => 'Poste électrique',
                'description' => 'Construction d\'un poste de transformation électrique et déploiement du réseau de distribution moyenne tension pour l\'alimentation du site.',
                'site_id' => $createdSites['Mzinda']->id,
                'status' => 'termine',
                'start_date' => '2023-11-20',
                'end_date' => '2024-04-05',
                'budget' => 3750000.00,
                'project_manager' => 'Hicham Moussafir',
            ],
            [
                'name' => 'Vidéosurveillance et télécommunications',
                'description' => 'Installation d\'un système complet de vidéosurveillance (caméras IP, enregistreurs) et déploiement de l\'infrastructure de télécommunications (fibre optique, réseau LAN).',
                'site_id' => $createdSites['Jorf lasfar']->id,
                'status' => 'suspendu',
                'start_date' => '2024-03-01',
                'end_date' => '2024-06-15',
                'budget' => 1500000.00,
                'project_manager' => 'Sara Chennafi',
            ],
        ];

        foreach ($projects as $projectData) {
            Project::create($projectData);
        }
    }
}