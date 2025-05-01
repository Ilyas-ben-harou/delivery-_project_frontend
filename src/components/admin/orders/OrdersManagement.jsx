import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DayPicker } from 'react-day-picker';
import {
  Calendar as CalendarIcon,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  AlertCircle,
  Loader
} from "lucide-react";
import { adminAxios } from "../../../api/axios";

const ORDER_STATUS = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  FAILED: "failed",
  CANCELLED: "cancelled"
};

const STATUS_LABELS = {
  pending: "En attente",
  assigned: "Assignée",
  in_transit: "En cours",
  delivered: "Livrée",
  failed: "Échouée",
  cancelled: "Annulée"
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLivreursLoading, setIsLivreursLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [dateFilter, setDateFilter] = useState(null);
  const [livreurFilter, setLivreurFilter] = useState("tous");

  // Dropdown states
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [livreurDropdownOpen, setLivreurDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Refs for click outside handling
  const calendarRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const livreurDropdownRef = useRef(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Show toast message
  const showToast = useCallback((title, description, variant = "default") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await adminAxios.get('/orders');
        setOrders(response.data.data.orders);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Impossible de charger les commandes. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch livreurs from API
  useEffect(() => {
    const fetchLivreurs = async () => {
      setIsLivreursLoading(true);
      try {
        const response = await adminAxios.get('/livreurs');
        setLivreurs(response.data.data);
      } catch (err) {
        console.error("Error fetching livreurs:", err);
        showToast(
          "Erreur",
          "Impossible de charger la liste des livreurs. Veuillez réessayer plus tard.",
          "error"
        );
      } finally {
        setIsLivreursLoading(false);
      }
    };

    fetchLivreurs();
  }, [showToast]);

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
      if (livreurDropdownRef.current && !livreurDropdownRef.current.contains(event.target)) {
        setLivreurDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.order_number.toLowerCase().includes(query) ||
          order.client.name.toLowerCase().includes(query) ||
          order.client.phone_number.includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "tous") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      result = result.filter((order) => {
        const orderDate = new Date(order.collection_date);
        return (
          orderDate.getDate() === filterDate.getDate() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    // Apply livreur filter
    if (livreurFilter !== "tous") {
      if (livreurFilter === "non_assigné") {
        result = result.filter((order) => !order.livreur);
      } else {
        const livreurId = parseInt(livreurFilter, 10);
        result = result.filter((order) => order.livreur?.id === livreurId);
      }
    }

    // Apply tab filters
    if (activeTab === "pending") {
      result = result.filter(order => order.status === ORDER_STATUS.PENDING);
    } else if (activeTab === "active") {
      result = result.filter(order =>
        order.status === ORDER_STATUS.ASSIGNED ||
        order.status === ORDER_STATUS.IN_TRANSIT
      );
    } else if (activeTab === "completed") {
      result = result.filter(order => order.status === ORDER_STATUS.DELIVERED);
    } else if (activeTab === "failed") {
      result = result.filter(order =>
        order.status === ORDER_STATUS.FAILED ||
        order.status === ORDER_STATUS.CANCELLED
      );
    }

    return result;
  }, [orders, searchQuery, statusFilter, dateFilter, livreurFilter, activeTab]);

  // Sort livreurs by name
  const sortedLivreurs = useMemo(() => {
    return [...livreurs].sort((a, b) => a.name?.localeCompare(b.name));
  }, [livreurs]);

  // Pagination calculations
  const paginatedOrders = useMemo(() => {
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    return filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  }, [filteredOrders, currentPage, ordersPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Change page
  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  // Export list to Excel
  const handleExport = useCallback(() => {
    showToast(
      "Export en cours",
      "La fonctionnalité d'exportation sera implémentée prochainement."
    );
  }, [showToast]);

  // Handle order status change
  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      await adminAxios.patch(`/orders/${orderId}/status`, { status: newStatus });

      setOrders(prevOrders =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      showToast(
        "Statut mis à jour",
        `La commande ${orderId} a été mise à jour avec succès.`
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      showToast(
        "Erreur",
        "Impossible de changer le statut de la commande.",
        "error"
      );
    }
  }, [showToast]);

  // Handle livreur assignment
  const handleAssignLivreur = useCallback(async (orderId, livreurId) => {
    try {
      const livreur = livreurs.find((d) => d.id === parseInt(livreurId, 10));

      if (!livreur) {
        throw new Error("Livreur not found");
      }

      await adminAxios.patch(`/orders/${orderId}/assign`, { livreur_id: parseInt(livreurId, 10) });

      setOrders(prevOrders =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
              ...order,
              livreur,
              status: order.status === ORDER_STATUS.PENDING ? ORDER_STATUS.ASSIGNED : order.status,
            }
            : order
        )
      );

      showToast(
        "Livreur assigné",
        `La commande ${orderId} a été assignée à ${livreur.name}.`
      );
    } catch (err) {
      console.error("Error assigning livreur:", err);
      showToast(
        "Erreur",
        "Impossible d'assigner un livreur à la commande.",
        "error"
      );
    }
  }, [livreurs, showToast]);

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: fr });
  }, []);

  // Get status badge
  const getStatusBadge = useCallback((status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      assigned: "bg-blue-100 text-blue-800 border-blue-300",
      in_transit: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      failed: "bg-red-100 text-red-800 border-red-300",
      cancelled: "bg-gray-100 text-gray-800 border-gray-300",
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClasses[status]} border`}>
        {STATUS_LABELS[status]}
      </span>
    );
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("tous");
    setDateFilter(null);
    setLivreurFilter("tous");
    setCurrentPage(1);
  }, []);

  // Toast component
  const Toast = ({ title, description, variant, onClose }) => {
    const variantClasses = {
      default: "bg-blue-50 border-blue-300 text-blue-800",
      error: "bg-red-50 border-red-300 text-red-800",
      success: "bg-green-50 border-green-300 text-green-800"
    };

    return (
      <div className={`fixed top-4 right-4 max-w-md border rounded-lg shadow-lg p-4 ${variantClasses[variant]}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {variant === "error" && <AlertCircle className="h-5 w-5 mr-2" />}
            <h4 className="font-medium">{title}</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {description && <p className="mt-1 text-sm">{description}</p>}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 flex flex-row items-center justify-between border-b">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des livraisons</h2>
        <button
          type="button"
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex space-x-6">
            <button
              type="button"
              className={`pb-3 px-1 ${activeTab === "all"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("all")}
            >
              Toutes
            </button>
            <button
              type="button"
              className={`pb-3 px-1 ${activeTab === "pending"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("pending")}
            >
              En attente
            </button>
            <button
              type="button"
              className={`pb-3 px-1 ${activeTab === "active"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("active")}
            >
              En cours
            </button>
            <button
              type="button"
              className={`pb-3 px-1 ${activeTab === "completed"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("completed")}
            >
              Complétées
            </button>
            <button
              type="button"
              className={`pb-3 px-1 ${activeTab === "failed"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("failed")}
            >
              Échouées
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Filter */}
            <div>
              <label htmlFor="search" className="block mb-1 text-sm font-medium text-gray-700">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  id="search"
                  type="text"
                  placeholder="N° commande, client ou téléphone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="statusFilter" className="block mb-1 text-sm font-medium text-gray-700">
                Statut
              </label>
              <div className="relative" ref={statusDropdownRef}>
                <button
                  id="statusFilter"
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <span>{statusFilter === "tous" ? "Tous les statuts" : STATUS_LABELS[statusFilter]}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {statusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter("tous");
                            setStatusDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Tous les statuts
                        </button>
                      </li>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <li key={value}>
                          <button
                            type="button"
                            onClick={() => {
                              setStatusFilter(value);
                              setStatusDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label htmlFor="dateFilter" className="block mb-1 text-sm font-medium text-gray-700">
                Date de collecte
              </label>
              <div className="relative" ref={calendarRef}>
                <button
                  id="dateFilter"
                  type="button"
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    <span>
                      {dateFilter ? format(dateFilter, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {calendarOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 text-xs leading-tight p-2">
                    <DayPicker
                      mode="single"
                      selected={dateFilter}
                      onSelect={(date) => {
                        setDateFilter(date);
                        setCalendarOpen(false);
                      }}
                      locale={fr}
                      className="text-xs"
                      styles={{
                        day: { padding: '0.25rem', height: '1.5rem', width: '1.5rem' },
                        caption: { marginBottom: '0.5rem' },
                      }}
                    />
                  </div>
                )}

                {dateFilter && (
                  <button
                    type="button"
                    onClick={() => setDateFilter(null)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* Livreur Filter */}
            <div>
              <label htmlFor="livreurFilter" className="block mb-1 text-sm font-medium text-gray-700">
                Livreur
              </label>
              <div className="relative" ref={livreurDropdownRef}>
                <button
                  id="livreurFilter"
                  type="button"
                  onClick={() => setLivreurDropdownOpen(!livreurDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {isLivreursLoading ? (
                    <div className="flex items-center">
                      <Loader className="animate-spin h-4 w-4 mr-2 text-gray-400" />
                      <span>Chargement...</span>
                    </div>
                  ) : (
                    <span>
                      {livreurFilter === "tous"
                        ? "Tous les livreurs"
                        : livreurFilter === "non_assigné"
                          ? "Non assigné"
                          : sortedLivreurs.find(l => l.id.toString() === livreurFilter)?.name || "Livreur non trouvé"}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {livreurDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {isLivreursLoading ? (
                      <div className="py-4 text-center text-sm text-gray-500">
                        <Loader className="animate-spin h-5 w-5 mx-auto mb-2" />
                        Chargement des livreurs...
                      </div>
                    ) : (
                      <ul className="py-1 max-h-60 overflow-auto">
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              setLivreurFilter("tous");
                              setLivreurDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Tous les livreurs
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              setLivreurFilter("non_assigné");
                              setLivreurDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Non assigné
                          </button>
                        </li>
                        {sortedLivreurs.map((livreur) => (
                          <li key={livreur.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setLivreurFilter(livreur.id.toString());
                                setLivreurDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              {livreur.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            {filteredOrders.length} commande(s) trouvée(s)
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="mr-2 h-4 w-4" />
            Réinitialiser les filtres
          </button>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 w-full bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-300">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Commande
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livreur
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      livreurs={sortedLivreurs}
                      livreursLoading={isLivreursLoading}
                      onStatusChange={handleStatusChange}
                      onAssignLivreur={handleAssignLivreur}
                      formatDate={formatDate}
                      getStatusBadge={getStatusBadge}
                      STATUS_LABELS={STATUS_LABELS}
                      ORDER_STATUS={ORDER_STATUS}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Aucune commande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <button
                type="button"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <span className="sr-only">Page précédente</span>
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => paginate(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border ${currentPage === index + 1
                    ? "z-10 bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <span className="sr-only">Page suivante</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// Order Row Component
const OrderRow = ({
  order,
  livreurs,
  livreursLoading,
  onStatusChange,
  onAssignLivreur,
  formatDate,
  getStatusBadge,
  STATUS_LABELS,
  ORDER_STATUS
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);
  const actionDropdownRef = useRef(null);

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setStatusDropdownOpen(false);
      }
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine if status change is allowed
  const canChangeStatus = (currentStatus, newStatus) => {
    const statusHierarchy = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.ASSIGNED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.ASSIGNED]: [ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.IN_TRANSIT]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.FAILED],
      [ORDER_STATUS.DELIVERED]: [],
      [ORDER_STATUS.FAILED]: [],
      [ORDER_STATUS.CANCELLED]: []
    };

    return statusHierarchy[currentStatus]?.includes(newStatus) || false;
  };

  return (
    <tr>
      <td className="px-4 py-4 whitespace-nowrap">
        <Link
          to={`/admin/orders/${order.id}`}
          className="text-blue-600 hover:text-blue-900 font-medium"
        >
          {order.order_number}
        </Link>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-gray-900">{order.designation_product || "N/A"}</div>
        <div className="text-xs text-gray-500">{order.description?.substring(0, 50) || "Aucune description"}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm font-medium text-gray-900">{order.client?.name || "N/A"}</div>
        <div className="text-xs text-gray-500">{order.client.user?.phone_number || "N/A"}</div>
        <div className="text-xs text-gray-500">{order.client?.adresse?.substring(0, 30) || "N/A"}</div>
      </td>
      <td className="px-4 py-4">
        {livreursLoading ? (
          <div className="flex items-center text-sm text-gray-500">
            <Loader className="animate-spin h-4 w-4 mr-2" />
            Chargement...
          </div>
        ) : livreurs.length > 0 ? (
          <div className="space-y-2">
            {order.livreur && (
              <div className="p-2 border rounded-lg bg-gray-50">
                <div className="text-sm font-semibold text-gray-800">
                  {order.livreur.name} 
                </div>
                <div className="text-xs text-gray-500">{order.livreur.user.phone_number}</div>
              </div>
            )}

            <select
              className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              defaultValue={order.livreur?.id || ""}
              onChange={(e) => onAssignLivreur(order.id, e.target.value)}
            >
              <option value="" disabled>
                {order.livreur ? "Changer le livreur" : "Assigner un livreur"}
              </option>
              {livreurs.map((livreur) => (
                <option
                  key={livreur.id}
                  value={livreur.id}
                  disabled={!livreur.disponible}
                >
                  {livreur.first_name} {livreur.last_name} - {livreur.user.phone_number}
                  {!livreur.disponible ? " (Indisponible)" : ""}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Aucun livreur disponible</div>
        )}
      </td>



      <td className="px-4 py-4">
        <div className="relative" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="inline-flex items-center cursor-pointer focus:outline-none"
          >
            {getStatusBadge(order.status)}
            <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
          </button>

          {statusDropdownOpen && (
            <div className="absolute z-10 mt-1 w-36 bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden">
              <ul className="py-1">
                {Object.entries(ORDER_STATUS).map(([key, value]) => {
                  const isAllowed = canChangeStatus(order.status, value);
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        disabled={!isAllowed}
                        className={`block w-full text-left px-4 py-2 text-sm ${isAllowed
                          ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                          : "text-gray-400 cursor-not-allowed"
                          }`}
                        onClick={() => {
                          if (isAllowed) {
                            onStatusChange(order.id, value);
                            setStatusDropdownOpen(false);
                          }
                        }}
                      >
                        {STATUS_LABELS[value]}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-gray-900">
          <div>Collecte: {formatDate(order.collection_date)}</div>
          <div>Livraison: {formatDate(order.delivery_date)}</div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{order.amount} FCFA</div>
        <div className="text-xs text-gray-500">
          {order.payment_method === "cash" ? "Paiement à la livraison" : "Paiement en ligne"}
        </div>
      </td>
      <td className="px-4 py-4 gap-1 text-right text-sm font-medium whitespace-nowrap">
        <Link
          to={`/admin/orders/${order.id}`}
          className="text-blue-600 px-2 hover:text-blue-900"
        >
          Détails
        </Link>
      </td>
    </tr >
  );
};

export default OrdersManagement;