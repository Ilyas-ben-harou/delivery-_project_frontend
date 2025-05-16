import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import initializeEcho from "../echo";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        let channel;
        let retryTimeout;

        const initializeNotifications = async () => {
            try {
                // Initialize Echo first
                const echoInstance = initializeEcho();
                
                await fetchNotifications();

                channel = echoInstance.private('admin.notifications');

                channel.listen('.livreur.unavailable', (event) => {
                    addNotification({
                        id: `temp-${Date.now()}`,
                        type: 'livreur.unavailable',
                        livreur_id: event.livreur_id,
                        message: event.message,
                        data: {
                            reason: event.reason,
                            start_date: event.start_date,
                            end_date: event.end_date,
                        },
                        read: false,
                        created_at: event.timestamp
                    });
                });

                channel.listen('.livreur.available', (event) => {
                    addNotification({
                        id: `temp-${Date.now()}`,
                        type: 'livreur.available',
                        livreur_id: event.livreur_id,
                        message: event.message,
                        data: {},
                        read: false,
                        created_at: event.timestamp
                    });
                });

                setConnectionError(null);
            } catch (error) {
                console.error('Notification system error:', error);
                setConnectionError(error.message);
                // Retry after 5 seconds
                retryTimeout = setTimeout(initializeNotifications, 5000);
            }
        };

        initializeNotifications();

        return () => {
            if (channel) {
                channel.stopListening();
            }
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, []);

    useEffect(() => {
        const count = notifications.filter(notification => !notification.read).length;
        setUnreadCount(count);
    }, [notifications]);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/admin/notifications');
            setNotifications(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setIsLoading(false);
            throw error;
        }
    };

    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/admin/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/admin/notifications/read-all');
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    };

    const toggleNotifications = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                isOpen,
                connectionError,
                fetchNotifications,
                markAsRead,
                markAllAsRead,
                toggleNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}