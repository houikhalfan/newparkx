<?php

namespace App\Notifications;

use App\Models\PPERequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PPERequestNotification extends Notification
{
    use Queueable;

    protected $ppeRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(PPERequest $ppeRequest)
    {
        $this->ppeRequest = $ppeRequest;
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
            'type' => 'ppe_request',
            'title' => 'Nouvelle Demande d\'EPI',
            'message' => "{$this->ppeRequest->user->name} a soumis une nouvelle demande d'EPI",
            'url' => route('admin.ppe-requests.show', $this->ppeRequest->id),
            'ppe_request_id' => $this->ppeRequest->id,
            'user_name' => $this->ppeRequest->user->name,
            'user_email' => $this->ppeRequest->user->email,
            'nom_prenom' => $this->ppeRequest->nom_prenom,
            'epi_count' => count($this->ppeRequest->liste_epi),
            'created_at' => $this->ppeRequest->created_at->toISOString(),
        ];
    }
}
