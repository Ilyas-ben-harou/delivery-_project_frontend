import { QRCodeSVG } from "qrcode.react";
import React from "react";


// Simple functional component - no need for refs or class components
const DeliveryDocument = ({ order }) => {
  // Create a tracking URL based on the current location
  const trackingUrl = `${window.location.origin}/track-order/${
    order.id || "unknown"
  }`;
  const currentDate = new Date().toLocaleDateString();

  // Create formatted data for the document with fallbacks for all properties
  const formattedOrder = {
    order_number: order.order_number || "N/A",
    status: order.status || "Processing",
    tracking_number: order.tracking_number || order.id || "N/A",
    items: [
      {
        name: order.designation_product || "Package",
        quantity: 1,
        weight: order.weight || "N/A",
      },
    ],
    sender: {
      name: "Your Company Name",
      address: "Your Company Address",
      contact: "Your Company Contact",
    },
    recipient: {
      name: order.customer_info?.full_name || "Customer",
      address: order.customer_info?.address || "N/A",
      contact: order.customer_info?.phone_number || "N/A",
    },
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white font-sans">
      <div className="border-2 border-gray-800 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Delivery Document
            </h1>
            <p className="text-gray-600">
              Order #{formattedOrder.order_number}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Date: {currentDate}</p>
            <p className="text-gray-600">Status: {formattedOrder.status}</p>
          </div>
        </div>

        {/* Sender and Recipient Information */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Sender Information
            </h2>
            <p className="text-gray-700">{formattedOrder.sender.name}</p>
            <p className="text-gray-600">{formattedOrder.sender.address}</p>
            <p className="text-gray-600">{formattedOrder.sender.contact}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Recipient Information
            </h2>
            <p className="text-gray-700">{formattedOrder.recipient.name}</p>
            <p className="text-gray-600">{formattedOrder.recipient.address}</p>
            <p className="text-gray-600">{formattedOrder.recipient.contact}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Order Details
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Item</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              {formattedOrder.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">{item.weight} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tracking Information */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-4">Tracking Information</h2>
            <p className="text-gray-700">
              Tracking Number: {formattedOrder.tracking_number}
            </p>
            <p className="text-gray-600">
              Track your package at: {trackingUrl}
            </p>
          </div>
          <div className="w-32 h-32">
            <QRCodeSVG
              value={trackingUrl}
              size={128}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mt-8 pt-4 border-t text-sm text-gray-600">
          <p>
            Note: Please keep this document for your records. Contact customer
            support for any inquiries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDocument;
