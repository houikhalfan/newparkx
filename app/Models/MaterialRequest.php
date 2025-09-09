<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialRequest extends Model
{
    // We don't need HasFactory here.
    protected $guarded = [];

    // Expose an absolute URL for the QR to the frontend
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
