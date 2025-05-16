import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const initializeEcho = () => {
    if (!window.Echo) {
        window.Pusher = Pusher;
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
            authEndpoint: '/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }
        });
    }
    return window.Echo;
};

export default initializeEcho;