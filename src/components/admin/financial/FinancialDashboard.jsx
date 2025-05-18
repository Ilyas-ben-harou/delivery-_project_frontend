import React, { useState, useEffect } from 'react';
import { adminAxios } from '../../../api/axios';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinancialDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_earnings: 0,
    pending_payments: 0,
    orders_by_status: [],
    earnings_by_day: [],
    top_distributors: [],
    period: {
      start: '',
      end: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Date filter state
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (start = startDate, end = endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAxios.get('/financial/dashboard', {
        params: {
          start_date: start,
          end_date: end
        }
      });
      
      if (response.data && response.data.status === 'success') {
        // Process the data to ensure numeric values
        const data = response.data.data;
        
        // Convert string values to numbers as needed
        if (typeof data.total_earnings === 'string') {
          data.total_earnings = parseFloat(data.total_earnings);
        }
        
        // Process earnings_by_day to ensure total is numeric
        if (Array.isArray(data.earnings_by_day)) {
          data.earnings_by_day = data.earnings_by_day.map(day => ({
            ...day,
            total: typeof day.total === 'string' ? parseFloat(day.total) : day.total
          }));
        }
        
        // Process top_distributors to ensure numbers
        if (Array.isArray(data.top_distributors)) {
          data.top_distributors = data.top_distributors.map(distributor => ({
            ...distributor,
            total: typeof distributor.total === 'string' ? parseFloat(distributor.total) : distributor.total,
            total_revenue: typeof distributor.total_revenue === 'string' ? 
              parseFloat(distributor.total_revenue) : distributor.total_revenue,
            total_commission: typeof distributor.total_commission === 'string' ? 
              parseFloat(distributor.total_commission) : distributor.total_commission
          }));
        }
        
        setDashboardData(data);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = () => {
    fetchDashboardData(startDate, endDate);
  };

  const handleQuickFilter = (months) => {
    const end = format(new Date(), 'yyyy-MM-dd');
    const start = format(subMonths(new Date(), months), 'yyyy-MM-dd');
    
    setStartDate(start);
    setEndDate(end);
    fetchDashboardData(start, end);
  };

  if (loading) return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Dashboard</h2>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading dashboard data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Dashboard</h2>
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-center">
          <div>
            <p className="font-bold text-red-700">Error Loading Data</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button 
            onClick={() => fetchDashboardData()} 
            className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Dashboard</h2>
      
      {/* Date Filter Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                />
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                />
                <button 
                  onClick={handleDateFilterChange}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Apply
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleQuickFilter(1)}
                  className="bg-blue-50 text-blue-700 py-1 px-3 rounded border border-blue-200 hover:bg-blue-100 transition duration-200"
                >
                  Last Month
                </button>
                <button 
                  onClick={() => handleQuickFilter(3)}
                  className="bg-blue-50 text-blue-700 py-1 px-3 rounded border border-blue-200 hover:bg-blue-100 transition duration-200"
                >
                  Last 3 Months
                </button>
                <button 
                  onClick={() => handleQuickFilter(6)}
                  className="bg-blue-50 text-blue-700 py-1 px-3 rounded border border-blue-200 hover:bg-blue-100 transition duration-200"
                >
                  Last 6 Months
                </button>
                <button 
                  onClick={() => handleQuickFilter(12)}
                  className="bg-blue-50 text-blue-700 py-1 px-3 rounded border border-blue-200 hover:bg-blue-100 transition duration-200"
                >
                  Last Year
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Total Earnings</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {typeof dashboardData.total_earnings === 'number' 
                  ? dashboardData.total_earnings.toFixed(2) 
                  : Number(dashboardData.total_earnings || 0).toFixed(2)} dh
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-2">From {dashboardData.period?.start || 'N/A'} to {dashboardData.period?.end || 'N/A'}</p>
          </div>
          <div className="h-1 bg-blue-500"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Pending Payments</h6>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {typeof dashboardData.pending_payments === 'number' 
                  ? dashboardData.pending_payments.toFixed(2) 
                  : Number(dashboardData.pending_payments || 0).toFixed(2)} dh
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-2">Awaiting settlement</p>
          </div>
          <div className="h-1 bg-yellow-500"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h6 className="text-sm font-medium text-gray-500 mb-1">Orders by Status</h6>
            {(dashboardData.orders_by_status || []).length > 0 ? (
              <div className="space-y-2 mt-2">
                {(dashboardData.orders_by_status || []).map((status, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{status.status}</span>
                    <span className="font-medium text-gray-800">{status.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-2">No order data available</div>
            )}
          </div>
          <div className="h-1 bg-indigo-500"></div>
        </div>
      </div>
      
      {/* Earnings Chart */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h5 className="text-lg font-medium text-gray-800 mb-4">Daily Earnings</h5>
          {(dashboardData.earnings_by_day || []).length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.earnings_by_day}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip formatter={(value) => `$${typeof value === 'number' ? value.toFixed(2) : Number(value || 0).toFixed(2)}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Earnings"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-gray-50 text-gray-500 text-center py-16 rounded">
              No earnings data available for the selected period
            </div>
          )}
        </div>
      </div>
      
      {/* Top Distributors */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h5 className="text-lg font-medium text-gray-800 mb-4">Top Distributors</h5>
          {(dashboardData.top_distributors || []).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distributor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Earnings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(dashboardData.top_distributors || []).map((distributor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {distributor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {distributor.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {typeof distributor.total === 'number' 
                          ? distributor.total.toFixed(2) 
                          : Number(distributor.total_revenue || distributor.total || 0).toFixed(2)} dh
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 text-gray-500 text-center py-8 rounded">
              No distributor data available for the selected period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;