<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Auth\Passwords\CanResetPassword;
use App\Notifications\AdminResetPassword;

class Admin extends Authenticatable implements CanResetPasswordContract
{
    use Notifiable, CanResetPassword;

    protected $table = 'admins';
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden   = ['password', 'remember_token'];

public function sendPasswordResetNotification($token): void
{
    $this->notify(new \App\Notifications\AdminResetPassword($token));
}
}
