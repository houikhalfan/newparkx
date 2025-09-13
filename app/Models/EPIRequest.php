<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EPIRequest extends Model
{
    use HasFactory;

    protected $table = 'ppe_requests';

    protected $fillable = [
        'nom_prenom',
        'date_demande',
        'liste_epi',
        'quantites',
        'tailles',
        'pointures',
        'etat',
        'commentaires_admin',
        'user_id',
        'admin_id',
    ];

    protected $casts = [
        'date_demande' => 'date',
        'liste_epi' => 'array',
        'quantites' => 'array',
        'tailles' => 'array',
        'pointures' => 'array',
    ];

    protected $appends = [
        'formatted_epi_list',
    ];

    /**
     * Get the user who made the request
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who processed the request
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    /**
     * Get the status label in French
     */
    public function getEtatLabelAttribute()
    {
        return match($this->etat) {
            'en_cours' => 'En cours',
            'en_traitement' => 'En traitement',
            'done' => 'Terminé',
            'rejected' => 'Rejeté',
            default => $this->etat,
        };
    }

    /**
     * Get the status badge class
     */
    public function getEtatBadgeAttribute()
    {
        return match($this->etat) {
            'en_cours' => 'bg-yellow-100 text-yellow-800',
            'en_traitement' => 'bg-blue-100 text-blue-800',
            'done' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get formatted EPI list
     */
    public function getFormattedEpiListAttribute()
    {
        $epiList = $this->liste_epi ?? [];
        $quantites = $this->quantites ?? [];
        $tailles = $this->tailles ?? [];
        $pointures = $this->pointures ?? [];

        $formatted = [];
        foreach ($epiList as $index => $epi) {
            $formatted[] = [
                'epi' => $epi,
                'quantite' => $quantites[$index] ?? 1,
                'taille' => $tailles[$index] ?? null,
                'pointure' => $pointures[$index] ?? null,
            ];
        }

        return $formatted;
    }

    /**
     * Available EPI types
     */
    public static function getAvailableEpiTypes()
    {
        return [
            'Casque de sécurité',
            'Charlotte',
            'Protège nuque',
            'Jugulaire',
            'Lunette blanche',
            'Lunette Noire',
            'Surlunette Blanche',
            'Sur lunette Noire',
            'Masque Panoramique',
            'Cartouche masque panoramique',
            'Masque FPP2',
            'Masque anti poussière',
            'Polo',
            'T-shirt',
            'Gilet HV',
            'Parka',
            'Pantalon',
            'Chaussures de sécurité',
            'Botte de sécurité',
            'Harnais de sécurité',
        ];
    }

    /**
     * Available sizes
     */
    public static function getAvailableSizes()
    {
        return ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    }

    /**
     * Available shoe sizes
     */
    public static function getAvailablePointures()
    {
        return range(37, 45);
    }

    /**
     * Available statuses
     */
    public static function getAvailableStatuses()
    {
        return ['en_cours', 'en_traitement', 'done', 'rejected'];
    }
}