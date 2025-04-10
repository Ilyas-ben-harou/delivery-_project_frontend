import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';
import Unauthorized from './components/common/Unauthorized';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import ClientDashboard from './components/client/ClientDashboard';
import LivreurDashboard from './components/livreur/LivreurDashboard';
import Register from './components/auth/Register';



const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* Admin routes */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Add more admin routes here */}
            </Route>
            
            {/* Client routes */}
            <Route element={<RoleRoute allowedRoles={['client']} />}>
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              {/* Add more client routes here */}
            </Route>
            
            {/* Livreur routes */}
            <Route element={<RoleRoute allowedRoles={['livreur']} />}>
              <Route path="/livreur/dashboard" element={<LivreurDashboard />} />
              {/* Add more livreur routes here */}
            </Route>
          </Route>
          
          {/* Redirect to login by default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;