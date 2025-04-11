import { redirect } from "react-router-dom";

// Get the token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Get the user from localStorage
const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};

// Middleware to require authentication
export const requireAuth = () => {
    const token = getToken();
    if (!token) {
        return redirect("/login");
    }
    return null;
};

// Middleware to require a specific role
export const requireRole = (role) => {
    const token = getToken();
    if (!token) {
        return redirect("/login");
    }

    const user = getUser();
    if (!user || user.role !== role) {
        return redirect("/unauthorized");
    }

    return null;
};