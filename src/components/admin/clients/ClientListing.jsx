import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAxios } from "../../../api/axios";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Search, UserPlus, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { toast } from "sonner";

export default function ClientListing() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await adminAxios.get("/clients");
      setClients(response.data.data);
      setFilteredClients(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Impossible de charger les clients");
      toast.error("Erreur", { description: "Impossible de charger les clients" });
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = clients.filter((client) =>
      [client.nom, client.prenom, client.boutique, client.cin]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  const handleDelete = async (client) => {
    setIsDeleting(true);
    try {
      await adminAxios.delete(`/clients/${client.id}`);
      toast.success("Client supprimé", {
        description: `${client.nom} ${client.prenom} a été supprimé avec succès.`,
      });
      fetchClients();
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de supprimer le client",
      });
    } finally {
      setIsDeleting(false);
      setClientToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Gestion des Clients</CardTitle>
          <Button asChild>
            <Link to="/admin/clients/create">
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un Client
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Boutique</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead>Banque</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.nom} {client.prenom}
                      </TableCell>
                      <TableCell>{client.boutique}</TableCell>
                      <TableCell>{client.cin}</TableCell>
                      <TableCell>{client.banque}</TableCell>
                      <TableCell>{client.ville}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="link" asChild>
                            <Link to={`/admin/clients/${client.id}`}>
                              Détails
                            </Link>
                          </Button>
                          <Button variant="link" asChild>
                            <Link to={`/admin/clients/${client.id}/edit`}>
                              modifier
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-red-500"
                            onClick={() => setClientToDelete(client)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Aucun client trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le client {clientToDelete?.nom}{" "}
              {clientToDelete?.prenom} et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => handleDelete(clientToDelete)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}