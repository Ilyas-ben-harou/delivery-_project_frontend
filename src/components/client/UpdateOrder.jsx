import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientAxios } from "../../api/axios";

const UpdateOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    order_number: "",
    designation_product: "",
    description: "",
    product_width: "",
    product_height: "",
    weight: "",
    collection_date: "",
    delivery_date: "",
    amount: "",
    status: "pending",
    customer_info: {
      full_name: "",
      phone_number: "",
      address: "",
      city: ""
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Fetch existing order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await clientAxios.get(`/orders/${id}`);
        console.log
        const fetchedOrder = response.data.data;
        
        // Map fetched order to component state
        setOrder({
          order_number: fetchedOrder.order_number || "",
          designation_product: fetchedOrder.designation_product || "",
          description: fetchedOrder.description || "",
          product_width: fetchedOrder.product_width || "",
          product_height: fetchedOrder.product_height || "",
          weight: fetchedOrder.weight || "",
          collection_date: fetchedOrder.collection_date ? 
            new Date(fetchedOrder.collection_date).toISOString().split('T')[0] : "",
          delivery_date: fetchedOrder.delivery_date ? 
            new Date(fetchedOrder.delivery_date).toISOString().split('T')[0] : "",
          amount: fetchedOrder.amount || "",
          status: fetchedOrder.status || "pending",
          customer_info: {
            full_name: fetchedOrder.customer_info?.full_name || "",
            phone_number: fetchedOrder.customer_info?.phone_number || "",
            address: fetchedOrder.customer_info?.address || "",
            city: fetchedOrder.customer_info?.city || ""
          }
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(
          err.response?.data?.message || 
          "Failed to fetch order details. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested customer_info fields
    if (name.startsWith("customer_info.")) {
      const field = name.split(".")[1];
      setOrder(prev => ({
        ...prev,
        customer_info: {
          ...prev.customer_info,
          [field]: value
        }
      }));
    } else {
      setOrder(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Submit updated order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      // Prepare data for submission
      const submitData = {
        ...order,
        collection_date: order.collection_date ? 
          new Date(order.collection_date).toISOString().split('T')[0] : null,
        delivery_date: order.delivery_date ? 
          new Date(order.delivery_date).toISOString().split('T')[0] : null,
      };

      // Submit update
      await clientAxios.put(`/orders/${id}`, submitData);
      
      // Redirect to order details or list
      navigate(`/orders/${id}`);
    } catch (err) {
      console.error("Error updating order:", err);
      setSubmitError(
        err.response?.data?.message || 
        "Failed to update order. Please try again."
      );
    }
  };

  // Cancel and go back
  const goBack = () => {
    navigate(-1);
  };

  // Status options
  const statusOptions = [
    "pending", 
    "processing", 
    "delivered", 
    "cancelled"
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={goBack}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-6">
        <button
          onClick={goBack}
          className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Update Order #{order.order_number}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {submitError}
          </div>
        )}

        {/* Order Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Product Designation
                </label>
                <input
                  type="text"
                  name="designation_product"
                  value={order.designation_product}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={order.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Product Width
                  </label>
                  <input
                    type="text"
                    name="product_width"
                    value={order.product_width}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Product Height
                  </label>
                  <input
                    type="text"
                    name="product_height"
                    value={order.product_height}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  name="weight"
                  value={order.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Collection Date
                </label>
                <input
                  type="date"
                  name="collection_date"
                  value={order.collection_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Delivery Date
                </label>
                <input
                  type="date"
                  name="delivery_date"
                  value={order.delivery_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={order.amount}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={order.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="customer_info.full_name"
                value={order.customer_info.full_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="customer_info.phone_number"
                value={order.customer_info.phone_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                name="customer_info.address"
                value={order.customer_info.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                City
              </label>
              <input
                type="text"
                name="customer_info.city"
                value={order.customer_info.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={goBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrder;