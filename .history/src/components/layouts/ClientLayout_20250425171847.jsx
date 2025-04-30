import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ClientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const clientInfo = user?.client;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">Delivery Client</h1>
            <p className="text-sm text-gray-500">{clientInfo?.company_name || 'Client'}</p>
          </div>

          <nav className="flex flex-col gap-1 p-4 text-sm">
            <NavLink
              to="/client/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded hover:bg-blue-100 ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/client/orders"
              className={({ isActive }) =>
                `px-4 py-2 rounded hover:bg-blue-100 ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`
              }
            >
              My Orders
            </NavLink>
            <NavLink
              to="/client/orders/create"
              className={({ isActive }) =>
                `px-4 py-2 rounded hover:bg-blue-100 ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`
              }
            >
              New Order
            </NavLink>
            <NavLink
              to="/client/documents"
              className={({ isActive }) =>
                `px-4 py-2 rounded hover:bg-blue-100 ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`
              }
            >
              Documents
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-600 hover:text-white hover:bg-red-500 border border-red-500 rounded transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
        <footer className="mt-10 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Delivery System. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default ClientLayout;
