import React from 'react';

const ClientDashboard = () => {
  

  return (
    <div className="client-dashboard">      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Create Order</h3>
          <p>Create a new delivery order for your products.</p>
          <button className="btn btn-primary">New Order</button>
        </div>
        
        <div className="dashboard-card">
          <h3>View Orders</h3>
          <p>View and track the status of your existing orders.</p>
          <button className="btn btn-primary">My Orders</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Delivery Documents</h3>
          <p>Generate and download delivery documents for your orders.</p>
          <button className="btn btn-primary">Documents</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Cancel Order</h3>
          <p>Cancel an existing order that hasn't been processed yet.</p>
          <button className="btn btn-primary">Cancel Order</button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;