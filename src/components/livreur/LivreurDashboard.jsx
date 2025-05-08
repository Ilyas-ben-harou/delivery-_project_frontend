import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { livreurAxios } from '../../api/axios';
import { Check, CheckIcon, X } from 'lucide-react';

const LivreurDashboard = () => {
  const { user, logout } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await livreurAxios.post(`/orders`, { livreur_id: user?.livreur?.id });
        setDeliveries(response.data);
        console.log('Fetched deliveries:', response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        setError('Failed to load deliveries');
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [user]);

  const updateDeliveryStatus = async (id, newStatus, failureReason = '') => {
    try {
      await livreurAxios.put(`/orders/${id}`, {
        status: newStatus,
        failure_reason: failureReason
      });

      setDeliveries(deliveries.map(delivery =>
        delivery.id === id ? { ...delivery, status: newStatus, failure_reason: failureReason } : delivery
      ));

      if (selectedDelivery && selectedDelivery.id === id) {
        setSelectedDelivery({ ...selectedDelivery, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating delivery status:', err);
      setError('Failed to update delivery status');
    }
  };

  const filteredDeliveries = activeTab === 'all'
    ? deliveries
    : deliveries.filter(delivery => delivery.status === activeTab);

  const counts = {
    all: deliveries.length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    in_transit: deliveries.filter(d => d.status === 'in_transit').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    failed: deliveries.filter(d => d.status === 'failed').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur !</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_transit': return 'En cours';
      case 'delivered': return 'Livré';
      case 'failed': return 'Échoué';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Livreur</h1>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Livreur</p>
              <p className="text-lg font-semibold text-gray-900">{user?.name || 'Livreur'}</p>
            </div>
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
                src={user?.avatar || "https://randomuser.me/api/portraits/men/75.jpg"}
                alt="Profile"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Colis</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{counts.all}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">En Attente</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{counts.pending}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-400 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">En Cours</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{counts.in_transit}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Livrés</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{counts.delivered}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Échoués</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{counts.failed}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
              id="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="all">Tous ({counts.all})</option>
              <option value="pending">En attente ({counts.pending})</option>
              <option value="in_transit">En cours ({counts.in_transit})</option>
              <option value="delivered">Livrés ({counts.delivered})</option>
              <option value="failed">Échoués ({counts.failed})</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Tous les colis <span className="bg-gray-100 text-gray-600 ml-1 py-0.5 px-2 rounded-full text-xs">{counts.all}</span>
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`${activeTab === 'pending' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  En attente <span className="bg-yellow-100 text-yellow-600 ml-1 py-0.5 px-2 rounded-full text-xs">{counts.pending}</span>
                </button>
                <button
                  onClick={() => setActiveTab('in_transit')}
                  className={`${activeTab === 'in_transit' ? 'border-blue-400 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  En cours <span className="bg-blue-100 text-blue-600 ml-1 py-0.5 px-2 rounded-full text-xs">{counts.in_transit}</span>
                </button>
                <button
                  onClick={() => setActiveTab('delivered')}
                  className={`${activeTab === 'delivered' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Livrés <span className="bg-green-100 text-green-600 ml-1 py-0.5 px-2 rounded-full text-xs">{counts.delivered}</span>
                </button>
                <button
                  onClick={() => setActiveTab('failed')}
                  className={`${activeTab === 'failed' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Échoués <span className="bg-red-100 text-red-600 ml-1 py-0.5 px-2 rounded-full text-xs">{counts.failed}</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Delivery Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Delivery List */}
          <div className={`${selectedDelivery ? 'lg:w-2/5' : 'w-full'}`}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Liste des colis</h3>
                <p className="mt-1 text-sm text-gray-500">Sélectionnez un colis pour voir les détails</p>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredDeliveries.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun colis trouvé</h3>
                    <p className="mt-1 text-sm text-gray-500">Aucun colis correspond à votre sélection.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                    {filteredDeliveries.map(delivery => (
                      <li
                        key={delivery.id}
                        className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${selectedDelivery?.id === delivery.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedDelivery(delivery)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="min-w-0 flex-1">
                              <div className="flex justify-between">
                                <p className="text-sm font-medium text-blue-600 truncate">{delivery.order_number}</p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                                    {getStatusText(delivery.status)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                {delivery.customer_info?.full_name}
                              </p>
                            </div>
                          </div>
                          <div>
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {delivery.customer_info?.address}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <p>
                              {new Date(delivery.collection_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          {selectedDelivery && (
            <div className="lg:w-3/5">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className='flex items-center justify-start gap-1'>
                        <X
                          onClick={() => setSelectedDelivery(null)}
                          className="w-5 h-5            text-gray-400     hover:text-red-500 active:text-red-600 cursor-pointer     transition-colors duration-200 
  "
                          strokeWidth={2.5}               // Slightly thicker lines (adjust as needed)
                          aria-label="Close"              // Accessibility
                        />
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Détails de la livraison</h3>

                      </div>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">Informations complètes sur la commande</p>
                    </div>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedDelivery.status)}`}>
                      {getStatusText(selectedDelivery.status)}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Client</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500">Nom</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedDelivery.customer_info?.full_name}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500">Téléphone</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedDelivery.customer_info?.phone_number}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Adresse</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedDelivery.customer_info?.address}, {selectedDelivery.customer_info?.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Commande</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500">Numéro de commande</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedDelivery.order_number}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500">Date de création</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(selectedDelivery.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500">Date de collecte</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(selectedDelivery.collection_date).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Statut</p>
                          <p className="mt-1 text-sm text-gray-900">{getStatusText(selectedDelivery.status)}</p>
                        </div>
                        {selectedDelivery.status === 'failed' && selectedDelivery.failure_reason && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-500">Raison d'échec</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedDelivery.failure_reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Détails du produit</h4>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        <li>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {selectedDelivery.designation_product}
                              </p>
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Poids</p>
                                <p className="text-sm font-medium text-gray-900">{selectedDelivery.weight} kg</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Hauteur</p>
                                <p className="text-sm font-medium text-gray-900">{selectedDelivery.product_height} cm</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Largeur</p>
                                <p className="text-sm font-medium text-gray-900">{selectedDelivery.product_width} cm</p>
                              </div>
                            </div>
                            {selectedDelivery.description && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-sm text-gray-900">{selectedDelivery.description}</p>
                              </div>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Information de paiement</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-500">Montant</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedDelivery.amount} MAD</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="flex justify-end space-x-3">
                      {selectedDelivery.status === 'pending' && (
                        <button
                          onClick={() => updateDeliveryStatus(selectedDelivery.id, 'in_transit')}
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                          Commencer la livraison
                        </button>
                      )}

                      {selectedDelivery.status === 'in_transit' && (
                        <>
                          <button
                            onClick={() => updateDeliveryStatus(selectedDelivery.id, 'delivered')}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Marquer comme livré
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt("Entrez la raison de l'échec:");
                              if (reason) {
                                updateDeliveryStatus(selectedDelivery.id, 'failed', reason);
                              }
                            }}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Signaler un problème
                          </button>
                        </>
                      )}

                      {selectedDelivery.status === 'delivered' && (
                        <div className="w-full bg-green-50 border border-green-200 rounded-md p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-green-800">
                                Livraison complétée avec succès
                              </h3>
                              <div className="mt-2 text-sm text-green-700">
                                <p>
                                  Livré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedDelivery.status === 'failed' && (
                        <div className="w-full bg-red-50 border border-red-200 rounded-md p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">
                                Livraison échouée
                              </h3>
                              <div className="mt-2 text-sm text-red-700">
                                <p>
                                  Raison: {selectedDelivery.failure_reason || 'Non spécifiée'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LivreurDashboard;