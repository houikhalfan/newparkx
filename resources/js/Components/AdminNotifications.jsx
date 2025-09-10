import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch notifications when component mounts
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/admin/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unread_count || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`/admin/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            if (response.ok) {
                // Update local state
                setNotifications(prev => 
                    prev.map(notif => 
                        notif.id === notificationId 
                            ? { ...notif, read_at: new Date().toISOString() }
                            : notif
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('/admin/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            if (response.ok) {
                setNotifications(prev => 
                    prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'hse_statistics':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-blue-500" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'À l\'instant';
        if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
        if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <div className="relative">
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                title="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Notifications
                        </h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                    Tout marquer comme lu
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                Aucune notification
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 ${
                                        !notification.read_at ? 'bg-blue-50 dark:bg-slate-700' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {getNotificationIcon(notification.data?.type)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {notification.data?.title || 'Notification'}
                                                </h4>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(notification.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                {notification.data?.message || notification.data?.body}
                                            </p>
                                            {notification.data?.modified_at && (
                                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                                                    Modifié le: {notification.data.modified_at}
                                                </p>
                                            )}
                                            {notification.data?.url && (
                                                <Link
                                                    href={notification.data.url}
                                                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 mt-1 inline-block"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    Voir les détails →
                                                </Link>
                                            )}
                                        </div>
                                        {!notification.read_at && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                            >
                                                Marquer comme lu
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                            <Link
                                href="/admin/notifications"
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            >
                                Voir toutes les notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
