import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, Admin</span>
          <button onClick={logout} className="btn btn-outline-danger">Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>User Management</h3>
          <p>Manage users, validate accounts, and assign roles.</p>
          <button className="btn btn-primary">Manage Users</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Order Management</h3>
          <p>View and reassign orders to different delivery personnel.</p>
          <button className="btn btn-primary">Manage Orders</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Financial Reports</h3>
          <p>Generate and view financial reports and statistics.</p>
          <button className="btn btn-primary">View Reports</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;