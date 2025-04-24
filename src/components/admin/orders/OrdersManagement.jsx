import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Calendar, Download, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Skeleton } from "../../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Badge } from "../../ui/badge";
import { useToast } from "../../ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar as CalendarComponent } from "../../ui/calendar";
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
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [dateFilter, setDateFilter] = useState(null);
  const [livreurFilter, setLivreurFilter] = useState("tous");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

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
          order.client.phone.includes(query)
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

    return result;
  }, [orders, searchQuery, statusFilter, dateFilter, livreurFilter]);

  // Memoized unique livreurs for filter dropdown
  const uniqueLivreurs = useMemo(() => {
    const livreursMap = new Map();
    orders.forEach((order) => {
      if (order.livreur) {
        livreursMap.set(order.livreur.id, order.livreur);
      }
    });
    return Array.from(livreursMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [orders]);

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
    toast({
      title: "Export en cours",
      description: "La fonctionnalité d'exportation sera implémentée prochainement.",
    });
  }, [toast]);

  // Handle order status change
  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      await adminAxios.patch(`/orders/${orderId}/status`, { status: newStatus });

      setOrders(prevOrders =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `La commande ${orderId} a été mise à jour avec succès.`,
      });
    } catch (err) {
      console.error("Error updating order status:", err);
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut de la commande.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Handle livreur assignment
  const handleAssignLivreur = useCallback(async (orderId, livreurId) => {
    try {
      const livreur = uniqueLivreurs.find((d) => d.id === parseInt(livreurId, 10));

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

      toast({
        title: "Livreur assigné",
        description: `La commande ${orderId} a été assignée à ${livreur.name}.`,
      });
    } catch (err) {
      console.error("Error assigning livreur:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner un livreur à la commande.",
        variant: "destructive",
      });
    }
  }, [uniqueLivreurs, toast]);

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: fr });
  }, []);

  // Get status badge
  const getStatusBadge = useCallback((status) => {
    const statusClasses = {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      assigned: "bg-blue-50 text-blue-700 border-blue-200",
      in_transit: "bg-purple-50 text-purple-700 border-purple-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      cancelled: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return (
      <Badge variant="outline" className={statusClasses[status]}>
        {STATUS_LABELS[status]}
      </Badge>
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Gestion des livraisons</CardTitle>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="active">En cours</TabsTrigger>
            <TabsTrigger value="completed">Complétées</TabsTrigger>
            <TabsTrigger value="failed">Échouées</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {/* Filters Section */}
            <div className="mb-6 bg-muted/40 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Filter */}
                <div>
                  <Label htmlFor="search" className="mb-1">
                    Recherche
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="N° commande, client ou téléphone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <Label htmlFor="statusFilter" className="mb-1">
                    Statut
                  </Label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                    <SelectTrigger id="statusFilter">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div>
                  <Label htmlFor="dateFilter" className="mb-1">
                    Date de collecte
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="dateFilter" variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFilter ? (
                          format(dateFilter, "dd/MM/yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                  {dateFilter && (
                    <Button variant="ghost" size="sm" className="mt-1" onClick={() => setDateFilter(null)}>
                      Effacer
                    </Button>
                  )}
                </div>

                {/* Livreur Filter */}
                <div>
                  <Label htmlFor="livreurFilter" className="mb-1">
                    Livreur
                  </Label>
                  <Select value={livreurFilter} onValueChange={setLivreurFilter}>
                    <SelectTrigger id="livreurFilter">
                      <SelectValue placeholder="Tous les livreurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les livreurs</SelectItem>
                      <SelectItem value="non_assigné">Non assigné</SelectItem>
                      {uniqueLivreurs.map((livreur) => (
                        <SelectItem key={livreur.id} value={livreur.id.toString()}>
                          {livreur.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredOrders.length} commande(s) trouvée(s)
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser les filtres
              </Button>
            </div>

            {/* Orders Table */}
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-destructive/10 p-4 rounded-md">
                <p className="text-destructive">{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Commande</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Livreur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order) => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          uniqueLivreurs={uniqueLivreurs}
                          onStatusChange={handleStatusChange}
                          onAssignLivreur={handleAssignLivreur}
                          formatDate={formatDate}
                          getStatusBadge={getStatusBadge}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          Aucune commande trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
              />
            )}
          </TabsContent>

          {/* Other tabs would have similar content but filtered by status */}
          {["pending", "active", "completed", "failed"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="p-8 text-center text-muted-foreground">
                Filtrage par commandes {STATUS_LABELS[tab]?.toLowerCase() || tab}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Sub-component for Order Row
const OrderRow = ({
  order,
  uniqueLivreurs,
  onStatusChange,
  onAssignLivreur,
  formatDate,
  getStatusBadge,
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{order.order_number}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{order.designation_product}</div>
          {(order.weight || (order.product_width && order.product_height)) && (
            <div className="text-sm text-muted-foreground">
              {order.weight && `${order.weight}kg`}
              {order.weight && order.product_width && " • "}
              {order.product_width && order.product_height &&
                `${order.product_width} × ${order.product_height}cm`}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{order.client.name}</div>
          <div className="text-sm text-muted-foreground">{order.client.phone}</div>
        </div>
      </TableCell>
      <TableCell>
        {order.livreur ? (
          <div className="font-medium">{order.livreur.name}</div>
        ) : (
          <span className="text-muted-foreground">Non assigné</span>
        )}
      </TableCell>
      <TableCell>{getStatusBadge(order.status)}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">Collecte: {formatDate(order.collection_date)}</div>
          {order.delivery_date && (
            <div className="text-sm text-muted-foreground">
              Livraison: {formatDate(order.delivery_date)}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{order.amount.toFixed(2)} MAD</div>
        {order.description && (
          <div className="text-sm text-muted-foreground line-clamp-1">
            {order.description}
          </div>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="link" asChild>
            <Link to={`/admin/orders/${order.id}`}>Détails</Link>
          </Button>

          {/* Status change dropdown */}
          <Select
            value={order.status}
            onValueChange={(value) => onStatusChange(order.id, value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Changer statut" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assign livreur dropdown */}
          {(order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.ASSIGNED) && (
            <Select
              value={order.livreur?.id.toString() || ""}
              onValueChange={(value) => onAssignLivreur(order.id, value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Assigner livreur" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLivreurs.map((livreur) => (
                  <SelectItem key={livreur.id} value={livreur.id.toString()}>
                    {livreur.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

// Sub-component for Pagination Controls
const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Page précédente</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Page suivante</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
};

export default OrdersManagement;