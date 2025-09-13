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
        'cm_parkx_nom',
        'cm_parkx_date',
        'cm_parkx_file',
        'autor_q1',
        'autor_q2',
        'autor_q3',

        // useful tracking
        'hse_parkx_nom',
        'hse_parkx_date',
        'hse_parkx_file',
        'pdf_signed',
            'pdf_original',   // 👈 add this

        'status',
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

        'autor_q1' => 'boolean',
        'autor_q2' => 'boolean',
        'autor_q3' => 'boolean',

        // 👇 only the date needs casting
        'hse_parkx_date' => 'date',
    ];

    public function site()
    {
        return $this->belongsTo(Site::class, 'site_id');
    }
}
