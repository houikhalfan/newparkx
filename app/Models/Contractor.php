<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Auth\Passwords\CanResetPassword;

class Contractor extends Authenticatable implements CanResetPasswordContract
{
    use Notifiable, CanResetPassword;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'company_name',
        'role',
        'is_approved',
    ];

    protected $hidden = ['password', 'remember_token'];
    public function sendPasswordResetNotification($token): void
{
    $this->notify(new \App\Notifications\ContractorResetPassword($token));
}

}
