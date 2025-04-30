// src/pages/client/OrdersList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientAxios } from '../../api/axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await clientAxios.get('/orders');
        // Laravel retourne un objet avec `data` contenant la liste paginée
        setOrders(response.data.data); // 👈 On récupère uniquement le tableau d'ordres ici
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
        console.error(err);
      }
    };

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
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{order.order_number}</td>
                  <td className="py-2 px-4 border-b">{order.designation_product}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(order.collection_date).toLocaleDateString()}
                  </td>
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
        </div>
      )}
    </div>
  );
};

export default OrdersList;
