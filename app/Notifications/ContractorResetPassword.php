<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ContractorResetPassword extends Notification
{
    public string $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Réinitialisation de mot de passe - Compte Contractant')
            ->line('Vous recevez cet e-mail car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte contractant.')
            ->action('Réinitialiser le mot de passe', url("/contractant/password/reset/{$this->token}?email={$notifiable->email}"))
            ->line("Si vous n'avez pas demandé cette réinitialisation, aucune action supplémentaire n'est requise.");
    }
}
