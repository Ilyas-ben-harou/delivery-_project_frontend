"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useToast } from "../ui/use-toast"

export default function LivreurRegister() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Personal information
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    cin: "",

    // Business information
    boutique: "",
    taux_commission: "10",

    // Banking information
    banque: "AL BARID BANK",
    rib: "",

    // Location information
    ville: "CASABLANCA",
    adresse: "",
    zone_geographique: "CENTRE",

    // Account settings
    statut: "actif",
    password: "",
    password_confirmation: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate personal information
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis"
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis"

    // Validate phone (Moroccan format)
    const phoneRegex = /^\+212[0-9]{9}$/
    if (!phoneRegex.test(formData.telephone)) {
      newErrors.telephone = "Format invalide (+212 suivi de 9 chiffres)"
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }

    // Validate CIN
    if (!formData.cin.trim()) newErrors.cin = "CIN requis"

    // Validate business information
    if (!formData.boutique.trim()) newErrors.boutique = "Nom de boutique requis"

    // Validate commission rate
    const commissionRate = Number.parseFloat(formData.taux_commission)
    if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
      newErrors.taux_commission = "Taux de commission invalide (0-100)"
    }

    // Validate RIB (24 digits for Morocco)
    const ribRegex = /^[0-9]{24}$/
    if (!ribRegex.test(formData.rib)) {
      newErrors.rib = "Le RIB doit contenir 24 chiffres"
    }

    // Validate password
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }

    // Validate password confirmation
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
      // This would be replaced with your actual API call
      // const response = await fetch('/api/admin/distributeurs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Distributeur créé avec succès",
        description: `${formData.prenom} ${formData.nom} a été ajouté à la liste des distributeurs.`,
      })

      navigate("/admin/distributeurs")
    } catch (error) {
      console.error("Erreur lors de la création du distributeur:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du distributeur.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ajouter un distributeur</h1>
            <p className="text-muted-foreground">
              Créez un nouveau compte distributeur et assignez une zone géographique.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/distributeurs")} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer le distributeur"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="business">Informations professionnelles</TabsTrigger>
            <TabsTrigger value="banking">Informations bancaires</TabsTrigger>
            <TabsTrigger value="account">Paramètres du compte</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Entrez les informations personnelles du distributeur.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">
                      Nom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Nom de famille"
                      className={errors.nom ? "border-red-500" : ""}
                    />
                    {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">
                      Prénom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className={errors.prenom ? "border-red-500" : ""}
                    />
                    {errors.prenom && <p className="text-sm text-red-500">{errors.prenom}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telephone">
                      Téléphone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+212000000000"
                      className={errors.telephone ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-muted-foreground">Format: +212 suivi de 9 chiffres</p>
                    {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exemple@exemple.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cin">
                    CIN <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cin"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    placeholder="Carte d'identité nationale"
                    className={errors.cin ? "border-red-500" : ""}
                  />
                  {errors.cin && <p className="text-sm text-red-500">{errors.cin}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Informations professionnelles</CardTitle>
                <CardDescription>Détails concernant l'activité professionnelle du distributeur.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="boutique">
                    Nom de la boutique <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="boutique"
                    name="boutique"
                    value={formData.boutique}
                    onChange={handleChange}
                    placeholder="Nom commercial"
                    className={errors.boutique ? "border-red-500" : ""}
                  />
                  {errors.boutique && <p className="text-sm text-red-500">{errors.boutique}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taux_commission">
                    Taux de commission (%) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="taux_commission"
                    name="taux_commission"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.taux_commission}
                    onChange={handleChange}
                    className={errors.taux_commission ? "border-red-500" : ""}
                  />
                  {errors.taux_commission && <p className="text-sm text-red-500">{errors.taux_commission}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone_geographique">
                    Zone géographique <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="zone_geographique"
                    value={formData.zone_geographique}
                    onValueChange={(value) => handleSelectChange("zone_geographique", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NORD">Nord</SelectItem>
                      <SelectItem value="SUD">Sud</SelectItem>
                      <SelectItem value="EST">Est</SelectItem>
                      <SelectItem value="OUEST">Ouest</SelectItem>
                      <SelectItem value="CENTRE">Centre</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.zone_geographique && <p className="text-sm text-red-500">{errors.zone_geographique}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ville">
                      Ville <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="ville"
                      value={formData.ville}
                      onValueChange={(value) => handleSelectChange("ville", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASABLANCA">Casablanca</SelectItem>
                        <SelectItem value="RABAT">Rabat</SelectItem>
                        <SelectItem value="MARRAKECH">Marrakech</SelectItem>
                        <SelectItem value="FES">Fès</SelectItem>
                        <SelectItem value="TANGER">Tanger</SelectItem>
                        <SelectItem value="AGADIR">Agadir</SelectItem>
                      </SelectContent>
                    </Select>
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

          <TabsContent value="banking">
            <Card>
              <CardHeader>
                <CardTitle>Informations bancaires</CardTitle>
                <CardDescription>Coordonnées bancaires pour les paiements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="banque">
                    Banque <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="banque"
                    value={formData.banque}
                    onValueChange={(value) => handleSelectChange("banque", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une banque" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL BARID BANK">AL BARID BANK</SelectItem>
                      <SelectItem value="BMCE">BMCE</SelectItem>
                      <SelectItem value="BMCI">BMCI</SelectItem>
                      <SelectItem value="ATTIJARI">ATTIJARI</SelectItem>
                      <SelectItem value="CIH">CIH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rib">
                    RIB <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rib"
                    name="rib"
                    value={formData.rib}
                    onChange={handleChange}
                    placeholder="000000000000000000000000"
                    className={errors.rib ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Le RIB doit contenir 24 chiffres</p>
                  {errors.rib && <p className="text-sm text-red-500">{errors.rib}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
                <CardDescription>Configurez les paramètres du compte distributeur.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select
                    name="statut"
                    value={formData.statut}
                    onValueChange={(value) => handleSelectChange("statut", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                      <SelectItem value="en_pause">En pause</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mot de passe <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
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

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/distributeurs")} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer le distributeur"}
          </Button>
        </div>
      </div>
    </form>
  )
}
