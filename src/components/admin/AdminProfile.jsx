"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { AtSign, Calendar, ChevronLeft, Edit2, Key, Phone, Save, Shield, UserIcon, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useAuth } from "../../contexts/AuthContext"

export default function userProfile() {
    // user data
    const {user}=useAuth()

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        email: user.email,
        phone_number: user.phone_number,
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically send the updated data to your API
        console.log("Updated data:", formData)
        setIsEditing(false)
        // Update user data with formData
    }

    const cancelEdit = () => {
        setFormData({
            email: user.email,
            phone_number: user.phone_number,
        })
        setIsEditing(false)
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <Link to="/user/dashboard" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Retour au tableau de bord
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="flex justify-center">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="/placeholder.svg" alt="user" />
                                    <AvatarFallback className="bg-primary text-white text-xl">IL</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="mt-4">Ilyas</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Shield className="mr-2 h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium capitalize">{user.role}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="mr-2 h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{user.phone_number}</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                    <span className="text-sm">Membre depuis: {user.created_at || "N/A"}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Modifier le profil
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Sécurité du compte</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-start">
                                <Key className="mr-2 h-4 w-4" />
                                Changer le mot de passe
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Shield className="mr-2 h-4 w-4" />
                                Paramètres de sécurité
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Informations du profil</CardTitle>
                                {!isEditing && (
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Modifier
                                    </Button>
                                )}
                            </div>
                            <CardDescription>Gérez vos informations personnelles</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                className="pl-10"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number">Numéro de téléphone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="phone_number"
                                                name="phone_number"
                                                type="tel"
                                                className="pl-10"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button type="button" variant="outline" onClick={cancelEdit}>
                                            <X className="mr-2 h-4 w-4" />
                                            Annuler
                                        </Button>
                                        <Button type="submit">
                                            <Save className="mr-2 h-4 w-4" />
                                            Enregistrer
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Email</div>
                                            <div className="mt-1 flex items-center">
                                                <AtSign className="mr-2 h-4 w-4 text-gray-500" />
                                                <span>{user.email}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Téléphone</div>
                                            <div className="mt-1 flex items-center">
                                                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                                                <span>{user.phone_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Rôle</div>
                                        <div className="mt-1 flex items-center">
                                            <Shield className="mr-2 h-4 w-4 text-primary" />
                                            <span className="capitalize">{user.role}</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">ID Utilisateur</div>
                                        <div className="mt-1 flex items-center">
                                            <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
                                            <span>{user.user_id}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activité du compte</CardTitle>
                            <CardDescription>Historique des connexions et activités récentes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="sessions">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="sessions">Sessions actives</TabsTrigger>
                                    <TabsTrigger value="history">Historique</TabsTrigger>
                                </TabsList>
                                <TabsContent value="sessions" className="mt-4">
                                    <div className="rounded-md border">
                                        <div className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">Session actuelle</div>
                                                    <div className="text-sm text-gray-500">Navigateur: Chrome sur Windows</div>
                                                </div>
                                                <div className="text-sm text-green-600 font-medium">Actif maintenant</div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="history" className="mt-4">
                                    <div className="text-sm text-gray-500">Aucune activité récente à afficher.</div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
