import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { adminAxios } from "../../../api/axios"
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ClientUpdate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    password: "",
    password_confirmation: "",
    boutique: "",
    cin: "",
    banque: "",
    rib: "",
    ville: "",
    adresse: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await adminAxios.get(`/clients/${id}`)
        const clientData = response.data.data
        setFormData({
          nom: clientData.nom,
          prenom: clientData.prenom,
          telephone: clientData.user.phone_number, // Make sure this matches the backend field name
          email: clientData.user.email,
          password: "",
          password_confirmation: "",
          boutique: clientData.boutique,
          cin: clientData.cin,
          banque: clientData.banque || "AL BARID BANK", // Provide default value
          rib: clientData.rib,
          ville: clientData.ville || "CASABLANCA", // Provide default value
          adresse: clientData.adresse || "",
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Fetch error:", error.response?.data)
        toast.error("Erreur", {
          description: "Impossible de charger les informations du client"
        })
        navigate("/admin/clients")
      }
    }

    fetchClient()
  }, [id, navigate])

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

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis"
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis"

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
      newErrors.cin = "Format CIN invalide (ex: AB12345 ou A123456)"
    }

    if (!formData.boutique.trim()) {
      newErrors.boutique = "Le nom de la boutique est requis"
    }

    const ribRegex = /^[0-9]{24}$/
    if (!formData.rib.trim()) {
      newErrors.rib = "Le RIB est requis"
    } else if (!ribRegex.test(formData.rib)) {
      newErrors.rib = "Le RIB doit contenir exactement 24 chiffres"
    }

    // Only validate password if it's provided
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
      }
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Les mots de passe ne correspondent pas"
      }
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

    // Create submission data, excluding empty password fields
    const submissionData = {
      ...formData,
      // Only include password fields if password is provided
      ...(formData.password ? {
        password: formData.password,
        password_confirmation: formData.password_confirmation
      } : {})
    }

    setIsSubmitting(true)
    try {
      const response = await adminAxios.put(`/clients/${id}`, submissionData)
      console.log("Update response:", response.data) // For debugging
      toast.success(
        "Client modifié avec succès",
        { description: `Les informations de ${formData.nom} ${formData.prenom} ont été mises à jour.` }
      )
      navigate("/admin/clients")
    } catch (error) {
      console.log("Validation errors:", error.response?.data?.errors)
      console.error("Erreur:", error)
      
      // Show specific validation errors if available
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat()
        toast.error(
          "Erreur de validation",
          { description: errorMessages.join('\n') }
        )
      } else {
        toast.error(
          "Erreur",
          { description: error.response?.data?.message || "Erreur lors de la modification du client" }
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modifier le client</h1>
          <p className="text-muted-foreground">
            Modifiez les informations du client.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/clients")}
            disabled={isSubmitting}
            type="button"
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Modification en cours...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="professional">Informations professionnelles</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Modifiez les informations personnelles du client.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom <span className="text-red-500">*</span></Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={errors.nom ? "border-red-500" : ""}
                    placeholder="Nom de famille"
                  />
                  {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom <span className="text-red-500">*</span></Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={errors.prenom ? "border-red-500" : ""}
                    placeholder="Prénom"
                  />
                  {errors.prenom && <p className="text-sm text-red-500">{errors.prenom}</p>}
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cin">CIN <span className="text-red-500">*</span></Label>
                  <Input
                    id="cin"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    className={errors.cin ? "border-red-500" : ""}
                    placeholder="Numéro CIN"
                  />
                  {errors.cin && <p className="text-sm text-red-500">{errors.cin}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.ville}
                    onValueChange={(value) => handleSelectChange("ville", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADISS">ADISS</SelectItem>
                      <SelectItem value="CASABLANCA">CASABLANCA</SelectItem>
                      <SelectItem value="RABAT">RABAT</SelectItem>
                      <SelectItem value="MARRAKECH">MARRAKECH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Informations professionnelles</CardTitle>
              <CardDescription>Modifiez les informations professionnelles et bancaires.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="boutique">Nom de la boutique <span className="text-red-500">*</span></Label>
                <Input
                  id="boutique"
                  name="boutique"
                  value={formData.boutique}
                  onChange={handleChange}
                  className={errors.boutique ? "border-red-500" : ""}
                  placeholder="Nom de la boutique"
                />
                {errors.boutique && <p className="text-sm text-red-500">{errors.boutique}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="banque">Banque <span className="text-red-500">*</span></Label>
                  <Select
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rib">RIB <span className="text-red-500">*</span></Label>
                  <Input
                    id="rib"
                    name="rib"
                    value={formData.rib}
                    onChange={handleChange}
                    className={errors.rib ? "border-red-500" : ""}
                    placeholder="24 chiffres"
                  />
                  {errors.rib && <p className="text-sm text-red-500">{errors.rib}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500" : ""}
                    placeholder="Laisser vide pour ne pas modifier"
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={errors.password_confirmation ? "border-red-500" : ""}
                    placeholder="Répétez le nouveau mot de passe"
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}