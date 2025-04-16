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

export { adminAxios };
