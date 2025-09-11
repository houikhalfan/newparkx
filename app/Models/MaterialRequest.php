<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialRequest extends Model
{
    // Use fillable instead of guarded
    protected $fillable = [
        'contractor_id',
        'site_id',
        'matricule', // ✅ added here
        'assigned_user_id',
        'controle_reglementaire_path',
        'assurance_path',
        'habilitation_conducteur_path',
        'rapports_conformite_path',
        'status',
        'qrcode_path',
        'qrcode_text',
        'decision_comment',
    ];

    // Expose absolute URL for QR code
    protected $appends = ['qr_png_url'];

    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function getQrPngUrlAttribute(): ?string
    {
        return $this->qrcode_path ? asset('storage/'.$this->qrcode_path) : null;
    }
}
