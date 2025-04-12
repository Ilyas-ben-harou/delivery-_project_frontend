"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, Download, Filter, Search } from "lucide-react"

import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { useToast } from "../ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar as CalendarComponent } from "../ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Types
const ORDER_STATUS = {
  PENDING: "en_attente",
  ASSIGNED: "assignée",
  IN_TRANSIT: "en_cours",
  DELIVERED: "livrée",
  FAILED: "échouée",
  CANCELLED: "annulée",
}

export default function OrdersManagement() {
  const { toast } = useToast()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("tous")
  const [dateFilter, setDateFilter] = useState(null)
  const [distributorFilter, setDistributorFilter] = useState("tous")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(10)

  useEffect(() => {
    // Function to fetch orders from API
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with your actual API call
        // const response = await fetch('/api/admin/livraisons')
        // const data = await response.json()

        // Mock data for demonstration
        const mockData = [
          {
            id: "CMD-12458",
            client: {
              name: "Ahmed Benali",
              address: "123 Rue Mohammed V, Casablanca",
              phone: "+212612345678",
            },
            distributor: {
              id: 1,
              name: "Mohammed Alaoui",
            },
            status: ORDER_STATUS.DELIVERED,
            createdAt: "2023-04-10T14:30:00Z",
            deliveredAt: "2023-04-10T16:45:00Z",
            amount: 350.0,
            items: 3,
            paymentMethod: "cash",
          },
          {
            id: "CMD-12457",
            client: {
              name: "Fatima Zohra",
              address: "45 Avenue Hassan II, Rabat",
              phone: "+212623456789",
            },
            distributor: {
              id: 2,
              name: "Sara Benani",
            },
            status: ORDER_STATUS.FAILED,
            createdAt: "2023-04-10T10:15:00Z",
            deliveredAt: null,
            amount: 520.5,
            items: 5,
            paymentMethod: "card",
          },
          {
            id: "CMD-12456",
            client: {
              name: "Karim Chaoui",
              address: "78 Boulevard Zerktouni, Marrakech",
              phone: "+212634567890",
            },
            distributor: {
              id: 3,
              name: "Youssef El Fassi",
            },
            status: ORDER_STATUS.IN_TRANSIT,
            createdAt: "2023-04-10T09:00:00Z",
            deliveredAt: null,
            amount: 180.0,
            items: 2,
            paymentMethod: "cash",
          },
          {
            id: "CMD-12455",
            client: {
              name: "Laila Doukkali",
              address: "12 Rue Ibn Sina, Fès",
              phone: "+212645678901",
            },
            distributor: {
              id: 1,
              name: "Mohammed Alaoui",
            },
            status: ORDER_STATUS.ASSIGNED,
            createdAt: "2023-04-09T16:20:00Z",
            deliveredAt: null,
            amount: 750.0,
            items: 8,
            paymentMethod: "card",
          },
          {
            id: "CMD-12454",
            client: {
              name: "Omar Tazi",
              address: "56 Avenue des FAR, Tanger",
              phone: "+212656789012",
            },
            distributor: null,
            status: ORDER_STATUS.PENDING,
            createdAt: "2023-04-09T14:10:00Z",
            deliveredAt: null,
            amount: 420.75,
            items: 4,
            paymentMethod: "cash",
          },
          {
            id: "CMD-12453",
            client: {
              name: "Samira El Amrani",
              address: "34 Rue Moulay Ismail, Agadir",
              phone: "+212667890123",
            },
            distributor: {
              id: 2,
              name: "Sara Benani",
            },
            status: ORDER_STATUS.CANCELLED,
            createdAt: "2023-04-09T11:30:00Z",
            deliveredAt: null,
            amount: 290.25,
            items: 3,
            paymentMethod: "card",
          },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setOrders(mockData)
        setFilteredOrders(mockData)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement des commandes:", err)
        setError("Impossible de charger les commandes. Veuillez réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = orders

    // Filter by search (order ID, client name, phone)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.client.name.toLowerCase().includes(query) ||
          order.client.phone.includes(query),
      )
    }

    // Filter by status
    if (statusFilter !== "tous") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt)
        return (
          orderDate.getDate() === filterDate.getDate() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getFullYear() === filterDate.getFullYear()
        )
      })
    }

    // Filter by distributor
    if (distributorFilter !== "tous") {
      if (distributorFilter === "non_assigné") {
        result = result.filter((order) => !order.distributor)
      } else {
        const distributorId = Number.parseInt(distributorFilter)
        result = result.filter((order) => order.distributor && order.distributor.id === distributorId)
      }
    }

    setFilteredOrders(result)
    setCurrentPage(1) // Return to first page after filtering
  }, [searchQuery, statusFilter, dateFilter, distributorFilter, orders])

  // Get unique distributors for filter
  const uniqueDistributors = Array.from(
    new Set(
      orders
        .filter((order) => order.distributor)
        .map((order) => JSON.stringify({ id: order.distributor.id, name: order.distributor.name })),
    ),
  ).map((str) => JSON.parse(str))

  // Pagination calculations
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Export list to Excel
  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "La fonctionnalité d'exportation sera implémentée prochainement.",
    })
  }

  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // This would be replaced with your actual API call
      // await fetch(`/api/admin/livraisons/${orderId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state after success
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      toast({
        title: "Statut mis à jour",
        description: `La commande ${orderId} a été mise à jour avec succès.`,
      })
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err)
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut de la commande.",
        variant: "destructive",
      })
    }
  }

  // Handle distributor assignment
  const handleAssignDistributor = async (orderId, distributorId) => {
    try {
      // This would be replaced with your actual API call
      // await fetch(`/api/admin/livraisons/${orderId}/assign`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ distributorId }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find the distributor info
      const distributor = uniqueDistributors.find((d) => d.id === Number.parseInt(distributorId))

      // Update local state after success
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                distributor: distributor,
                status: order.status === ORDER_STATUS.PENDING ? ORDER_STATUS.ASSIGNED : order.status,
              }
            : order,
        ),
      )

      toast({
        title: "Distributeur assigné",
        description: `La commande ${orderId} a été assignée à ${distributor.name}.`,
      })
    } catch (err) {
      console.error("Erreur lors de l'assignation du distributeur:", err)
      toast({
        title: "Erreur",
        description: "Impossible d'assigner un distributeur à la commande.",
        variant: "destructive",
      })
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            En attente
          </Badge>
        )
      case ORDER_STATUS.ASSIGNED:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Assignée
          </Badge>
        )
      case ORDER_STATUS.IN_TRANSIT:
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            En cours
          </Badge>
        )
      case ORDER_STATUS.DELIVERED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Livrée
          </Badge>
        )
      case ORDER_STATUS.FAILED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Échouée
          </Badge>
        )
      case ORDER_STATUS.CANCELLED:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Annulée
          </Badge>
        )
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

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
            {/* Filters */}
            <div className="mb-6 bg-muted/40 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search" className="mb-1">
                    Recherche
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="ID, client ou téléphone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="statusFilter" className="mb-1">
                    Statut
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="statusFilter">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      <SelectItem value={ORDER_STATUS.PENDING}>En attente</SelectItem>
                      <SelectItem value={ORDER_STATUS.ASSIGNED}>Assignée</SelectItem>
                      <SelectItem value={ORDER_STATUS.IN_TRANSIT}>En cours</SelectItem>
                      <SelectItem value={ORDER_STATUS.DELIVERED}>Livrée</SelectItem>
                      <SelectItem value={ORDER_STATUS.FAILED}>Échouée</SelectItem>
                      <SelectItem value={ORDER_STATUS.CANCELLED}>Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFilter" className="mb-1">
                    Date
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
                      <CalendarComponent mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                    </PopoverContent>
                  </Popover>
                  {dateFilter && (
                    <Button variant="ghost" size="sm" className="mt-1" onClick={() => setDateFilter(null)}>
                      Effacer
                    </Button>
                  )}
                </div>
                <div>
                  <Label htmlFor="distributorFilter" className="mb-1">
                    Distributeur
                  </Label>
                  <Select value={distributorFilter} onValueChange={setDistributorFilter}>
                    <SelectTrigger id="distributorFilter">
                      <SelectValue placeholder="Tous les distributeurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les distributeurs</SelectItem>
                      <SelectItem value="non_assigné">Non assigné</SelectItem>
                      {uniqueDistributors.map((distributor) => (
                        <SelectItem key={distributor.id} value={distributor.id.toString()}>
                          {distributor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Results info */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{filteredOrders.length} commande(s) trouvée(s)</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  <Filter className="mr-2 h-4 w-4" />
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>

            {/* Orders table */}
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
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
                      <TableHead>ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Distributeur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrders.length > 0 ? (
                      currentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.client.name}</div>
                              <div className="text-sm text-muted-foreground">{order.client.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.distributor ? (
                              <div className="font-medium">{order.distributor.name}</div>
                            ) : (
                              <span className="text-muted-foreground">Non assigné</span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">Créée: {formatDate(order.createdAt)}</div>
                              {order.deliveredAt && (
                                <div className="text-sm text-muted-foreground">
                                  Livrée: {formatDate(order.deliveredAt)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{order.amount.toFixed(2)} MAD</div>
                            <div className="text-sm text-muted-foreground">
                              {order.items} article(s) • {order.paymentMethod === "cash" ? "Espèces" : "Carte"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="link" asChild>
                                <Link to={`/admin/livraisons/${order.id}`}>Détails</Link>
                              </Button>
                              {/* Status change dropdown */}
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Changer statut" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={ORDER_STATUS.PENDING}>En attente</SelectItem>
                                  <SelectItem value={ORDER_STATUS.ASSIGNED}>Assignée</SelectItem>
                                  <SelectItem value={ORDER_STATUS.IN_TRANSIT}>En cours</SelectItem>
                                  <SelectItem value={ORDER_STATUS.DELIVERED}>Livrée</SelectItem>
                                  <SelectItem value={ORDER_STATUS.FAILED}>Échouée</SelectItem>
                                  <SelectItem value={ORDER_STATUS.CANCELLED}>Annulée</SelectItem>
                                </SelectContent>
                              </Select>
                              {/* Assign distributor dropdown */}
                              {(order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.ASSIGNED) && (
                                <Select
                                  value={order.distributor ? order.distributor.id.toString() : ""}
                                  onValueChange={(value) => handleAssignDistributor(order.id, value)}
                                >
                                  <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Assigner" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {uniqueDistributors.map((distributor) => (
                                      <SelectItem key={distributor.id} value={distributor.id.toString()}>
                                        {distributor.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Aucune commande trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > ordersPerPage && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Page précédente</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>

                  {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }).map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                  >
                    <span className="sr-only">Page suivante</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </nav>
              </div>
            )}
          </TabsContent>

          {/* Other tabs would have similar content but filtered by status */}
          <TabsContent value="pending">
            <div className="p-8 text-center text-muted-foreground">Filtrage par commandes en attente</div>
          </TabsContent>
          <TabsContent value="active">
            <div className="p-8 text-center text-muted-foreground">Filtrage par commandes en cours</div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="p-8 text-center text-muted-foreground">Filtrage par commandes complétées</div>
          </TabsContent>
          <TabsContent value="failed">
            <div className="p-8 text-center text-muted-foreground">Filtrage par commandes échouées</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
