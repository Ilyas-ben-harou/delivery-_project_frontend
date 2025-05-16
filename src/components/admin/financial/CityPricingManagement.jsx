import React, { useState, useEffect } from 'react';
import { adminAxios } from '../../../api/axios';
import { Card, Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const CityPricingManagement = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });
  
  // Form state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    city: '',
    price: ''
  });
  
  // Success/error messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    setLoading(true);
    try {
      const response = await adminAxios.get('/financial/pricing');
      if (response.data.status === 'success') {
        setPricingData(response.data.data);
      }
    } catch (err) {
      setError('Failed to load pricing data');
      console.error('Error loading pricing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (pricing = null) => {
    if (pricing) {
      setFormData({
        id: pricing.id,
        city: pricing.city,
        price: pricing.price
      });
    } else {
      setFormData({
        id: null,
        city: '',
        price: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange({
      ...priceRange,
      [name]: value
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.city || !formData.price || formData.price <= 0) {
      setErrorMessage('Please enter a valid city name and price');
      return;
    }
    
    try {
      const response = await adminAxios.post('/financial/pricing', {
        city: formData.city,
        price: parseFloat(formData.price)
      });
      
      if (response.data.status === 'success') {
        setSuccessMessage('Pricing updated successfully');
        handleCloseModal();
        fetchPricingData();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      setErrorMessage('Failed to update pricing');
      console.error('Error updating pricing:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pricing?')) {
      try {
        const response = await adminAxios.delete(`/financial/pricing/${id}`);
        
        if (response.data.status === 'success') {
          setSuccessMessage('Pricing deleted successfully');
          fetchPricingData();
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }
      } catch (err) {
        setError('Failed to delete pricing');
        console.error('Error deleting pricing:', err);
      }
    }
  };

  const filteredPricingData = pricingData.filter(item => {
    // Filter by search term
    const matchesSearch = item.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by price range
    const price = parseFloat(item.price);
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : -Infinity;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPriceRange = price >= minPrice && price <= maxPrice;
    
    return matchesSearch && matchesPriceRange;
  });

  if (loading && pricingData.length === 0) {
    return (
      <div className="w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">City Pricing Management</h2>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">City Pricing Management</h2>
      
      {/* Search and Filter Card */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Search Pricing</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by City</label>
              <input
                type="text"
                placeholder="Search city..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={handlePriceRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={handlePriceRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button 
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mr-2"
                onClick={() => {}} // Search is handled automatically by the filtered data
              >
                Search
              </button>
              <button 
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-lg font-medium text-gray-800">Pricing List</h4>
              <p className="text-gray-500 text-sm">Manage city-based pricing for deliveries</p>
            </div>
            <button
              onClick={() => handleShowModal()}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <FaPlus className="mr-2" /> Add New City Pricing
            </button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Pricing Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPricingData.length > 0 ? (
                  filteredPricingData.map((pricing) => (
                    <tr key={pricing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pricing.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{pricing.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${pricing.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => handleShowModal(pricing)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(pricing.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      {pricingData.length === 0 ? 'No pricing data available' : 'No matching pricing found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
     
      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="md">
        <Modal.Header closeButton className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <Modal.Title className="text-gray-800 text-lg font-medium">
            {formData.id ? 'Edit City Pricing' : 'Add New City Pricing'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3 text-sm">
              {errorMessage}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="block text-sm font-medium text-gray-700 mb-1">City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. New York"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </Form.Group>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
                onClick={handleCloseModal}
                size="sm"
                className="px-3 py-1.5 text-sm"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                size="sm"
                className="px-3 py-1.5 text-sm"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CityPricingManagement;