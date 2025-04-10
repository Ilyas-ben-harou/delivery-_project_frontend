import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LivreurDashboard = () => {
  const { user, logout } = useAuth();
  const livreurInfo = user?.livreur;

  return (
    <div className="livreur-dashboard">
      <header className="dashboard-header">
        <h1>Livreur Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {livreurInfo?.first_name} {livreurInfo?.last_name}</span>
          <div className="status-indicator">
            <span className={livreurInfo?.is_available ? 'status-available' : 'status-unavailable'}>
              {livreurInfo?.is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <button onClick={logout} className="btn btn-outline-danger">Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>My Deliveries</h3>
          <p>View and manage your assigned deliveries.</p>
          <button className="btn btn-primary">View Deliveries</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Update Order Status</h3>
          <p>Update the status of orders you're delivering.</p>
          <button className="btn btn-primary">Update Status</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Scan QR Code</h3>
          <p>Scan QR codes to verify and update delivery information.</p>
          <button className="btn btn-primary">Scan QR</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Availability</h3>
          <p>Update your availability status for new deliveries.</p>
          <button className="btn btn-warning">
            {livreurInfo?.is_available ? 'Set Unavailable' : 'Set Available'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivreurDashboard;