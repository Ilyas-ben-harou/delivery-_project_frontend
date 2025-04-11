import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Unauthorized = () => {
    const { user } = useAuth();

    const getDashboardLink = () => {
        if (!user) return '/login';

        switch (user.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'client':
                return '/client/dashboard';
            case 'livreur':
                return '/livreur/dashboard';
            default:
                return '/login';
        }
    };

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-content">
                <h1>Unauthorized Access</h1>
                <p>You do not have permission to access this page.</p>
                <div className="buttons">
                    <Link to={getDashboardLink()} className="btn btn-primary">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;