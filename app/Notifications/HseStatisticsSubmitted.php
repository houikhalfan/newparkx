<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\HseStat;

class HseStatisticsSubmitted extends Notification
{
    use Queueable;

    protected $hseStat;
    protected $action;

    /**
     * Create a new notification instance.
     */
    public function __construct(HseStat $hseStat, $action = 'submitted')
    {
        $this->hseStat = $hseStat;
        $this->action = $action;
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
        $contractorName = $this->hseStat->contractor->company_name ?? $this->hseStat->contractor->name ?? 'Contractant';
        
        $isModified = $this->action === 'modified';
        $subject = $isModified ? 'Statistiques HSE Modifiées - ' . $this->hseStat->site : 'Nouvelles Statistiques HSE Soumises - ' . $this->hseStat->site;
        $actionText = $isModified ? 'modifiées' : 'soumises';
        $detailsText = $isModified ? 'Détails de la modification:' : 'Détails de la soumission:';
        
        $message = (new MailMessage)
            ->subject($subject)
            ->greeting('Bonjour,')
            ->line('Les statistiques HSE ont été ' . $actionText . ' par ' . $contractorName . '.')
            ->line('**' . $detailsText . '**')
            ->line('- Site: ' . $this->hseStat->site)
            ->line('- Date: ' . $this->hseStat->date->format('d/m/Y'))
            ->line('- Personnel: ' . $this->hseStat->effectif_personnel . ' personnes')
            ->line('- Heures totales: ' . $this->hseStat->total_heures . ' heures')
            ->line('- TRIR: ' . $this->hseStat->trir)
            ->line('- LTIR: ' . $this->hseStat->ltir)
            ->line('- DART: ' . $this->hseStat->dart);
            
        // Add modification date for modifications
        if ($isModified) {
            $message->line('- Modifié le: ' . $this->hseStat->updated_at->format('d/m/Y à H:i'));
        }
        
        return $message
            ->action('Voir les détails', route('admin.hse-statistics.show', $this->hseStat->id))
            ->line('Merci d\'utiliser ParkX!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $contractorName = $this->hseStat->contractor->company_name ?? $this->hseStat->contractor->name ?? 'Contractant';
        
        $isModified = $this->action === 'modified';
        $title = $isModified ? 'Statistiques HSE Modifiées' : 'Nouvelles Statistiques HSE Soumises';
        $actionText = $isModified ? 'modifié' : 'soumis';
        
        $notificationData = [
            'title' => $title,
            'message' => $contractorName . ' a ' . $actionText . ' des statistiques HSE pour le site ' . $this->hseStat->site,
            'type' => 'hse_statistics',
            'action' => $this->action,
            'hse_stat_id' => $this->hseStat->id,
            'site' => $this->hseStat->site,
            'contractor' => $contractorName,
            'date' => $this->hseStat->date->format('d/m/Y'),
            'url' => route('admin.hse-statistics.show', $this->hseStat->id),
        ];
        
        // Add modification date for modifications
        if ($isModified) {
            $notificationData['modified_at'] = $this->hseStat->updated_at->format('d/m/Y à H:i');
            $notificationData['message'] .= ' (Modifié le ' . $this->hseStat->updated_at->format('d/m/Y à H:i') . ')';
        }
        
        return $notificationData;
    }
}