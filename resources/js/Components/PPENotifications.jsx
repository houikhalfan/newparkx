import React, { useState, useEffect } from 'react';
import { Package, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export default function PPENotifications() {
    const { route } = usePage().props;
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Fetch recent PPE requests for notifications
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/admin/ppe-requests/recent');
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.slice(0, 5)); // Show only 5 most recent
                }
            } catch (error) {
                console.error('Error fetching PPE notifications:', error);
            }
        };

        fetchNotifications();
        
        // Refresh notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const dismissNotification = (index) => {
        setNotifications(prev => prev.filter((_, i) => i !== index));
    };

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
            {isOpen && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900 flex items-center">
                            <Package className="h-4 w-4 mr-2 text-blue-600" />
                            Nouvelles demandes EPI
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {notifications.map((request, index) => (
                            <div key={request.id} className="text-xs text-gray-600 border-b border-gray-100 pb-2 last:border-b-0">
                                <div className="font-medium">{request.nom_prenom}</div>
                                <div className="text-gray-500">
                                    {request.liste_epi.length} EPI demandé(s)
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <a
                            href={route('admin.ppe-requests.index')}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Voir toutes les demandes →
                        </a>
                    </div>
                </div>
            )}
            
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors"
                title={`${notifications.length} nouvelles demandes EPI`}
            >
                <Package className="h-5 w-5" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.length}
                    </span>
                )}
            </button>
        </div>
    );
}
