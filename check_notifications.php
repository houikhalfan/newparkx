<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Admin;

// Check admin notifications
$admin = Admin::first();
if ($admin) {
    echo "Admin: " . $admin->email . "\n";
    echo "Total notifications: " . $admin->notifications()->count() . "\n";
    echo "Unread notifications: " . $admin->unreadNotifications()->count() . "\n";
    echo "Contractor registration notifications: " . $admin->notifications()->where('data->type', 'contractor_registration')->count() . "\n";
    
    echo "\nRecent contractor notifications:\n";
    $contractorNotifications = $admin->notifications()->where('data->type', 'contractor_registration')->latest()->take(3)->get();
    foreach ($contractorNotifications as $n) {
        echo "- " . $n->data['title'] . " (" . $n->data['contractor_name'] . ") - " . $n->created_at . "\n";
    }
    
    echo "\nAll notification types:\n";
    $allNotifications = $admin->notifications()->latest()->take(5)->get();
    foreach ($allNotifications as $n) {
        echo "- " . ($n->data['type'] ?? 'unknown') . ": " . ($n->data['title'] ?? 'No title') . " - " . $n->created_at . "\n";
    }
} else {
    echo "No admin found\n";
}


