<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class PermisTravailChaud extends Model
{
    use HasFactory;

    // FIX: Use the actual table name from your database
    protected $table = 'permis_travail_chauds';

    protected $fillable = [
        'numero_permis',
        'site_id',
        'date_debut',
        'date_fin',
        'description_tache',
        'plan_securitaire_par',
        'date_plan_securitaire',
        'contractant_demandeur',
        'contractant_travail',
        'meme_que_demandeur',
        'activites',
        'activite_autre',
        'dangers',
        'danger_autre',
        'protection_physique',
        'protection_physique_autre',
        'protection_respiratoire',
        'protection_incendie',
        'protection_incendie_autre',
        'equipement_inspection',
        'permis_requis',
        'surveillance_requise',
        'commentaires',
        'aucun_commentaire',
        'resp_construction_nom',
        'resp_construction_date',
        'resp_construction_signature',
        'resp_hse_nom',
        'resp_hse_date',
        'resp_hse_signature',
        'cm_parkx_nom',
        'cm_parkx_date',
        'cm_parkx_signature',
        'hse_parkx_nom',
        'hse_parkx_date',
        'hse_parkx_signature',
        'status',
        'created_by',
        'soumis_le',
        'approuve_le',
        'ferme_le',
        'pdf_signed',

    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'date_plan_securitaire' => 'date',
        'resp_construction_date' => 'date',
        'resp_hse_date' => 'date',
        'cm_parkx_date' => 'date',
        'hse_parkx_date' => 'date',
        'meme_que_demandeur' => 'boolean',
        'aucun_commentaire' => 'boolean',
        'activites' => 'array',
        'dangers' => 'array',
        'protection_physique' => 'array',
        'protection_respiratoire' => 'array',
        'protection_incendie' => 'array',
        'equipement_inspection' => 'array',
        'permis_requis' => 'array',
        'surveillance_requise' => 'array',
        'soumis_le' => 'datetime',
        'approuve_le' => 'datetime',
        'ferme_le' => 'datetime',
    ];

    // ---------------- Relations ----------------
    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ---------------- Scopes ----------------
    public function scopeEnAttente($query)
    {
        return $query->where('status', 'en_attente');
    }

    public function scopeEnCours($query)
    {
        return $query->where('status', 'en_cours');
    }

    public function scopeRejete($query)
    {
        return $query->where('status', 'rejete');
    }

    public function scopeSigne($query)
    {
        return $query->where('status', 'signe');
    }

    public function scopeActifs($query)
    {
        return $query->where('status', 'signe');
    }
protected function pdfSignedUrl(): Attribute
{
    return Attribute::make(
        get: fn () => $this->pdf_signed 
            ? asset('storage/' . ltrim($this->pdf_signed, '/'))
            : null,
    );
}
    // ---------------- Méthodes utilitaires ----------------
    public function soumettre()
    {
        $this->update([
            'status' => 'en_attente',
            'soumis_le' => now(),
        ]);
    }

    public function approuver()
    {
        $this->update([
            'status' => 'signe',
            'approuve_le' => now(),
        ]);
    }

    public function demarrer()
    {
        $this->update([
            'status' => 'en_cours',
        ]);
    }

    public function rejeter()
    {
        $this->update([
            'status' => 'rejete',
        ]);
    }

    public function fermer()
    {
        $this->update([
            'ferme_le' => now(),
        ]);
    }

    // ---------------- Génération du numero_permis ----------------
    public function generatePermitNumber(): string
    {
        $timestamp = now()->getTimestamp();
        return "CHAUD-" . substr($timestamp, -6);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($permit) {
            if (empty($permit->numero_permis)) {
                $permit->numero_permis = $permit->generatePermitNumber();
            }
            
            // Définir le statut initial
            if (empty($permit->status)) {
                $permit->status = 'en_attente';
            }

            // Définir l'utilisateur créateur
            if (empty($permit->created_by) && auth()->check()) {
                $permit->created_by = auth()->id();
            }
        });
    }

    // ---------------- Accesseurs pour les URLs des fichiers ----------------
    protected function respConstructionSignatureUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFileUrl($this->resp_construction_signature),
        );
    }

    protected function respHseSignatureUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFileUrl($this->resp_hse_signature),
        );
    }

    protected function cmParkxSignatureUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFileUrl($this->cm_parkx_signature),
        );
    }

    protected function hseParkxSignatureUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFileUrl($this->hse_parkx_signature),
        );
    }

    private function getFileUrl($file)
    {
        if (!$file) return null;
        
        return filter_var($file, FILTER_VALIDATE_URL) 
            ? $file 
            : asset('storage/' . $file);
    }

    // ---------------- Helpers ----------------
    public function getEstExpireAttribute()
    {
        return $this->ferme_le && $this->ferme_le < now();
    }

    public function getEstEnCoursAttribute()
    {
        return $this->status === 'en_cours';
    }

    public function getStatutCouleurAttribute()
    {
        return match($this->status) {
            'en_attente' => 'blue',
            'en_cours' => 'green', 
            'rejete' => 'red',
            'signe' => 'purple',
            default => 'gray'
        };
    }

    public function getStatutLibelleAttribute()
    {
        return match($this->status) {
            'en_attente' => 'En attente',
            'en_cours' => 'En cours',
            'rejete' => 'Rejeté',
            'signe' => 'Signé',
            default => 'Inconnu'
        };
    }

    // ---------------- Méthodes pour les signatures ----------------
    public function hasContractantSignatures()
    {
        return $this->resp_construction_signature && $this->resp_hse_signature;
    }

    public function hasParkxSignatures()
    {
        return $this->cm_parkx_signature && $this->hse_parkx_signature;
    }

    public function isComplet()
    {
        return $this->hasContractantSignatures() && $this->hasParkxSignatures();
    }

    // ---------------- Méthodes pour les activités et dangers ----------------
    public function getActivitesListAttribute()
    {
        $activitesOptions = [
            'soudage_arc' => "Soudage à l'arc",
            'decoupage_arc' => "Découpage à l'arc",
            'soudage_mig' => "Soudage MIG",
            'soudage_tig' => "Soudage TIG",
            'decoupage_plasma' => "Découpage au plasma",
            'brasage_soudure' => "Brasage/Soudure",
            'oxysoudage' => "Oxysoudage",
            'oxycoupage' => "Oxycoupage",
            'decoupage_mecanique' => "Découpage/moulage mécanique",
            'autre' => "Autre",
        ];

        return collect($this->activites)
            ->map(fn($key) => $activitesOptions[$key] ?? $key)
            ->join(', ');
    }

    public function getDangersListAttribute()
    {
        $dangersOptions = [
            'inflammable_11m' => "Matériel ou produit inflammable à moins de 11m",
            'produits_chimiques' => "Présence de produits chimiques",
            'travail_machinerie' => "Travail à chaud sur machinerie/équipement",
            'couverture_plancher' => "Couverture dans le plancher",
            'poussieres_inflammables' => "Présence de poussières inflammables/combustibles",
            'espace_confine' => "Travail en espace confiné",
            'chaleur_rayonnante' => "Chaleur rayonnante se propageant à des matières combustibles",
            'faible_oxygene' => "Faible concentration en oxygène",
            'autre' => "Autre",
        ];

        return collect($this->dangers)
            ->map(fn($key) => $dangersOptions[$key] ?? $key)
            ->join(', ');
    }
}