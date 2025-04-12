import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "../admin/AdminSidebar";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  
  return (
    <div>
      <AdminSidebar onLogout={handleLogout}>
        <Outlet />
      </AdminSidebar>
    </div>
  );
};

export default AdminLayout;