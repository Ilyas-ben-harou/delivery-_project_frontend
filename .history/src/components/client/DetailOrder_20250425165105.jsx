import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { clientAxios } from "../../api/axios";

const DetailOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await clientAxios.get(`/orders/${id}`);
        console.log(response.data.data);
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const goBack = () => {
    navigate(-1);
  };

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
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-150"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Order not found.
        </div>
        <button
          onClick={goBack}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-150"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
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
          Order #{order.order_number}
        </h1>
        <span
          className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-600">Order Number:</div>
                <div className="font-medium">{order.order_number}</div>

                <div className="text-gray-600">Amount:</div>
                <div className="font-medium">
                  {formatCurrency(order.amount)}
                </div>

                <div className="text-gray-600">Collection Date:</div>
                <div className="font-medium">
                  {formatDate(order.collection_date)}
                </div>

                <div className="text-gray-600">Delivery Date:</div>
                <div className="font-medium">
                  {formatDate(order.delivery_date)}
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-600">Product:</div>
                <div className="font-medium">{order.designation_product}</div>

                <div className="text-gray-600">Dimensions:</div>
                <div className="font-medium">
                  {order.product_width} × {order.product_height}
                </div>

                <div className="text-gray-600">Weight:</div>
                <div className="font-medium">{order.weight} kg</div>

                <div className="text-gray-600">Description:</div>
                <div className="font-medium">{order.description || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        {order.customer_info && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-600">Name:</div>
                <div className="font-medium">{order.cu.full_name}</div>

                <div className="text-gray-600">Email:</div>
                <div className="font-medium">{order.client.email || "N/A"}</div>

                <div className="text-gray-600">Phone:</div>
                <div className="font-medium">{order.client.phone || "N/A"}</div>
              </div>
            </div>
          </div>
        )}

        {order.customer_info && (
          <div>

          </div>
          
        )}

        {order.livreur && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Delivery Agent
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-600">Name:</div>
                <div className="font-medium">{order.livreur.name || "N/A"}</div>

                <div className="text-gray-600">Phone:</div>
                <div className="font-medium">
                  {order.livreur.phone || "N/A"}
                </div>

                <div className="text-gray-600">Vehicle:</div>
                <div className="font-medium">
                  {order.livreur.vehicle_type || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {order.payment && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-600">Method:</div>
                <div className="font-medium">
                  {order.payment.method || "N/A"}
                </div>

                <div className="text-gray-600">Status:</div>
                <div className="font-medium">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.payment.status === "paid"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    }`}
                  >
                    {order.payment.status || "N/A"}
                  </span>
                </div>

                <div className="text-gray-600">Date:</div>
                <div className="font-medium">
                  {order.payment.date ? formatDate(order.payment.date) : "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {order.notes && order.notes.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Notes
            </h2>
            <div className="space-y-4">
              {order.notes.map((note, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800">{note.content}</p>
                    <div className="text-sm text-gray-500">
                      {formatDate(note.created_at)}
                    </div>
                  </div>
                  {note.user && (
                    <div className="mt-2 text-sm text-gray-600">
                      Added by: {note.user.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {order.history && order.history.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order History
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {order.history.map((event, index) => (
                  <div key={index} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 h-7 w-7 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {event.action}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(event.created_at)}
                      </span>
                      {event.user && (
                        <span className="text-xs text-gray-500">
                          By: {event.user.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {order.deliveryDocument && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Delivery Document
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {order.deliveryDocument.title || "Delivery Document"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.deliveryDocument.created_at
                      ? formatDate(order.deliveryDocument.created_at)
                      : "N/A"}
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-end">
        <button
          onClick={goBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Back to Orders
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
          Edit Order
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200">
          Update Status
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200">
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default DetailOrder;
