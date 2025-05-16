import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LivreurLayout = () => {
    const { user, logout, updateLivreur } = useAuth();
    const navigate = useNavigate();
    const livreurInfo = user?.livreur;
    const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        disponible: false
    });

    // Update form data when user info changes
    useEffect(() => {
        if (livreurInfo) {
            setFormData({
                startDate: livreurInfo.unavailablePeriod?.start || '',
                endDate: livreurInfo.unavailablePeriod?.end || '',
                reason: livreurInfo.unavailablePeriod?.reason || '',
                disponible: livreurInfo.disponible || false
            });
        }
    }, [livreurInfo]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleAvailabilityForm = () => {
        setShowAvailabilityForm(!showAvailabilityForm);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // If currently available, we're setting to unavailable
            if (livreurInfo?.disponible) {
                await updateLivreur({
                    disponible: false,
                    unavailablePeriod: {
                        start: formData.startDate,
                        end: formData.endDate,
                        reason: formData.reason
                    }
                });
            } else {
                // If currently unavailable, we're setting to available
                await updateLivreur({
                    disponible: true,
                    unavailablePeriod: null
                });
            }
            
            setShowAvailabilityForm(false);
        } catch (error) {
            console.error("Error updating availability:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="text-xl font-bold text-indigo-600">Delivery Livreur</div>
                            <nav className="ml-6 flex space-x-8">
                                <a href="/livreur/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Dashboard</a>
                                <a href="/livreur/earnings" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">My Earnings</a>
                                <a href="/livreur/scan" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Scan QR</a>
                                <a href="/livreur/profile" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Profile</a>
                            </nav>
                        </div>
                        <div className="flex items-center relative">
                            <button
                                onClick={toggleAvailabilityForm}
                                className="flex items-center text-sm rounded-full focus:outline-none mr-4"
                            >
                                <span className="mr-2">
                                    {livreurInfo?.first_name} {livreurInfo?.last_name}
                                    <span className={`ml-1 ${livreurInfo?.disponible ? 'text-green-500' : 'text-red-500'}`}>
                                        {livreurInfo?.disponible ? ' (Available)' : ' (Unavailable)'}
                                    </span>
                                </span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-white border border-red-500 text-red-500 hover:bg-red-50 px-3 py-1 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>

                            {showAvailabilityForm && (
                                <div className="absolute right-0 top-12 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <form onSubmit={handleSubmit} className="p-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-3">
                                            {livreurInfo?.disponible ? 'Declare Unavailability' : 'Declare Availability'}
                                        </h4>

                                        {livreurInfo?.disponible ? (
                                            // Form for becoming unavailable
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                    <input
                                                        type="date"
                                                        name="startDate"
                                                        value={formData.startDate}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                    <input
                                                        type="date"
                                                        name="endDate"
                                                        value={formData.endDate}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                                    <textarea
                                                        name="reason"
                                                        value={formData.reason}
                                                        onChange={handleInputChange}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            // Simple message for becoming available
                                            <div className="space-y-2 mb-4">
                                                <p className="text-sm text-gray-600 mb-3">Are you now available for deliveries?</p>
                                                <div className="flex items-center">
                                                    <span className="block text-sm text-gray-700">Mark yourself as available</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex space-x-2 mt-4">
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={() => setShowAvailabilityForm(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Delivery System. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LivreurLayout;