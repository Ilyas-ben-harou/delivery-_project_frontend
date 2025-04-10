import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LivreurLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const livreurInfo = user?.livreur;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="livreur-layout">
            <header className="layout-header">
                <div className="logo">Delivery Livreur</div>
                <nav className="main-nav">
                    <ul>
                        <li><a href="/livreur/dashboard">Dashboard</a></li>
                        <li><a href="/livreur/deliveries">My Deliveries</a></li>
                        <li><a href="/livreur/scan">Scan QR</a></li>
                        <li><a href="/livreur/profile">Profile</a></li>
                    </ul>
                </nav>
                <div className="user-menu">
                    <span>
                        {livreurInfo?.first_name} {livreurInfo?.last_name}
                        <span className={livreurInfo?.is_available ? 'status-available' : 'status-unavailable'}>
                            {livreurInfo?.is_available ? ' (Available)' : ' (Unavailable)'}
                        </span>
                    </span>
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

export default LivreurLayout;