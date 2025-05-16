import { useEffect, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../../contexts/NotificationContext";

export function NotificationDropdown() {
    const {
        notifications,
        unreadCount,
        isLoading,
        isOpen,
        markAsRead,
        markAllAsRead,
        toggleNotifications,
        connectionError
    } = useNotifications();

    console.log("Notifications:", notifications);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isOpen) {
                toggleNotifications();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, toggleNotifications]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleNotifications}
                className="flex items-center justify-center rounded-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                    <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                <Check className="h-3 w-3" />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {connectionError ? (
                            <div className="p-4 text-center text-sm text-red-600">
                                Realtime updates unavailable. {connectionError}
                            </div>
                        ) : isLoading ? (
                            <div className="flex justify-center items-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No notifications available
                            </div>
                        ) : (
                            <ul>
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={markAsRead}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function NotificationItem({ notification, onMarkAsRead }) {
    const timeAgo = notification.created_at
        ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })
        : '';

    const notificationStyles = {
        'livreur.unavailable': {
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
        },
        'livreur.available': {
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
        }
    };

    const { bgColor = 'bg-blue-50', textColor = 'text-blue-700' } = 
        notificationStyles[notification.type] || {};

    return (
        <li className={`${notification.read ? 'bg-white' : bgColor} border-b border-gray-100 last:border-b-0 relative`}>
            <div className="p-4 pr-10">
                <div className="flex justify-between items-start">
                    <p className={`text-sm font-medium ${notification.read ? 'text-gray-800' : textColor}`}>
                        {notification.message}
                    </p>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {timeAgo}
                    </span>
                </div>

                {notification.type === 'livreur.unavailable' && notification.data && (
                    <div className="mt-1 text-xs text-gray-600">
                        <p><span className="font-medium">Reason:</span> {notification.data.reason}</p>
                        <p>
                            <span className="font-medium">Period:</span>{' '}
                            {new Date(notification.data.start_date).toLocaleDateString()} to{' '}
                            {new Date(notification.data.end_date).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </div>

            {!notification.read && (
                <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                    aria-label="Mark as read"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </li>
    );
}