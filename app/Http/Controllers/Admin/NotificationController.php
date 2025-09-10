<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $admin = Auth::guard('admin')->user();
        $notifications = $admin->notifications()
            ->latest()
            ->limit(50)
            ->get();
        
        $unreadCount = $admin->unreadNotifications()->count();
        
        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ]);
    }
    
    public function markAsRead($id)
    {
        $admin = Auth::guard('admin')->user();
        $notification = $admin->notifications()->find($id);
        
        if ($notification) {
            $notification->markAsRead();
            return response()->json(['success' => true]);
        }
        
        return response()->json(['error' => 'Notification not found'], 404);
    }
    
    public function markAllAsRead()
    {
        $admin = Auth::guard('admin')->user();
        $admin->unreadNotifications()->update(['read_at' => now()]);
        
        return response()->json(['success' => true]);
    }
    
    public function all()
    {
        $admin = Auth::guard('admin')->user();
        $notifications = $admin->notifications()
            ->latest()
            ->paginate(20);
        
        return view('admin.notifications.index', compact('notifications'));
    }
}
