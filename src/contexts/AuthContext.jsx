import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios
    axios.defaults.baseURL = 'http://localhost:8000/api';

    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await axios.get('/me');
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Authentication error:', error);
                    logout();
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [token]);

    // Register user
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/register', userData);
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/login', credentials);
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = async () => {
        setLoading(true);
        try {
            if (token) {
                await axios.post('/logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    };

    // Reset password
    const resetPassword = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/reset-password', data);
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Password reset failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Check if user has a specific role
    const hasRole = (role) => {
        return user?.user_type === role;
    };

    const isAdmin = () => hasRole('admin');
    const isClient = () => hasRole('client');
    const isLivreur = () => hasRole('livreur');

    const value = {
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        resetPassword,
        isAdmin,
        isClient,
        isLivreur,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};