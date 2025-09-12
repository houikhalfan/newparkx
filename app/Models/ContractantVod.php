<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class ContractantVod extends Model
{
    protected $table = 'contractant_vods';

    protected $fillable = [
        'contractor_id',
        'date', 'due_year', 'due_month', 'week_of_year', 'completed_at',
        'has_danger', 'danger_count', 'risk_breakdown',
        'pdf_path', 'thumb_path',
        'projet', 'activite', 'observateur',
        'personnes_observees', 'entreprise_observee',
        'pratiques', 'comportements', 'conditions', 'correctives',
    ];

    protected $casts = [
        'date'                 => 'date',
        'completed_at'         => 'datetime',
        'has_danger'           => 'boolean',
        'danger_count'         => 'integer',
        'risk_breakdown'       => 'array',
        'personnes_observees'  => 'array',
        'entreprise_observee'  => 'array',
        'pratiques'            => 'array',
        'comportements'        => 'array',
        'conditions'           => 'array',
        'correctives'          => 'array',
    ];

  

    public function getThumbUrlAttribute(): ?string
    {
        return $this->thumb_path ? asset('storage/' . ltrim($this->thumb_path, '/')) : null;
    }

public function getPdfUrlAttribute()
{
    return $this->pdf_path
        ? asset('storage/' . $this->pdf_path)
        : null;
}
}
