import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { adminAxios } from "../../../api/axios"
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await adminAxios.get(`/clients/${id}`)
        setClient(response.data.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching client:", err)
        setError("Impossible de charger les informations du client")
        setLoading(false)
        toast.error("Erreur", {
          description: "Impossible de charger les informations du client"
        })
      }
    }

    fetchClient()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/clients")}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Détails du client</h1>
          <p className="text-muted-foreground">
            Informations détaillées sur le client.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/clients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Nom</p>
                <p className="text-muted-foreground">{client?.nom}</p>
              </div>
              <div>
                <p className="font-semibold">Prénom</p>
                <p className="text-muted-foreground">{client?.prenom}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-muted-foreground">{client?.user?.email}</p>
            </div>
            <div>
              <p className="font-semibold">CIN</p>
              <p className="text-muted-foreground">{client?.cin}</p>
            </div>
            <div>
              <p className="font-semibold">Adresse</p>
              <p className="text-muted-foreground">{client?.adresse || "Non spécifiée"}</p>
            </div>
            <div>
              <p className="font-semibold">Ville</p>
              <p className="text-muted-foreground">{client?.ville}</p>
            </div>
          </CardContent>
        </Card>

        {/* Informations professionnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations professionnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">Boutique</p>
              <p className="text-muted-foreground">{client?.boutique}</p>
            </div>
            <div>
              <p className="font-semibold">Banque</p>
              <p className="text-muted-foreground">{client?.banque}</p>
            </div>
            <div>
              <p className="font-semibold">RIB</p>
              <p className="text-muted-foreground">{client?.rib}</p>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques des commandes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Statistiques des commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Nombre de commandes</p>
                <p className="text-2xl font-bold">{client?.orders?.length || 0}</p>
              </div>
              {/* Add more statistics as needed */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}