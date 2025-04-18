// DeliveryDashboard.jsx
import React, { useState } from 'react';
import './LivreurDashboard.css';

import { useAuth } from '../../contexts/AuthContext';

const LivreurDashboard = () => {
  const { user, logout } = useAuth();
  const livreurInfo = user?.livreur;

  const initialDeliveries = [
    {
      id: 1,
      trackingNumber: 'TR-7845-9632',
      customerName: 'Ahmed Benali',
      address: '123 Rue de la Liberté, Casablanca',
      phone: '+212 612345678',
      status: 'pending',
      deliveryDate: '2023-07-15',
      items: [
        { name: 'Smartphone', quantity: 1 },
        { name: 'Phone Case', quantity: 1 }
      ]
    },
    {
      id: 2,
      trackingNumber: 'TR-5632-1478',
      customerName: 'Fatima Zahra',
      address: '45 Avenue Hassan II, Rabat',
      phone: '+212 623456789',
      status: 'in_transit',
      deliveryDate: '2023-07-15',
      items: [
        { name: 'Laptop', quantity: 1 },
        { name: 'Mouse', quantity: 1 },
        { name: 'Keyboard', quantity: 1 }
      ]
    },
    {
      id: 3,
      trackingNumber: 'TR-9874-3652',
      customerName: 'Karim Tazi',
      address: '78 Boulevard Mohammed V, Marrakech',
      phone: '+212 634567890',
      status: 'pending',
      deliveryDate: '2023-07-16',
      items: [
        { name: 'Headphones', quantity: 2 }
      ]
    },
    {
      id: 4,
      trackingNumber: 'TR-3214-7896',
      customerName: 'Leila Mansouri',
      address: '12 Rue Ibn Sina, Fès',
      phone: '+212 645678901',
      status: 'delivered',
      deliveryDate: '2023-07-14',
      items: [
        { name: 'Tablet', quantity: 1 },
        { name: 'Charger', quantity: 1 },
        { name: 'Screen Protector', quantity: 1 }
      ]
    },
    {
      id: 5,
      trackingNumber: 'TR-6547-8523',
      customerName: 'Omar Alaoui',
      address: '34 Avenue des FAR, Tanger',
      phone: '+212 656789012',
      status: 'in_transit',
      deliveryDate: '2023-07-15',
      items: [
        { name: 'Smart Watch', quantity: 1 }
      ]
    }
  ];

  // State for deliveries
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Function to update delivery status
  const updateDeliveryStatus = (id, newStatus) => {
    setDeliveries(deliveries.map(delivery => 
      delivery.id === id ? { ...delivery, status: newStatus } : delivery
    ));
    
    if (selectedDelivery && selectedDelivery.id === id) {
      setSelectedDelivery({ ...selectedDelivery, status: newStatus });
    }
  };

  // Filter deliveries based on active tab
  const filteredDeliveries = activeTab === 'all' 
    ? deliveries 
    : deliveries.filter(delivery => delivery.status === activeTab);

  // Get counts for each status
  const counts = {
    all: deliveries.length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    in_transit: deliveries.filter(d => d.status === 'in_transit').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length
  };

  return (
    <div className="delivery-dashboard">
      <header className="dashboard-header">
        <h1>Livreur Dashboard</h1>
        <div className="user-info">
          <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Livreur" className="avatar" />
          <div>
            <h3>Mohammed Rachidi</h3>
            <p>ID: LIV-2023-456</p>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button 
            className={`nav-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tous les colis ({counts.all})
          </button>
          <button 
            className={`nav-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            En attente ({counts.pending})
          </button>
          <button 
            className={`nav-button ${activeTab === 'in_transit' ? 'active' : ''}`}
            onClick={() => setActiveTab('in_transit')}
          >
            En cours ({counts.in_transit})
          </button>
          <button 
            className={`nav-button ${activeTab === 'delivered' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivered')}
          >
            Livrés ({counts.delivered})
          </button>
        </nav>

        <div className="dashboard-main">
          <div className="deliveries-list">
            <h2>Colis à livrer</h2>
            {filteredDeliveries.length === 0 ? (
              <p className="no-deliveries">Aucun colis trouvé</p>
            ) : (
              filteredDeliveries.map(delivery => (
                <div 
                  key={delivery.id} 
                  className={`delivery-card ${delivery.status} ${selectedDelivery?.id === delivery.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <div className="delivery-header">
                    <h3>{delivery.customerName}</h3>
                    <span className={`status-badge ${delivery.status}`}>
                      {delivery.status === 'pending' && 'En attente'}
                      {delivery.status === 'in_transit' && 'En cours'}
                      {delivery.status === 'delivered' && 'Livré'}
                    </span>
                  </div>
                  <div className="delivery-details">
                    <p><strong>Tracking:</strong> {delivery.trackingNumber}</p>
                    <p><strong>Date:</strong> {delivery.deliveryDate}</p>
                    <p><strong>Articles:</strong> {delivery.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="delivery-details-panel">
            {selectedDelivery ? (
              <>
                <h2>Détails de la livraison</h2>
                <div className="detail-section">
                  <h3>Informations client</h3>
                  <p><strong>Nom:</strong> {selectedDelivery.customerName}</p>
                  <p><strong>Téléphone:</strong> {selectedDelivery.phone}</p>
                  <p><strong>Adresse:</strong> {selectedDelivery.address}</p>
                </div>

                <div className="detail-section">
                  <h3>Informations colis</h3>
                  <p><strong>Numéro de suivi:</strong> {selectedDelivery.trackingNumber}</p>
                  <p><strong>Date de livraison:</strong> {selectedDelivery.deliveryDate}</p>
                  <p><strong>Statut:</strong> 
                    <span className={`status-badge ${selectedDelivery.status}`}>
                      {selectedDelivery.status === 'pending' && 'En attente'}
                      {selectedDelivery.status === 'in_transit' && 'En cours'}
                      {selectedDelivery.status === 'delivered' && 'Livré'}
                    </span>
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Articles ({selectedDelivery.items.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                  <ul className="items-list">
                    {selectedDelivery.items.map((item, index) => (
                      <li key={index}>
                        {item.name} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="action-buttons">
                  {selectedDelivery.status === 'pending' && (
                    <button 
                      className="action-button start-delivery"
                      onClick={() => updateDeliveryStatus(selectedDelivery.id, 'in_transit')}
                    >
                      Commencer la livraison
                    </button>
                  )}
                  
                  {selectedDelivery.status === 'in_transit' && (
                    <button 
                      className="action-button complete-delivery"
                      onClick={() => updateDeliveryStatus(selectedDelivery.id, 'delivered')}
                    >
                      Marquer comme livré
                    </button>
                  )}
                  
                  {selectedDelivery.status === 'delivered' && (
                    <div className="delivery-completed">
                      ✓ Livraison complétée
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p>Sélectionnez un colis pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivreurDashboard;