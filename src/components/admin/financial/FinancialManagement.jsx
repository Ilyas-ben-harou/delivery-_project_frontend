import React from 'react';
import { FaChartLine, FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FinancialManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Overview</h2>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">$24,568.00</h2>
            </div>
            <p className="text-xs text-green-600 mt-2">+12.5% from last month</p>
          </div>
          <div className="h-1 bg-blue-500"></div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Pending Payments</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">$5,320.00</h2>
            </div>
            <p className="text-xs text-red-600 mt-2">-2.3% from last month</p>
          </div>
          <div className="h-1 bg-yellow-500"></div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Completed Orders</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">1,245</h2>
            </div>
            <p className="text-xs text-green-600 mt-2">+8.7% from last month</p>
          </div>
          <div className="h-1 bg-green-500"></div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Failed Orders</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">68</h2>
            </div>
            <p className="text-xs text-red-600 mt-2">-1.2% from last month</p>
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