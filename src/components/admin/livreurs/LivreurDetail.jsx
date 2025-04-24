"use client"

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Edit, Trash, Check, X, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";

// API
import { adminAxios } from "../../../api/axios";

// UI Components
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";
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

export default function LivreurDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livreur, setLivreur] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch livreur data
  useEffect(() => {
    const fetchLivreurData = async () => {
      setIsLoading(true);
      try {
        const response = await adminAxios.get(`/livreurs/${id}`);
        
        if (response.data?.status === 'success') {
          setLivreur(response.data.data);
          setError(null);
        } else {
          throw new Error(response.data?.message || "No data found in response");
        }
      } catch (error) {
        console.error("Error fetching livreur details:", error);
        setError(error.response?.data?.message || "Failed to load livreur details. Please try again later.");
        toast.error("Failed to load livreur", {
          description: error.response?.data?.message || "Could not retrieve livreur details from the server.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLivreurData();
    }
  }, [id]);

  /**
   * Formats a date string to a localized format
   * @param {string} dateString - The date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  /**
   * Deletes the current livreur
   */
  const handleDeleteLivreur = async () => {
    try {
      setIsLoading(true);
      await adminAxios.delete(`/livreurs/${id}`);
      
      toast.success("Delivery agent deleted successfully", {
        description: `${livreur.first_name} ${livreur.last_name} has been removed from the system.`,
      });
      
      navigate('/admin/livreurs');
    } catch (error) {
      console.error("Error deleting delivery agent:", error);
      toast.error("Failed to delete delivery agent", {
        description: error.response?.data?.message || "An error occurred while attempting to delete the delivery agent.",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  /**
   * Toggles the availability status of the livreur
   */
  const toggleAvailability = async () => {
    if (!livreur) return;
    
    const newStatus = livreur.disponible === 1 ? 0 : 1;
    
    try {
      setIsLoading(true);
      await adminAxios.patch(`/livreurs/${id}/disponible`, {
        disponible: newStatus
      });
      
      setLivreur(prev => ({
        ...prev,
        disponible: newStatus
      }));
      
      toast.success(
        `Availability status updated`,
        {
          description: `Delivery agent is now ${newStatus === 1 ? 'available' : 'unavailable'} for deliveries.`,
          action: {
            label: "Undo",
            onClick: () => toggleAvailability(),
          },
        }
      );
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability", {
        description: error.response?.data?.message || "Could not update the delivery agent's availability status.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !livreur) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="bg-destructive/10 p-4 rounded-lg text-center max-w-md">
          <X className="h-8 w-8 text-destructive mx-auto mb-2" />
          <h3 className="text-lg font-medium text-destructive mb-2">
            {error || "Delivery agent not found"}
          </h3>
          <p className="text-muted-foreground mb-4">
            We couldn't load the delivery agent details. Please check the ID and try again.
          </p>
          <Button asChild>
            <Link to="/admin/livreurs">
              Back to delivery agents
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isAvailable = livreur.disponible === 1;
  const zones = livreur.zones || [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/livreurs" aria-label="Back to delivery agents">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Delivery Agent Details
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and view details for {livreur.first_name} {livreur.last_name}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={`/admin/livreurs/${id}/edit`} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
          
          <Button 
            variant={isAvailable ? "destructive" : "success"} 
            onClick={toggleAvailability}
            disabled={isLoading}
          >
            {isAvailable ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Set Unavailable
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Set Available
              </>
            )}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoading}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-muted/50 rounded-lg">
        <div className="h-20 w-20 rounded-full bg-background border flex items-center justify-center">
          <span className="text-2xl font-medium">
            {livreur.first_name?.charAt(0)?.toUpperCase()}
            {livreur.last_name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">
            {livreur.first_name} {livreur.last_name}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-muted-foreground">ID: {livreur.id}</p>
            <p className="text-sm text-muted-foreground">CIN: {livreur.cin}</p>
            <Badge 
              variant={isAvailable ? "available" : "unavailable"}
              className={isAvailable 
                ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200" 
                : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
              }
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="Full Name" value={`${livreur.first_name} ${livreur.last_name}`} />
            <InfoRow label="CIN" value={livreur.cin} />
            <InfoRow label="Email" value={livreur.user?.email} />
            <InfoRow label="Phone" value={livreur.user?.phone_number} />
            <InfoRow label="Address" value={livreur.adresse} />
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="Delivery Agent ID" value={livreur.id} />
            <InfoRow label="User ID" value={livreur.user_id} />
            <InfoRow 
              label="Role" 
              value={livreur.user?.role ? capitalizeFirstLetter(livreur.user.role) : "N/A"} 
            />
            <InfoRow label="Created On" value={formatDate(livreur.created_at)} />
            <InfoRow label="Last Updated" value={formatDate(livreur.updated_at)} />
          </CardContent>
        </Card>

        {/* Delivery Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span>Delivery Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoRow label="Vehicle Type" value={livreur.vehicule_type} />
            <InfoRow 
              label="Delivery Status" 
              value={isAvailable ? "Available for deliveries" : "Currently unavailable"} 
            />
            <InfoRow label="Orders Completed" value={livreur.orders_count || 0} />
            
            {/* Zones Information */}
            <div className="md:col-span-3">
              <div className="text-sm font-medium text-muted-foreground mb-2">Assigned Zones</div>
              {zones.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {zones.map((zone) => (
                    <div key={zone.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <h4 className="font-medium">{zone.secteur}</h4>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-muted-foreground">City:</span> {zone.city}</div>
                        <div><span className="text-muted-foreground">Postal Code:</span> {zone.postal_code}</div>
                        <div><span className="text-muted-foreground">Zone ID:</span> {zone.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  No zones assigned to this delivery agent
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to={`/admin/livreurs/${id}/deliveries`}>
                View Delivery History
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to permanently delete the delivery agent account for{" "}
              <span className="font-semibold">
                {livreur.first_name} {livreur.last_name}
              </span>. This will:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Remove all associated data</li>
                <li>Cancel any pending deliveries</li>
                <li>Revoke system access immediately</li>
                <li>Remove from all assigned zones</li>
              </ul>
              <p className="mt-3 font-medium">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteLivreur}
              className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Delivery Agent"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper component for consistent info row styling
function InfoRow({ label, value, className }) {
  return (
    <div className={className}>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">
        {value || <span className="text-muted-foreground">N/A</span>}
      </dd>
    </div>
  );
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}