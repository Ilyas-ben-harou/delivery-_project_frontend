import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientAxios } from '../../api/axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('collection_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await clientAxios.get('/orders');
        setOrders(response.data);
        
        // Extract unique zones from orders for filter
        const uniqueZones = [...new Set(response.data.map(order => 
          order.customer_info?.zone_geographic_id
        ))].filter(Boolean);
        
        setZones(uniqueZones);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  // Status filter handler
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Zone filter handler
  const handleZoneFilter = (zone) => {
    setZoneFilter(zone);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Search handler
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status text
  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Filter orders by status, zone and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter;
    const matchesZone = zoneFilter === 'all' ? true : order.customer_info?.zone_geographic_id.toString() === zoneFilter;
    
    const matchesSearch = searchTerm === '' ? true : (
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.designation_product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_info?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_info?.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return matchesStatus && matchesZone && matchesSearch;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? parseFloat(a.amount) - parseFloat(b.amount)
        : parseFloat(b.amount) - parseFloat(a.amount);
    } else if (sortField === 'customer_name') {
      const valueA = a.customer_info?.full_name || '';
      const valueB = b.customer_info?.full_name || '';
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else {
      const valueA = a[sortField] || '';
      const valueB = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    }
  });

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    
    // Always show first page, last page, current page, and one page before and after current
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(i);
      } else if (
        (i === currentPage - 2 && currentPage > 3) || 
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        pageNumbers.push('...');
      }
    }
    
    // Remove duplicates
    const uniquePageNumbers = pageNumbers.filter((number, index, self) => 
      self.indexOf(number) === index
    );

    return (
      <div className="flex justify-center mt-6 space-x-1">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          Previous
        </button>
        
        {uniquePageNumbers.map((number, index) => (
          <button
            key={index}
            onClick={() => number !== '...' && setCurrentPage(number)}
            className={`px-3 py-1 rounded ${
              number === currentPage
                ? 'bg-blue-600 text-white'
                : number === '...'
                ? 'bg-white text-gray-600 cursor-default'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {number}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages || totalPages === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      await clientAxios.put(`/orders/${orderId}/status`, {
        status: 'cancelled'
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center my-10">
      {error}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Link
          to="/client/orders/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Order
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by order #, product, customer name, or city..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filters</h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          {/* Status filter */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                All
              </button>
              {['pending', 'in_transit', 'delivered', 'failed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : `hover:bg-gray-200 ${getStatusBadgeStyle(status)}`
                  }`}
                >
                  {formatStatus(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Zone filter */}
          {zones.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Zone</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleZoneFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    zoneFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  All Zones
                </button>
                {zones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => handleZoneFilter(zone.toString())}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      zoneFilter === zone.toString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Zone {zone}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You don't have any orders yet.</p>
          <Link
            to="/client/orders/create"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Order
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No orders match the selected filters.</p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setZoneFilter('all');
              setSearchTerm('');
            }}
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('order_number')}
                  >
                    <div className="flex items-center">
                      Order # 
                      <SortIndicator field="order_number" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('designation_product')}
                  >
                    <div className="flex items-center">
                      Product
                      <SortIndicator field="designation_product" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('collection_date')}
                  >
                    <div className="flex items-center">
                      Collection Date
                      <SortIndicator field="collection_date" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('customer_name')}
                  >
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      <SortIndicator field="amount" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <SortIndicator field="status" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-gray-700">
                      {order.designation_product}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-gray-700">
                      {new Date(order.collection_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-gray-700">
                      {order.customer_info?.full_name}
                      <div className="text-xs text-gray-500">
                        {order.customer_info?.city}
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-gray-700">
                      ${parseFloat(order.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/client/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </Link>

                                      <Link
                        to={`/client/orders/${order.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        update
                      </Link>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && <Pagination />}
          
          {/* Orders count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersList;