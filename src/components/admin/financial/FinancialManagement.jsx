import React, { useState, useEffect } from 'react';
import { FaChartLine, FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { adminAxios } from '../../../api/axios';

const FinancialManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    total_earnings: 0,
    pending_payments: 0,
    orders_by_status: [],
    earnings_by_day: []
  });

  // Add a helper function to safely format numbers
  const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get('/financial/dashboard');
      
      if (response.data.status === 'success') {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const getOrdersByStatus = (status) => {
    const statusData = dashboardData.orders_by_status.find(item => item.status === status);
    return statusData ? statusData.count : 0;
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Overview</h2>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {formatNumber(dashboardData.total_earnings)} dh
              </h2>
            </div>
            <p className="text-xs text-green-600 mt-2">Current Month Revenue</p>
          </div>
          <div className="h-1 bg-blue-500"></div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Pending Payments</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {formatNumber(dashboardData.pending_payments)} dh
              </h2>
            </div>
            <p className="text-xs text-yellow-600 mt-2">Awaiting Processing</p>
          </div>
          <div className="h-1 bg-yellow-500"></div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Completed Orders</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {getOrdersByStatus('delivered')}
              </h2>
            </div>
            <p className="text-xs text-green-600 mt-2">Successfully Delivered</p>
          </div>
          <div className="h-1 bg-green-500"></div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Failed Orders</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {getOrdersByStatus('failed')}
              </h2>
            </div>
            <p className="text-xs text-red-600 mt-2">Delivery Failed</p>
          </div>
          <div className="h-1 bg-red-500"></div>
        </div>
      </div>

      {/* Quick Links Section */}
     <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h5 className="text-lg font-medium text-gray-800 mb-4">Quick Links</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dashboard Link - New */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition duration-200 cursor-pointer"
                 onClick={() => navigate('/admin/financial/dashboard')}>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Financial Dashboard</h3>
              <p className="text-gray-600 mb-4">View financial metrics and analytics</p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                View Dashboard
              </button>
            </div>

            {/* Existing Pricing Management Link */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition duration-200 cursor-pointer"
                 onClick={() => navigate('/admin/financial/pricing')}>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Pricing Management</h3>
              <p className="text-gray-600 mb-4">Manage city-based pricing for deliveries</p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                Go to Pricing
              </button>
            </div>

            {/* Existing Distributor Payments Link */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition duration-200 cursor-pointer"
                 onClick={() => navigate('/admin/financial/distributor-payments')}>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Distributor Payments</h3>
              <p className="text-gray-600 mb-4">View and manage distributor payments</p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                View Payments
              </button>
            </div>

            {/* Existing Financial Reports Link */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition duration-200 cursor-pointer"
                 onClick={() => navigate('/admin/financial/reports')}>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Financial Reports</h3>
              <p className="text-gray-600 mb-4">Generate detailed financial reports</p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                Generate Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;