"use client"

import { useState } from "react"
// import { useToast } from "../ui/use-toast"

export default function UserDetail({ userId }) {
//   const { toast } = useToast()

  // In a real application, you would fetch this data from your API
  const [user] = useState({
    id: userId,
    nom: "Alaoui",
    prenom: "Mohammed",
    email: "m.alaoui@example.com",
    telephone: "+212612345678",
    role: "distributor",
    statut: "actif",
    derniere_connexion: "2023-04-10T14:30:00Z",
    date_creation: "2023-01-15T09:00:00Z",
    adresse: "123 Rue Hassan II",
    ville: "CASABLANCA",
    zone_geographique: "CENTRE",
    boutique: "Alaoui Express",
    taux_commission: 10,
    livraisons_completees: 124,
  })

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user.prenom} {user.nom}
          </h1>
          <p className="text-muted-foreground">
            {user.role === "admin"
              ? "Administrateur"
              : user.role === "manager"
                ? "Manager"
                : user.role === "support"
                  ? "Support"
                  : "Distributeur"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              user.statut === "actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {user.statut === "actif" ? "Actif" : "Inactif"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-muted/40 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Informations personnelles</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Nom complet</dt>
              <dd className="mt-1 text-sm">
                {user.prenom} {user.nom}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="mt-1 text-sm">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Téléphone</dt>
              <dd className="mt-1 text-sm">{user.telephone}</dd>
            </div>
            {user.adresse && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Adresse</dt>
                <dd className="mt-1 text-sm">{user.adresse}</dd>
              </div>
            )}
            {user.ville && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Ville</dt>
                <dd className="mt-1 text-sm">{user.ville}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-muted/40 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Informations du compte</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">ID</dt>
              <dd className="mt-1 text-sm">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Rôle</dt>
              <dd className="mt-1 text-sm">
                {user.role === "admin"
                  ? "Administrateur"
                  : user.role === "manager"
                    ? "Manager"
                    : user.role === "support"
                      ? "Support"
                      : "Distributeur"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Date de création</dt>
              <dd className="mt-1 text-sm">{formatDate(user.date_creation)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Dernière connexion</dt>
              <dd className="mt-1 text-sm">{formatDate(user.derniere_connexion)}</dd>
            </div>
          </dl>
        </div>

        {user.role === "distributor" && (
          <div className="bg-muted/40 p-6 rounded-lg md:col-span-2">
            <h2 className="text-lg font-medium mb-4">Informations du distributeur</h2>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Boutique</dt>
                <dd className="mt-1 text-sm">{user.boutique}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Zone géographique</dt>
                <dd className="mt-1 text-sm">{user.zone_geographique}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Taux de commission</dt>
                <dd className="mt-1 text-sm">{user.taux_commission}%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Livraisons complétées</dt>
                <dd className="mt-1 text-sm">{user.livraisons_completees}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}
