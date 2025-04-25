// src/components/client/CreateOrder.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAxios } from '../../api/axios';
import { toast } from 'sonner'
import { useAuth } from '../../contexts/AuthContext';

const CreateOrder = () => {
  const navigate = useNavigate();
  const {user} = useAuth()
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    customer_full_name: '',
    customer_phone_number: '',
    customer_address: '',
    customer_city: '',
    zone_geographic_id: '',
    designation_product: '',
    product_width: '',
    product_height: '',
    weight: '',
    description: '',
    collection_date: '',
    amount: '',
    client_id:''
  });
  
  const createOrder = async (orderData) => {
    try {
      const response = await clientAxios.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while creating the order' };
    }
  };
  
  const getZoneGeographics = async () => {
    try {
      const response = await clientAxios.get('/zone-geographics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred while fetching zones' };
    }
  };

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await clientAxios.get('/zone-geographics');
        setZones(response.data.data);
      } catch (error) {
        console.error("Error details:", error.response || error);
        toast.error("Impossible de charger les zones géographiques. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchZones();
  }, []);

  useEffect(() => {
    setFormData({...formData, client_id: user?.client?.id || ''});
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await createOrder(formData);
      
      // Show different toast messages based on assignment status
      if (response.assigned) {
        toast.success('Order created and assigned to a deliverer successfully!');
      } else {
        toast.success('Order created successfully! No available deliverer was found in this zone.');
      }
      
      navigate('/client/orders');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create order. Please try again.');
      console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Order</h2>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-3">Customer Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="customer_full_name"
                value={formData.customer_full_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="customer_phone_number"
                value={formData.customer_phone_number}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="customer_address"
                value={formData.customer_address}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="customer_city"
                value={formData.customer_city}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zone
              </label>
              <select
                name="zone_geographic_id"
                value={formData.zone_geographic_id}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select a zone</option>
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {`${zone.city}, ${zone.secteur}`}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Orders are automatically assigned to available deliverers in this zone
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-3">Product Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name/Description
              </label>
              <input
                type="text"
                name="designation_product"
                value={formData.designation_product}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Width (optional)
              </label>
              <input
                type="text"
                name="product_width"
                value={formData.product_width}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height (optional)
              </label>
              <input
                type="text"
                name="product_height"
                value={formData.product_height}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight (optional)
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Description (optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-3">Order Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Collection Date
              </label>
              <input
                type="date"
                name="collection_date"
                value={formData.collection_date}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/client/orders')}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;