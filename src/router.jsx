import { createBrowserRouter } from "react-router-dom";

// Auth components
import Login from "./components/auth/Login";
// import Register from './components/auth/Register';
import ResetPassword from "./components/auth/ResetPassword";
import Unauthorized from "./components/common/Unauthorized";

// Dashboard components
import AdminDashboard from "./components/admin/AdminDashboard";
import ClientDashboard from "./components/client/ClientDashboard";
import LivreurDashboard from "./components/livreur/LivreurDashboard";

// Layout components
import AdminLayout from "./components/layouts/AdminLayout";
import ClientLayout from "./components/layouts/ClientLayout";
import LivreurLayout from "./components/layouts/LivreurLayout";

// Auth middleware
import {  requireRole } from "./middleware/auth";
import ForgotPassword from "./components/auth/ForgotPassword";
import Register from "./components/auth/Register";
// profiles
import AdminProfile from "./components/admin/AdminProfile";

// livreur managment by admin
import LivreurRegister from "./components/admin/livreurs/LivreurRegister";
import LivreurListing from "./components/admin/livreurs/LivreurListing";
import LivreurDetail from "./components/admin/livreurs/LivreurDetail"

//client actions
import CreateOrder from "./components/client/CreateOrder";
import OrdersList from "./components/client/OrdersList";


//admin gestion clients
import ClientListing from "./components/admin/clients/ClientListing";
import ClientRegister from "./components/admin/clients/ClientRegister";
import ClientDetail from "./components/admin/clients/ClientDetail";
import ClientUpdate from "./components/admin/clients/ClientUpdate";



import FinanceReportPage from "./components/admin/FinanceReportPage";
import OrdersManagement from "./components/admin/orders/OrdersManagement";
import RapportsFinances from "./components/admin/FinanceReportPage";
import RapportsPerformance from "./components/admin/rapports-performance";
import Home from "./components/home/Home";
import DetailOrder from "./components/client/DetailOrder";
import OrderDetail from "./components/admin/orders/OrderDetail";
import ZoneManagement from "./components/admin/zones/ZoneManagement";
import DocumentPreview from "./components/client/DocumentPreview";
import TrackOrder from "./components/client/TrackOrder";
import UpdateOrder from "./components/client/UpdateOrder";



const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/track-order/:id",
    element: <TrackOrder />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token/:email",
    element: <ResetPassword />,
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    loader: () => requireRole("admin"),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "profile",
        element: <AdminProfile />,
      },
      {
        path: "livreur/create",
        element: <LivreurRegister />,
      },
      {
        path: "livreurs",
        element: <LivreurListing />,
      },
      {
        path: "livreurs/:id",
        element: <LivreurDetail />,
      },
      {
        path: "clients",
        element: <ClientListing />,
      },
      {
        path: "clients/create",
        element: <ClientRegister />,
      },
      {
        path: "clients/:id",
        element: <ClientDetail />,
      },
      {
        path: "/admin/clients/:id/edit",
        element: <ClientUpdate />,
      },
      {
        path: "orders",
        element: <OrdersManagement />,
      },
      {
        path: "orders/:id",
        element: <OrderDetail />,
      },

      {
        path: "zones",
        element: <ZoneManagement />,
      },
      
      {
        path: "reports",
        element: <RapportsFinances />,
      },
      {
        path: "Performance",
        element: <RapportsPerformance />,
      },
    ],
  },

  // Client routes
  {
    path: "/client",
    element: <ClientLayout />,
    loader: () => requireRole("client"),
    children: [
      {
        path: "dashboard",
        element: <ClientDashboard />,
      },
      { path: 'orders', element: <OrdersList /> },
      { path: 'orders/create', element: <CreateOrder /> },
      { path: 'orders/:id', element: <DetailOrder /> },
      { path: 'orders/:id/edit', element: <UpdateOrder /> },
      { path: 'documents', element: <DocumentPreview /> },
      { path: 'track-order/:id', element: <TrackOrder /> },
      
      // Add more client routes here
    ],
  },

  // Livreur routes
  {
    path: "/livreur",
    element: <LivreurLayout />,
    loader: () => requireRole("livreur"),
    children: [
      {
        path: "dashboard",
        element: <LivreurDashboard />,
      },
      // Add more livreur routes here
    ],
  },

  // Default redirect to login
  
  {
    path: "*",
    loader: () => {
      window.location.href = "/Unauthorized";
      return null;
    },
  },
]);

export default router;
