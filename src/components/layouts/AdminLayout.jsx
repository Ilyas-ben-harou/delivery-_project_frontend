import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <header className="layout-header">
                <div className="logo">Delivery Admin</div>
                <nav className="main-nav">
                    <ul>
                        <li><a href="/admin/dashboard">Dashboard</a></li>
                        <li><a href="/admin/users">Users</a></li>
                        <li><a href="/admin/orders">Orders</a></li>
                        <li><a href="/admin/reports">Reports</a></li>
                    </ul>
                </nav>
                <div className="user-menu">
                    <span>Admin</span>
                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
                </div>
            </header>

            <main className="layout-content">
                <Outlet />
            </main>

            <footer className="layout-footer">
                <p>&copy; {new Date().getFullYear()} Delivery System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminLayout;