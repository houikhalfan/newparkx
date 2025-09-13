<?php

namespace App\Notifications;

use App\Models\EPIRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EPIRequestNotification extends Notification
{
    use Queueable;

    protected $epiRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(EPIRequest $epiRequest)
    {
        $this->epiRequest = $epiRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'epi_request',
            'title' => 'Nouvelle Demande d\'EPI',
            'message' => "{$this->epiRequest->user->name} a soumis une nouvelle demande d'EPI",
            'url' => route('admin.epi-requests.show', $this->epiRequest->id),
            'epi_request_id' => $this->epiRequest->id,
            'user_name' => $this->epiRequest->user->name,
            'user_email' => $this->epiRequest->user->email,
            'nom_prenom' => $this->epiRequest->nom_prenom,
            'epi_count' => count($this->epiRequest->liste_epi),
            'created_at' => $this->epiRequest->created_at->toISOString(),
        ];
    }
}
