"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'sonner'

import { Button } from "../../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Separator } from "../../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Loader2, CheckCircle2, Circle } from "lucide-react"
import { adminAxios } from "../../../api/axios"

// Don't use the Popover component since it might be causing issues
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"

export default function LivreurRegister() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [zones, setZones] = useState([])
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    telephone: "",
    email: "",
    cin: "",
    zone_geographic_ids: [],
    adresse: "",
    disponible: true,
    password: "",
    password_confirmation: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchZones()
  }, [])

  const fetchZones = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching zones...")
      const response = await adminAxios.get('/zone-geographics')
      
      // Debug log the raw response
      console.log("API Response:", response)
      
      let zonesData = []
      
      if (Array.isArray(response.data)) {
        zonesData = response.data
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        zonesData = response.data.data
      } else if (response.data && typeof response.data === 'object') {
        // In case the response structure is unexpected, try to extract anything that looks like zones
        zonesData = Object.values(response.data).find(val => Array.isArray(val)) || []
      }
      
      console.log("Processed zones data:", zonesData)
      setZones(zonesData)
    } catch (error) {
      console.error("Error fetching zones:", error)
      toast.error("Impossible de charger les zones géographiques. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

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

  const toggleZone = (zoneId) => {
    setFormData(prev => {
      const newZoneIds = prev.zone_geographic_ids.includes(zoneId)
        ? prev.zone_geographic_ids.filter(id => id !== zoneId)
        : [...prev.zone_geographic_ids, zoneId]
      
      return { ...prev, zone_geographic_ids: newZoneIds }
    })
    
    if (errors.zone_geographic_ids) {
      setErrors(prev => ({ ...prev, zone_geographic_ids: undefined }))
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

    if (!formData.zone_geographic_ids || formData.zone_geographic_ids.length === 0) {
      newErrors.zone_geographic_ids = "Au moins une zone est requise"
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
      toast.error("Formulaire incomplet", { 
        description: "Veuillez corriger les erreurs signalées avant de soumettre."
      })
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

  const getZoneDisplayName = (zone) => {
    if (!zone) return "Zone inconnue";
    
    if (zone.city && zone.secteur) {
      return `${zone.city.trim()}, ${zone.secteur.trim()}`;
    }
    
    if (zone.name) return zone.name;
    
    if (zone.city) return zone.city.trim();
    
    if (zone.secteur) return zone.secteur.trim();
    
    return `Zone ${zone.id}`;
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
            type="button"
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Créer le livreur"
            )}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom <span className="text-red-500">*</span></Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={errors.last_name ? "border-red-500" : ""}
                    placeholder="Nom de famille"
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
                    placeholder="Prénom"
                  />
                  {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone <span className="text-red-500">*</span></Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={errors.telephone ? "border-red-500" : ""}
                    placeholder="+212 ou 0 suivi de 9 chiffres"
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
                    placeholder="exemple@domaine.com"
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
                  placeholder="Ex: AB12345"
                />
                {errors.cin && <p className="text-sm text-red-500">{errors.cin}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Zones géographiques <span className="text-red-500">*</span></Label>
                  
                  {/* Use Dialog instead of Popover for better control */}
                  <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        type="button"
                        className={`w-full justify-start text-left font-normal ${errors.zone_geographic_ids ? "border-red-500" : ""}`}
                      >
                        {formData.zone_geographic_ids.length > 0
                          ? `${formData.zone_geographic_ids.length} zone(s) sélectionnée(s)`
                          : "Sélectionner des zones"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Sélectionner des zones géographiques</DialogTitle>
                      </DialogHeader>
                      
                      {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="ml-2">Chargement des zones...</span>
                        </div>
                      ) : zones.length === 0 ? (
                        <div className="p-4 text-center">
                          <p>Aucune zone disponible.</p>
                          <Button 
                            onClick={fetchZones} 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                          >
                            Réessayer
                          </Button>
                        </div>
                      ) : (
                        <div className="max-h-72 overflow-y-auto">
                          {zones.map((zone) => (
                            <div 
                              key={zone.id} 
                              className="flex items-center p-3 cursor-pointer hover:bg-slate-100 border-b"
                              onClick={() => toggleZone(zone.id)}
                            >
                              {formData.zone_geographic_ids.includes(zone.id) ? (
                                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground mr-2" />
                              )}
                              <span>{getZoneDisplayName(zone)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button"
                          onClick={() => setIsZoneDialogOpen(false)}
                        >
                          Confirmer ({formData.zone_geographic_ids.length} sélectionnée(s))
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {formData.zone_geographic_ids.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {formData.zone_geographic_ids.map(zoneId => {
                        const zone = zones.find(z => z.id === zoneId);
                        return (
                          <div key={zoneId} className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                            {zone ? getZoneDisplayName(zone) : `Zone ${zoneId}`}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {errors.zone_geographic_ids && (
                    <p className="text-sm text-red-500">{errors.zone_geographic_ids}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Adresse complète"
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

              <Separator className="my-2" />

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                  placeholder="Minimum 8 caractères"
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
                  placeholder="Répétez le mot de passe"
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