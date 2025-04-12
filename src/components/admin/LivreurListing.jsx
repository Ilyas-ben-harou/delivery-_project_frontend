"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Download, Plus, Search } from "lucide-react"

import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useToast } from "../ui/use-toast"

export default function LivreurListing() {
  const { toast } = useToast()
  const [distributors, setDistributors] = useState([])
  const [filteredDistributors, setFilteredDistributors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("tous")
  const [cityFilter, setCityFilter] = useState("toutes")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [distributorsPerPage] = useState(10)

  useEffect(() => {
    // Function to fetch distributors from API
    const fetchDistributors = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with your actual API call
        // const response = await fetch('/api/admin/distributeurs')
        // const data = await response.json()

        // Mock data for demonstration
        const mockData = [
          {
            id: 1,
            nom: "Alaoui",
            prenom: "Mohammed",
            telephone: "+212612345678",
            email: "m.alaoui@example.com",
            ville: "CASABLANCA",
            zone_geographique: "CENTRE",
            statut: "actif",
            taux_commission: 10,
            livraisons_completees: 124,
          },
          {
            id: 2,
            nom: "Benani",
            prenom: "Sara",
            telephone: "+212623456789",
            email: "s.benani@example.com",
            ville: "RABAT",
            zone_geographique: "NORD",
            statut: "actif",
            taux_commission: 12,
            livraisons_completees: 87,
          },
          {
            id: 3,
            nom: "Chaoui",
            prenom: "Karim",
            telephone: "+212634567890",
            email: "k.chaoui@example.com",
            ville: "MARRAKECH",
            zone_geographique: "SUD",
            statut: "en_pause",
            taux_commission: 10,
            livraisons_completees: 56,
          },
          {
            id: 4,
            nom: "Doukkali",
            prenom: "Fatima",
            telephone: "+212645678901",
            email: "f.doukkali@example.com",
            ville: "CASABLANCA",
            zone_geographique: "CENTRE",
            statut: "inactif",
            taux_commission: 8,
            livraisons_completees: 32,
          },
          {
            id: 5,
            nom: "El Fassi",
            prenom: "Youssef",
            telephone: "+212656789012",
            email: "y.elfassi@example.com",
            ville: "TANGER",
            zone_geographique: "NORD",
            statut: "actif",
            taux_commission: 11,
            livraisons_completees: 98,
          },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setDistributors(mockData)
        setFilteredDistributors(mockData)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement des distributeurs:", err)
        setError("Impossible de charger les distributeurs. Veuillez réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDistributors()
  }, [])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = distributors

    // Filter by search (name, phone, email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (distributor) =>
          distributor.nom.toLowerCase().includes(query) ||
          distributor.prenom.toLowerCase().includes(query) ||
          distributor.telephone.includes(query) ||
          distributor.email.toLowerCase().includes(query),
      )
    }

    // Filter by status
    if (statusFilter !== "tous") {
      result = result.filter((distributor) => distributor.statut === statusFilter)
    }

    // Filter by city
    if (cityFilter !== "toutes") {
      result = result.filter((distributor) => distributor.ville === cityFilter)
    }

    setFilteredDistributors(result)
    setCurrentPage(1) // Return to first page after filtering
  }, [searchQuery, statusFilter, cityFilter, distributors])

  // Get unique cities for filter
  const uniqueCities = Array.from(new Set(distributors.map((d) => d.ville)))

  // Pagination calculations
  const indexOfLastDistributor = currentPage * distributorsPerPage
  const indexOfFirstDistributor = indexOfLastDistributor - distributorsPerPage
  const currentDistributors = filteredDistributors.slice(indexOfFirstDistributor, indexOfLastDistributor)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Export list to Excel
  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "La fonctionnalité d'exportation sera implémentée prochainement.",
    })
  }

  // Handle distributor status change
  const handleStatusChange = async (distributorId, newStatus) => {
    try {
      // This would be replaced with your actual API call
      // await fetch(`/api/admin/distributeurs/${distributorId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ statut: newStatus }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state after success
      setDistributors(
        distributors.map((distributor) =>
          distributor.id === distributorId ? { ...distributor, statut: newStatus } : distributor,
        ),
      )

      toast({
        title: "Statut mis à jour",
        description: "Le statut du distributeur a été modifié avec succès.",
      })
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err)
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut du distributeur.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Gestion des distributeurs</CardTitle>
          <Button asChild>
            <Link to="/admin/livreur/create">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un distributeur
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 bg-muted/40 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label htmlFor="search" className="mb-1">
                  Recherche
                </Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Rechercher par nom, téléphone, email..."
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
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                    <SelectItem value="en_pause">En pause</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cityFilter" className="mb-1">
                  Ville
                </Label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger id="cityFilter">
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes les villes</SelectItem>
                    {uniqueCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results info and export */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{filteredDistributors.length} distributeur(s) trouvé(s)</p>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>

          {/* Distributors table */}
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
                    <TableHead>Distributeur</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Perf.</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDistributors.length > 0 ? (
                    currentDistributors.map((distributor) => (
                      <TableRow key={distributor.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-lg font-medium">
                                  {distributor.prenom.charAt(0)}
                                  {distributor.nom.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">
                                {distributor.prenom} {distributor.nom}
                              </div>
                              <div className="text-sm text-muted-foreground">ID: {distributor.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{distributor.telephone}</div>
                          <div className="text-sm text-muted-foreground">{distributor.email}</div>
                        </TableCell>
                        <TableCell>
                          <div>{distributor.zone_geographique}</div>
                          <div className="text-sm text-muted-foreground">{distributor.ville}</div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              distributor.statut === "actif"
                                ? "bg-green-100 text-green-800"
                                : distributor.statut === "inactif"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {distributor.statut === "actif"
                              ? "Actif"
                              : distributor.statut === "inactif"
                                ? "Inactif"
                                : "En pause"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {distributor.taux_commission}% • {distributor.livraisons_completees} livr.
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="link" asChild>
                              <Link to={`/admin/distributeurs/${distributor.id}`}>Détails</Link>
                            </Button>
                            <Select
                              value={distributor.statut}
                              onValueChange={(value) => handleStatusChange(distributor.id, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Changer statut" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="actif">Activer</SelectItem>
                                <SelectItem value="inactif">Désactiver</SelectItem>
                                <SelectItem value="en_pause">Mettre en pause</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Aucun distributeur trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filteredDistributors.length > distributorsPerPage && (
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

                {Array.from({ length: Math.ceil(filteredDistributors.length / distributorsPerPage) }).map(
                  (_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="icon"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredDistributors.length / distributorsPerPage)}
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
        </CardContent>
      </Card>
    </div>
  )
}
