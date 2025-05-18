import React, { useState, useEffect } from 'react';
import { adminAxios } from '../../../api/axios';
import { format } from 'date-fns';
import ErrorBoundary from '../../../components/common/ErrorBoundary';

const DistributorPayments = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDistributorPayments();
  }, []);

  const fetchDistributorPayments = async () => {
    setLoading(true);
    try {
      const response = await adminAxios.get('/financial/distributor-payments', {
        params: {
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          search: searchTerm || undefined
        }
      });
      
      if (response.data.status === 'success') {
        setDistributors(response.data.data);
      }
    } catch (err) {
      setError('Failed to load distributor payment data');
      console.error('Error loading distributor payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchDistributorPayments();
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    fetchDistributorPayments();
  };

  // Function to safely format currency values
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0.00dh';
    return `${parseFloat(value).toFixed(2)} dh`;
  };

  // Mock function to simulate marking as paid (this would need to be implemented in the backend)
  const handleMarkAsPaid = (distributorId) => {
    alert(`Distributor ${distributorId} would be marked as paid. This is a placeholder for the actual implementation.`);
  };

  if (loading && distributors.length === 0) {
    return (
      <div className="w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Distributor Payments</h2>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Loading distributor payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Distributor Payments</h2>
        
        {/* Filter Card */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Payment Filters</h4>
            <form onSubmit={handleFilterSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
                  <input
                    type="text"
                    placeholder="Search distributor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mr-2"
                  >
                    Apply Filters
                  </button>
                  <button 
                    type="button"
                    onClick={resetFilters}
                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Distributors Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Payment Status</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distributor Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total revenue</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Orders</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {distributors && distributors.length > 0 ? (
                    distributors.map((distributor) => (
                      <tr key={distributor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{distributor.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {distributor.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(distributor.total_revenue || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(distributor.commission)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {(distributor.order_count)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${distributor.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {distributor.paid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!distributor.paid && (
                            <button 
                              className="bg-green-100 text-green-700 py-1 px-3 rounded border border-green-200 hover:bg-green-200 transition duration-200"
                              onClick={() => handleMarkAsPaid(distributor.id)}
                            >
                              Mark as Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No distributor payment data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DistributorPayments;