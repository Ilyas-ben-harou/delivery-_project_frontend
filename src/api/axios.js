import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const adminAxios = axios.create({
    baseURL: `${API_URL}/admin`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

adminAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
adminAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Log detailed error information for debugging
        console.error('API Error:', error);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request error:', error.message);
        }
        
        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            console.warn('Authentication error. Redirecting to login...');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

const clientAxios = axios.create({
    baseURL: `${API_URL}/client`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

clientAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add same response interceptor for clientAxios
clientAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Client API Error:', error);
        
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

const livreurAxios = axios.create({
    baseURL: `${API_URL}/livreur`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

livreurAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add same response interceptor for livreurAxios
livreurAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Livreur API Error:', error);
        
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export { adminAxios, clientAxios, livreurAxios };