"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Download, Search, UserPlus } from "lucide-react"

import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useToast } from "../ui/use-toast"

export default function ClientManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("tous")
  const [statusFilter, setStatusFilter] = useState("tous")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)

  useEffect(() => {
    // Function to fetch users from API
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with your actual API call
        // const response = await fetch('/api/admin/utilisateurs')
        // const data = await response.json()

        // Mock data for demonstration
        const mockData = [
          {
            id: 1,
            nom: "Alaoui",
            prenom: "Mohammed",
            email: "m.alaoui@example.com",
            role: "admin",
            statut: "actif",
            derniere_connexion: "2023-04-10T14:30:00Z",
          },
          {
            id: 2,
            nom: "Benani",
            prenom: "Sara",
            email: "s.benani@example.com",
            role: "manager",
            statut: "actif",
            derniere_connexion: "2023-04-09T10:15:00Z",
          },
          {
            id: 3,
            nom: "Chaoui",
            prenom: "Karim",
            email: "k.chaoui@example.com",
            role: "support",
            statut: "inactif",
            derniere_connexion: "2023-03-28T09:45:00Z",
          },
          {
            id: 4,
            nom: "Doukkali",
            prenom: "Fatima",
            email: "f.doukkali@example.com",
            role: "distributor",
            statut: "actif",
            derniere_connexion: "2023-04-10T08:20:00Z",
          },
          {
            id: 5,
            nom: "El Fassi",
            prenom: "Youssef",
            email: "y.elfassi@example.com",
            role: "distributor",
            statut: "actif",
            derniere_connexion: "2023-04-08T16:40:00Z",
          },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setUsers(mockData)
        setFilteredUsers(mockData)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs:", err)
        setError("Impossible de charger les utilisateurs. Veuillez réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = users

    // Filter by search (name, email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.nom.toLowerCase().includes(query) ||
          user.prenom.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      )
    }

    // Filter by role
    if (roleFilter !== "tous") {
      result = result.filter((user) => user.role === roleFilter)
    }

    // Filter by status
    if (statusFilter !== "tous") {
      result = result.filter((user) => user.statut === statusFilter)
    }

    setFilteredUsers(result)
    setCurrentPage(1) // Return to first page after filtering
  }, [searchQuery, roleFilter, statusFilter, users])

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Export list to Excel
  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "La fonctionnalité d'exportation sera implémentée prochainement.",
    })
  }

  // Handle user status change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      // This would be replaced with your actual API call
      // await fetch(`/api/admin/utilisateurs/${userId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ statut: newStatus }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state after success
      setUsers(users.map((user) => (user.id === userId ? { ...user, statut: newStatus } : user)))

      toast({
        title: "Statut mis à jour",
        description: "Le statut de l'utilisateur a été modifié avec succès.",
      })
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err)
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut de l'utilisateur.",
        variant: "destructive",
      })
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Gestion des utilisateurs</CardTitle>
        <Button asChild>
          <Link to="/admin/utilisateurs/creer">
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="admin">Administrateurs</TabsTrigger>
            <TabsTrigger value="manager">Managers</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="distributor">Distributeurs</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {/* Filters */}
            <div className="mb-6 bg-muted/40 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search" className="mb-1">
                    Recherche
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Rechercher par nom ou email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="roleFilter" className="mb-1">
                    Rôle
                  </Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger id="roleFilter">
                      <SelectValue placeholder="Tous les rôles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les rôles</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="distributor">Distributeur</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Results info and export */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{filteredUsers.length} utilisateur(s) trouvé(s)</p>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>

            {/* Users table */}
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
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-lg font-medium">
                                    {user.prenom.charAt(0)}
                                    {user.nom.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium">
                                  {user.prenom} {user.nom}
                                </div>
                                <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "manager"
                                    ? "bg-blue-100 text-blue-800"
                                    : user.role === "support"
                                      ? "bg-teal-100 text-teal-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role === "admin"
                                ? "Administrateur"
                                : user.role === "manager"
                                  ? "Manager"
                                  : user.role === "support"
                                    ? "Support"
                                    : "Distributeur"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.statut === "actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.statut === "actif" ? "Actif" : "Inactif"}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(user.derniere_connexion)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="link" asChild>
                                <Link to={`/admin/utilisateurs/${user.id}`}>Détails</Link>
                              </Button>
                              <Select value={user.statut} onValueChange={(value) => handleStatusChange(user.id, value)}>
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Changer statut" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="actif">Activer</SelectItem>
                                  <SelectItem value="inactif">Désactiver</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Aucun utilisateur trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
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

                  {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
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
                    disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
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

          {/* Other tabs would have similar content but filtered by role */}
          <TabsContent value="admin">
            <div className="p-8 text-center text-muted-foreground">Filtrage par rôle d'administrateur</div>
          </TabsContent>
          <TabsContent value="manager">
            <div className="p-8 text-center text-muted-foreground">Filtrage par rôle de manager</div>
          </TabsContent>
          <TabsContent value="support">
            <div className="p-8 text-center text-muted-foreground">Filtrage par rôle de support</div>
          </TabsContent>
          <TabsContent value="distributor">
            <div className="p-8 text-center text-muted-foreground">Filtrage par rôle de distributeur</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
