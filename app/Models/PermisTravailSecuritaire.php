<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class PermisTravailSecuritaire extends Model
{
    use HasFactory;

    protected $table = 'permis_travail_securitaire';

    protected $fillable = [
        'numero_permis',
        'site_id',
        'duree_de',
        'duree_a',
        'description',
        'plan_securitaire_par',
        'date_analyse',
        'demandeur',
        'contractant',
        'meme_que_demandeur',
        'activites',
        'activite_autre',
        'permis_supp',
        'dangers',
        'danger_autre',
        'epi_sans_additionnel',
        'epi_chimique',
        'epi_respiratoire',
        'equip_comms',
        'equip_barrieres',
        'equip_qualite_air',
        'equip_etincelles',
        'commentaires',
        'confirmation_travail',
        'confirmation_conditions',
        'confirmation_equipement',
        'confirmation_epi',
        'sig_resp_construction_nom',
        'sig_resp_construction_date',
        'sig_resp_construction_file',
        'sig_resp_hse_nom',
        'sig_resp_hse_date',
        'sig_resp_hse_file',
        'cm_parkx_nom',
        'cm_parkx_date',
        'cm_parkx_file',
        'hse_parkx_nom',
        'hse_parkx_date',
        'hse_parkx_file',
        'fermeture_q1',
        'fermeture_q2',
        'fermeture_q3',
        'fermeture_suivi',
        'statut',
        'created_by',
        'soumis_le',
        'approuve_le',
        'ferme_le',
    ];

    protected $casts = [
        'duree_de' => 'date',
        'duree_a' => 'date',
        'date_analyse' => 'date',
        'sig_resp_construction_date' => 'date',
        'sig_resp_hse_date' => 'date',
        'cm_parkx_date' => 'date',
        'hse_parkx_date' => 'date',
        'meme_que_demandeur' => 'boolean',
        'epi_sans_additionnel' => 'boolean',
        'confirmation_travail' => 'boolean',
        'confirmation_conditions' => 'boolean',
        'confirmation_equipement' => 'boolean',
        'confirmation_epi' => 'boolean',
        'fermeture_q1' => 'boolean',
        'fermeture_q2' => 'boolean',
        'fermeture_q3' => 'boolean',
        'activites' => 'array',
        'permis_supp' => 'array',
        'dangers' => 'array',
        'epi_chimique' => 'array',
        'epi_respiratoire' => 'array',
        'equip_comms' => 'array',
        'equip_barrieres' => 'array',
        'equip_qualite_air' => 'array',
        'equip_etincelles' => 'array',
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
    public function scopeBrouillon($query)
    {
        return $query->where('statut', 'brouillon');
    }

    public function scopeSoumis($query)
    {
        return $query->where('statut', 'soumis');
    }

    public function scopeApprouve($query)
    {
        return $query->where('statut', 'approuve');
    }

    public function scopeEnCours($query)
    {
        return $query->where('statut', 'approuve')
                     ->where('duree_a', '>=', now());
    }

    // ---------------- Méthodes utilitaires ----------------
    public function soumettre()
    {
        $this->update([
            'statut' => 'soumis',
            'soumis_le' => now(),
        ]);
    }

    public function approuver()
    {
        $this->update([
            'statut' => 'approuve',
            'approuve_le' => now(),
        ]);
    }

    public function rejeter()
    {
        $this->update([
            'statut' => 'rejete',
        ]);
    }

    public function fermer()
    {
        $this->update([
            'statut' => 'ferme',
            'ferme_le' => now(),
        ]);
    }

    // ---------------- Génération du numero_permis ----------------
    public function generatePermitNumber(string $contractorName = null): string
    {
        $timestamp = now()->getTimestamp();
        $contractorName = $contractorName ?: ($this->contractant ?: 'CTR');

        // Initiales max 3 lettres
        $initials = collect(explode(' ', $contractorName))
            ->map(fn($word) => strtoupper(substr($word, 0, 1)))
            ->join('');
        $initials = substr($initials, 0, 3) ?: 'CTR';

        return "PX-{$initials}-" . substr($timestamp, -6);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($permit) {
            if (empty($permit->numero_permis)) {
                $contractorName = $permit->contractant ?: 'Contractant';
                $permit->numero_permis = $permit->generatePermitNumber($contractorName);
            }
            
            // Définir le statut initial
            if (empty($permit->statut)) {
                $permit->statut = 'brouillon';
            }
        });
    }

    // ---------------- Accesseurs pour les URLs des fichiers ----------------
    protected function sigRespConstructionFileUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFileUrl($this->sig_resp_construction_file),
        );
    }

    protected function sigRespHseFileUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFileUrl($this->sig_resp_hse_file),
        );
    }

    protected function cmParkxFileUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFileUrl($this->cm_parkx_file),
        );
    }

    protected function hseParkxFileUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFileUrl($this->hse_parkx_file),
        );
    }

    private function getFileUrl($file)
    {
        if (!$file) return null;
        
        return filter_var($file, FILTER_VALIDATE_URL) 
            ? $file 
            : asset('storage/signatures/' . $file);
    }

    // ---------------- Helpers ----------------
    public function getEstExpireAttribute()
    {
        return $this->duree_a < now();
    }

    public function getEstEnCoursAttribute()
    {
        return $this->statut === 'approuve' &&
               $this->duree_de <= now() &&
               $this->duree_a >= now();
    }

    public function getStatutCouleurAttribute()
    {
        return match($this->statut) {
            'brouillon' => 'gray',
            'soumis' => 'blue',
            'approuve' => 'green',
            'rejete' => 'red',
            'ferme' => 'purple',
            default => 'gray'
        };
    }
}