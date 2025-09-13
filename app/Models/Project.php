<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'name',
        'description',
        'site_id',
        'status',
        'start_date',
        'end_date',
        'budget',
        'project_manager'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2'
    ];

    /**
     * Get the site that owns the project.
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * Get the contractors for the project.
     */
    public function contractors(): HasMany
    {
        return $this->hasMany(Contractor::class);
    }
}
