// src/pages/TrackOrder.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { clientAxios } from '../../api/axios';

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await clientAxios.get(`/orders/${id}`);
        setOrder(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to fetch order details. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Tracking - #{order.order_number}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Status</h2>
        <div className="flex items-center">
          <span className={`px-4 py-2 rounded-full font-medium ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Customer Details</h3>
            <p>{order.customer_info?.full_name}</p>
            <p>{order.customer_info?.address}</p>
            <p>{order.customer_info?.city}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Delivery Agent</h3>
            {order.livreur ? (
              <>
                <p>{order.livreur.first_name} {order.livreur.last_name}</p>
                <p>{order.livreur.user?.phone_number}</p>
              </>
            ) : (
              <p>Not assigned yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;