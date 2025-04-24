import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const adminAxios = axios.create({
    baseURL: `${API_URL}/admin`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

adminAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

const clientAxios = axios.create({
    baseURL: `${API_URL}/client`, // Utilisez la même constante API_URL ici
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

clientAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export { adminAxios, clientAxios };