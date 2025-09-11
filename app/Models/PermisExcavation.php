<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PermisExcavation extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_permis_general',
        'numero_permis',
        'site_id',
        'duree_de',
        'duree_a',
        'description',
        'analyse_par',
        'date_analyse',
        'demandeur',
        'contractant',
        'excavation_est',
        'conduites',
        'situations',
        'situation_autre',
        'danger_aucun',
        'epi_sans_additionnel',
        'epi_simples',
        'epi_autre',
        'equip_non_requis',
        'equip_checks',
        'equip_autre',
        'aucun_commentaire',
        'commentaires',
        'proprietaire_nom',
        'proprietaire_signature',
        'proprietaire_date',
        'sig_resp_construction_nom',
        'sig_resp_construction_date',
        'sig_resp_construction_file',
        'sig_resp_hse_nom',
        'sig_resp_hse_date',
        'sig_resp_hse_file',

        // newly added
        'status',
        'pdf_original',
        'pdf_signed',
        'commentaire',
    ];

    protected $casts = [
        'excavation_est' => 'array',
        'conduites' => 'array',
        'situations' => 'array',
        'epi_simples' => 'array',
        'equip_checks' => 'array',
        'danger_aucun' => 'boolean',
        'epi_sans_additionnel' => 'boolean',
        'equip_non_requis' => 'boolean',
        'aucun_commentaire' => 'boolean',
    ];
    public function site()
    {
        return $this->belongsTo(Site::class, 'site_id');
    }
}
