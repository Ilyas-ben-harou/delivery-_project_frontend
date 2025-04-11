import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ClientLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const clientInfo = user?.client;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="client-layout">
            <header className="layout-header">
                <div className="logo">Delivery Client</div>
                <nav className="main-nav">
                    <ul>
                        <li><a href="/client/dashboard">Dashboard</a></li>
                        <li><a href="/client/orders">My Orders</a></li>
                        <li><a href="/client/new-order">New Order</a></li>
                        <li><a href="/client/documents">Documents</a></li>
                    </ul>
                </nav>
                <div className="user-menu">
                    <span>{clientInfo?.company_name || 'Client'}</span>
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

export default ClientLayout;