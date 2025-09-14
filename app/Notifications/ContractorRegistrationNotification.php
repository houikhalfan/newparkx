<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Contractor;

class ContractorRegistrationNotification extends Notification
{
    use Queueable;

    protected $contractor;

    /**
     * Create a new notification instance.
     */
    public function __construct(Contractor $contractor)
    {
        $this->contractor = $contractor;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $contractorName = $this->contractor->name;
        $companyName = $this->contractor->company_name ?? 'Non spécifiée';
        $email = $this->contractor->email;
        $phone = $this->contractor->phone ?? 'Non spécifié';
        $role = $this->contractor->role ?? 'Non spécifié';
        
        return (new MailMessage)
            ->subject('Nouvelle Demande d\'Inscription - ' . $companyName)
            ->greeting('Bonjour,')
            ->line('Une nouvelle demande d\'inscription de contractant a été soumise et nécessite votre approbation.')
            ->line('**Détails du contractant:**')
            ->line('- Nom: ' . $contractorName)
            ->line('- Email: ' . $email)
            ->line('- Téléphone: ' . $phone)
            ->line('- Entreprise: ' . $companyName)
            ->line('- Rôle: ' . $role)
            ->line('- Date de demande: ' . $this->contractor->created_at->format('d/m/Y à H:i'))
            ->action('Approuver la demande', route('admin.dashboard'))
            ->line('Merci d\'utiliser ParkX!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Nouvelle Demande d\'Inscription',
            'message' => $this->contractor->name . ' (' . ($this->contractor->company_name ?? 'Entreprise non spécifiée') . ') a soumis une demande d\'inscription',
            'type' => 'contractor_registration',
            'contractor_id' => $this->contractor->id,
            'contractor_name' => $this->contractor->name,
            'company_name' => $this->contractor->company_name,
            'email' => $this->contractor->email,
            'phone' => $this->contractor->phone,
            'role' => $this->contractor->role,
            'created_at' => $this->contractor->created_at->format('d/m/Y à H:i'),
            'url' => route('admin.dashboard'),
        ];
    }
}
