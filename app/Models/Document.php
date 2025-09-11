<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'filename',
        'original_filename',
        'file_path',
        'file_type',
        'file_size',
        'visibility',
        'admin_id',
        'full_name',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'visibility' => 'array',
        'file_size' => 'integer',
    ];

    protected $appends = [
        'formatted_file_size',
        'file_url',
        'file_icon',
        'visibility_labels',
        'visibility_badges',
    ];

    /**
     * Get the admin that uploaded the document
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    /**
     * Get the file URL
     */
    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    /**
     * Get formatted file size
     */
    public function getFormattedFileSizeAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get file icon based on file type
     */
    public function getFileIconAttribute()
    {
        $type = $this->file_type;
        
        if (str_starts_with($type, 'image/')) {
            return '🖼️';
        } elseif ($type === 'application/pdf') {
            return '📄';
        } elseif (str_starts_with($type, 'text/')) {
            return '📝';
        } elseif (str_contains($type, 'word') || str_contains($type, 'document')) {
            return '📄';
        } elseif (str_contains($type, 'excel') || str_contains($type, 'spreadsheet')) {
            return '📊';
        } else {
            return '📎';
        }
    }

    /**
     * Get visibility labels
     */
    public function getVisibilityLabelsAttribute()
    {
        $labels = [
            'public' => 'Public',
            'private' => 'Private',
            'contractant' => 'Contractor',
        ];

        return array_map(fn($v) => $labels[$v] ?? $v, $this->visibility ?? []);
    }

    /**
     * Get visibility badges
     */
    public function getVisibilityBadgesAttribute()
    {
        $badges = [
            'public' => 'bg-green-100 text-green-800',
            'private' => 'bg-red-100 text-red-800',
            'contractant' => 'bg-blue-100 text-blue-800',
        ];

        return array_map(fn($v) => $badges[$v] ?? 'bg-gray-100 text-gray-800', $this->visibility ?? []);
    }

    /**
     * Check if document is visible to user type
     */
    public function isVisibleTo(string $userType): bool
    {
        if (empty($this->visibility)) {
            return false;
        }

        // Admin can see all documents
        if ($userType === 'admin') {
            return true;
        }

        // Check if user type is in visibility array
        return in_array($userType, $this->visibility) || in_array('public', $this->visibility);
    }

    /**
     * Scope for user type visibility
     */
    public function scopeForUserType($query, string $userType)
    {
        if ($userType === 'admin') {
            return $query; // Admin can see all
        }

        return $query->where(function ($q) use ($userType) {
            $q->whereJsonContains('visibility', 'public')
              ->orWhereJsonContains('visibility', $userType);
        });
    }
}