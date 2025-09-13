<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    protected $fillable = ['name', 'responsible_user_id', 'responsible_hse_id'];

    public function responsible()
    {
        return $this->belongsTo(\App\Models\User::class, 'responsible_user_id');
    }

    public function responsibleHse()
    {
        return $this->belongsTo(\App\Models\User::class, 'responsible_hse_id');
    }

    public function users()
    {
        return $this->hasMany(\App\Models\User::class, 'site_id');
    }

    protected $appends = ['manager_user_id'];

    public function getManagerUserIdAttribute()
    {
        return $this->responsible_user_id;
    }
    public function permisExcavations()
{
    return $this->hasMany(PermisExcavation::class, 'site_id');
}

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

}
