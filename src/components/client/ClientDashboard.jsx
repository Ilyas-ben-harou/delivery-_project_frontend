import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientAxios } from '../../api/axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ClientDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    delivered: 0,
    inProgress: 0,
    cancelled: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchClientOrders();
  }, []);

  const fetchClientOrders = async () => {
    try {
      setLoading(true);
      const response = await clientAxios.get('/orders');
      setOrders(response.data);
      
      // Calculate statistics
      const totalAmount = response.data.reduce((sum, order) => sum + order.amount, 0);
      
      const stats = {
        totalOrders: response.data.length,
        pending: response.data.filter(o => o.status === 'pending').length,
        delivered: response.data.filter(o => o.status === 'delivered').length,
        inProgress: response.data.filter(o => o.status === 'in_progress').length,
        cancelled: response.data.filter(o => o.status === 'cancelled').length,
        totalAmount: totalAmount
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const getStatusChartData = () => {
    return {
      labels: ['Pending', 'In Progress', 'Delivered', 'Cancelled'],
      datasets: [
        {
          data: [stats.pending, stats.inProgress, stats.delivered, stats.cancelled],
          backgroundColor: [
            'rgba(255, 206, 86, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const getMonthlyOrdersData = () => {
    // Group orders by month
    const monthlyData = {};
    
    orders.forEach(order => {
      const date = new Date(order.collection_date || order.created_at);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          count: 0,
          amount: 0
        };
      }
      
      monthlyData[monthYear].count++;
      monthlyData[monthYear].amount += order.amount;
    });
    
    // Sort by date
    const sortedMonths = Object.keys(monthlyData).sort();
    
    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      datasets: [
        {
          label: 'Number of Orders',
          data: sortedMonths.map(month => monthlyData[month].count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Total Amount ($)',
          data: sortedMonths.map(month => monthlyData[month].amount),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          type: 'line',
          yAxisID: 'y1'
        }
      ]
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Client Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500 mt-1">All time orders</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          <p className="text-sm text-gray-500 mt-1">{Math.round((stats.pending / stats.totalOrders) * 100)}% of total</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">In Progress</h3>
          <p className="text-3xl font-bold text-orange-500">{stats.inProgress}</p>
          <p className="text-sm text-gray-500 mt-1">{Math.round((stats.inProgress / stats.totalOrders) * 100)}% of total</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500">Total Amount</h3>
          <p className="text-3xl font-bold text-green-500">${stats.totalAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">All orders value</p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status Distribution</h2>
          <div className="h-64">
            <Pie 
              data={getStatusChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const percentage = Math.round((value / stats.totalOrders) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Monthly Orders Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Orders & Revenue</h2>
          <div className="h-64">
            <Bar 
              data={getMonthlyOrdersData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Number of Orders'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Total Amount ($)'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.datasetIndex === 1) {
                          label += '$' + context.raw.toFixed(2);
                        } else {
                          label += context.raw;
                        }
                        return label;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <Link 
            to="/client/orders" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Orders
          </Link>
        </div>
        {loading ? (
          <div className="p-6 text-center">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.designation_product}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.collection_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/client/orders/${order.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </Link>
                      {order.status === 'pending' && (
                        <button className="text-red-600 hover:text-red-900">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">No orders found. Create your first order!</div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;