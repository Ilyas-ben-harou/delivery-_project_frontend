import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, Search, Save, X } from 'lucide-react';
import { adminAxios } from '../../../api/axios';

export default function ZoneManagement() {
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [formData, setFormData] = useState({ city: '', secteur: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API fetch for demo purposes
  useEffect(() => {
    // Mock API call
    const fetchZones = async() => {
        setIsLoading(true);
        try{
            const response = await adminAxios.get('/zone-geographics')
            console.log('response',response.data)
            setZones(response.data.data)
        }catch (error) {
            console.error('Error fetching zones:', error);
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
        // Simulating API delay
    };

    fetchZones();
  }, []);

  const handleOpenModal = (zone = null) => {
    if (zone) {
      setEditingZone(zone);
      setFormData({ city: zone.city, secteur: zone.secteur });
    } else {
      setEditingZone(null);
      setFormData({ city: '', secteur: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingZone(null);
    setFormData({ city: '', secteur: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async () => {
    if (editingZone) {
      try {
        // The correct endpoint should be /zone-geographics/{id}
        const response = await adminAxios.put(`/zone-geographics/${editingZone.id}`, formData);
        
        // Update only the specific zone that was edited
        const updatedZones = zones.map(zone => 
          zone.id === editingZone.id ? response.data.data : zone
        );
        setZones(updatedZones);
      } catch (error) {
        console.error('Error updating zone:', error);
        return;
      }
    } else {
      try {
        // The correct endpoint for creating a new zone
        const response = await adminAxios.post('/zone-geographics', formData);
        
        // Add the newly created zone to the list
        setZones([...zones, response.data.data]);
      } catch (error) {
        console.error('Error creating zone:', error);
        return;
      }
    }
    
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      try {
        // Delete request to backend
        await adminAxios.delete(`/zone-geographics/${id}`);
        
        // Remove the deleted zone from the list
        setZones(zones.filter(zone => zone.id !== id));
      } catch (error) {
        console.error('Error deleting zone:', error);
        return;
      }
    }
  };

  // Filter zones based on search term
  const filteredZones = zones.filter(zone => 
    zone.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
    zone.secteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Zone Geographic Management</h1>
      
      {/* Search and Add Bar */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search zones..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <button
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          onClick={() => handleOpenModal()}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New Zone</span>
        </button>
      </div>
      
      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredZones.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 font-medium">No zones found</p>
              {searchTerm && (
                <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 font-semibold text-gray-700">ID</th>
                    <th className="p-4 font-semibold text-gray-700">City</th>
                    <th className="p-4 font-semibold text-gray-700">Secteur</th>
                    <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredZones.map((zone) => (
                    <tr key={zone.id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-800">{zone.id}</td>
                      <td className="p-4 text-gray-800">{zone.city}</td>
                      <td className="p-4 text-gray-800">{zone.secteur}</td>
                      <td className="p-4 flex justify-end gap-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          onClick={() => handleOpenModal(zone)}
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                          onClick={() => handleDelete(zone.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingZone ? 'Edit Zone' : 'Add New Zone'}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCloseModal}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="secteur" className="block text-sm font-medium text-gray-700 mb-1">
                  Secteur
                </label>
                <input
                  type="text"
                  id="secteur"
                  name="secteur"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.secteur}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={handleSubmit}
                >
                  <Save className="w-5 h-5" />
                  {editingZone ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}