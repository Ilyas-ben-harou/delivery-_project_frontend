"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'sonner'

import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Loader2 } from "lucide-react"
import { adminAxios } from "../../api/axios"

export default function LivreurRegister() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [zones, setZones] = useState([])

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    telephone: "",
    email: "",
    cin: "",
    zone_geographic_id: "",
    adresse: "",
    disponible: true,
    password: "",
    password_confirmation: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await adminAxios.get('/zone-geographics')
        console.log(response.data.data)
        setZones(response.data.data || response.data)
      } catch (error) {
        console.error("Erreur:", error)
        toast.error("Impossible de charger les zones géographiques. Veuillez réessayer.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchZones()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est requis"
    if (!formData.first_name.trim()) newErrors.first_name = "Le prénom est requis"

    const phoneRegex = /^(?:\+212|0)[5-7][0-9]{8}$/
    if (!phoneRegex.test(formData.telephone)) {
      newErrors.telephone = "Format invalide (+212 ou 0 suivi de 9 chiffres)"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }

    const cinRegex = /^[A-Z]{1,2}[0-9]{5,6}$/
    if (!cinRegex.test(formData.cin)) {
      newErrors.cin = "Format CIN invalide (ex: AB12345)"
    }

    if (!formData.zone_geographic_id) {
      newErrors.zone_geographic_id = "Zone géographique requise"
    }

    if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Les mots de passe ne correspondent pas"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await adminAxios.post('/livreurs', formData)
      toast.success(
        "Livreur créé avec succès",
        { description: `${formData.first_name} ${formData.last_name} a été ajouté à la liste des livreurs.` }
      )
      navigate("/admin/livreurs")
    } catch (error) {
      console.error("Erreur:", error)
      toast.error(
        "Erreur",
        { description: error.response?.data?.message || "Erreur lors de la création du livreur" }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ajouter un livreur</h1>
          <p className="text-muted-foreground">
            Créez un nouveau compte livreur et assignez une zone géographique.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/livreurs")}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer le livreur"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="account">Paramètres du compte</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Entrez les informations personnelles du livreur.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom <span className="text-red-500">*</span></Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={errors.last_name ? "border-red-500" : ""}
                  />
                  {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom <span className="text-red-500">*</span></Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={errors.first_name ? "border-red-500" : ""}
                  />
                  {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone <span className="text-red-500">*</span></Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={errors.telephone ? "border-red-500" : ""}
                  />
                  {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cin">CIN <span className="text-red-500">*</span></Label>
                <Input
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  className={errors.cin ? "border-red-500" : ""}
                />
                {errors.cin && <p className="text-sm text-red-500">{errors.cin}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zone_geographic_id">Zone géographique <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.zone_geographic_id}
                    onValueChange={(value) => handleSelectChange("zone_geographic_id", value)}
                  >
                    <SelectTrigger className={errors.zone_geographic_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionner une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.length > 0 ? (
                        zones.map(zone => (
                          <SelectItem
                            key={zone.id}
                            value={zone.id.toString()} // Ensure this is never empty
                          >
                            {`${zone.city.trim()}, ${zone.region.trim()}`}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem
                          value="no-zones" // Changed from empty string to a non-empty value
                          disabled
                        >
                          Aucune zone disponible
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.zone_geographic_id && (
                    <p className="text-sm text-red-500">{errors.zone_geographic_id}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
              <CardDescription>Configurez les paramètres du compte livreur.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disponible">Disponibilité</Label>
                <Select
                  value={formData.disponible.toString()}
                  onValueChange={(value) => handleSelectChange("disponible", value === "true")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la disponibilité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Disponible</SelectItem>
                    <SelectItem value="false">Non disponible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={errors.password_confirmation ? "border-red-500" : ""}
                />
                {errors.password_confirmation && (
                  <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}