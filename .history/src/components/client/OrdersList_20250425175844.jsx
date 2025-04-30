// src/pages/client/OrdersList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientAxios } from '../../api/axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await clientAxios.get(`/orders?page=${page}`);
      setOrders(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10">Loading orders...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Link
          to="/client/orders/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You don't have any orders yet.</p>
          <Link
            to="/client/orders/create"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Your First Order
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Order #</th>
                <th className="py-2 px-4 border-b text-left">Product</th>
                <th className="py-2 px-4 border-b text-left">Collection Date</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{order.order_number}</td>
                  <td className="py-2 px-4 border-b">{order.designation_product}</td>
                  <td className="py-2 px-4 border-b">{new Date(order.collection_date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">${order.amount}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/client/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: pagination.last_page }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => fetchOrders(i + 1)}
                className={`px-3 py-1 rounded ${
                  pagination.current_page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
