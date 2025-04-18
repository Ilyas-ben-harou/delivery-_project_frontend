import { useState, useEffect, useCallback, useMemo } from "react";
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";
import {
  Download,
  Plus,
  Search,
  Trash,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle2
} from "lucide-react";

// UI Components
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Skeleton } from "../../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
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

// API and Utilities
import { adminAxios } from "../../../api/axios";
import { toast } from "sonner";

export default function DistributorManagement() {
  // State Management
  const [distributors, setDistributors] = useState([]);
  const [filteredDistributors, setFilteredDistributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [distributorsPerPage] = useState(10);

  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [distributorToDelete, setDistributorToDelete] = useState(null);

  const [isExporting, setIsExporting] = useState(false);
  // Data Fetching
  const fetchDistributors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminAxios.get('/livreurs');
      if (response.data.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map(item => ({
          id: item.id,
          user_id: item.user_id,
          first_name: item.first_name,
          last_name: item.last_name,
          cin: item.cin,
          email: item.user?.email || '',
          phone: item.user?.phone_number || '',
          city: item.zone_goegraphic?.city || '',
          region: item.zone_goegraphic?.region || '',
          disponible: item.disponible === 1,
          adresse: item.adresse || '',
          nomber_livraisons: item.nomber_livraisons || 0
        }));

        setDistributors(formattedData);
        setFilteredDistributors(formattedData);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error loading distributors:", err);
      setError("Unable to load distributor data. Please try again later.");
      toast.error("Data Load Failed", {
        description: "Failed to retrieve distributor list. Please refresh the page.",
        action: {
          label: "Retry",
          onClick: () => fetchDistributors(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  // Filtering Logic
  useEffect(() => {
    let result = [...distributors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (distributor) =>
          distributor.first_name.toLowerCase().includes(query) ||
          distributor.last_name.toLowerCase().includes(query) ||
          (distributor.phone && distributor.phone.includes(query)) ||
          (distributor.email && distributor.email.toLowerCase().includes(query)) ||
          (distributor.cin && distributor.cin.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== "all") {
      const isAvailable = statusFilter === "disponible";
      result = result.filter((distributor) => distributor.disponible === isAvailable);
    }

    if (cityFilter !== "all") {
      result = result.filter((distributor) => distributor.city === cityFilter);
    }

    setFilteredDistributors(result);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, cityFilter, distributors]);

  // Memoized values
  const uniqueCities = useMemo(() =>
    Array.from(new Set(distributors.map((d) => d.city).filter(Boolean))),
    [distributors]
  );

  const paginatedDistributors = useMemo(() => {
    const indexOfLastDistributor = currentPage * distributorsPerPage;
    const indexOfFirstDistributor = indexOfLastDistributor - distributorsPerPage;
    return filteredDistributors.slice(indexOfFirstDistributor, indexOfLastDistributor);
  }, [currentPage, filteredDistributors, distributorsPerPage]);

  const totalPages = useMemo(() =>
    Math.ceil(filteredDistributors.length / distributorsPerPage),
    [filteredDistributors.length, distributorsPerPage]
  );

  // Handlers
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleExport = () => {
    try {
      setIsExporting(true);
      // Use filteredDistributors which already respects all your filters
      const dataToExport = filteredDistributors.map(distributor => ({
        "ID": distributor.id,
        "First Name": distributor.first_name,
        "Last Name": distributor.last_name,
        "CIN": distributor.cin,
        "Email": distributor.email,
        "Phone": distributor.phone,
        "City": distributor.city,
        "Region": distributor.region,
        "Status": distributor.disponible ? "Available" : "Unavailable",
        "Address": distributor.adresse,
        "Delivery Count": distributor.nomber_livraisons
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Distributors");

      // Generate filename based on filters
      let filename = "distributors";
      if (statusFilter !== "all") {
        filename += `_${statusFilter}`;
      }
      if (cityFilter !== "all") {
        filename += `_${cityFilter}`;
      }
      if (searchQuery) {
        filename += `_search_${searchQuery.substring(0, 10)}`;
      }
      filename += ".xlsx";

      // Export the file
      XLSX.writeFile(workbook, filename);

      toast.success("Export Successful", {
        description: `Exported ${filteredDistributors.length} distributors to Excel file.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export Failed", {
        description: "An error occurred while exporting the data.",
      });
    }finally{
      setIsExporting(false);
    }
  };

  const updateAvailability = async (distributorId, isAvailable) => {
    try {
      setIsLoading(true);

      await adminAxios.patch(`/livreurs/${distributorId}/disponible`, {
        disponible: isAvailable ? 1 : 0
      });

      setDistributors(prev =>
        prev.map(d =>
          d.id === distributorId ? { ...d, disponible: isAvailable } : d
        )
      );

      toast.success(
        `Availability Updated | ${isAvailable ? 'Available' : 'Unavailable'}`,
        {
          description: `Distributor marked as ${isAvailable ? 'available' : 'unavailable'} for deliveries.`,
          action: {
            label: "Undo",
            onClick: () => updateAvailability(distributorId, !isAvailable),
          },
        }
      );
    } catch (err) {
      console.error("Error updating availability:", err);
      toast.error("Update Failed", {
        description: "Failed to update distributor status. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!distributorToDelete) return;

    try {
      setIsLoading(true);
      await adminAxios.delete(`/livreurs/${distributorToDelete.id}`);

      setDistributors(prev => prev.filter(d => d.id !== distributorToDelete.id));
      setFilteredDistributors(prev => prev.filter(d => d.id !== distributorToDelete.id));

      toast.success("Distributor Deleted", {
        description: `${distributorToDelete.first_name} ${distributorToDelete.last_name} has been removed from the system.`,
        duration: 5000,
      });
    } catch (err) {
      console.error("Error deleting distributor:", err);
      toast.error("Deletion Failed", {
        description: `Failed to remove ${distributorToDelete.first_name} ${distributorToDelete.last_name}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDistributorToDelete(null);
    }
  };

  const getStatusClasses = (isAvailable) => {
    return isAvailable
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold">Distributor Management</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your delivery personnel and their availability
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/livreur/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Distributor
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {/* Filters Section */}
          <div className="mb-6 bg-muted/40 p-4 rounded-lg border">
            <h3 className="font-medium mb-4">Search & Filter</h3>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search" className="sr-only">
                  Search distributors
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, phone, email, or CIN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="min-w-[150px]">
                <Label htmlFor="statusFilter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="statusFilter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="disponible">Available</SelectItem>
                    <SelectItem value="non_disponible">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[150px]">
                <Label htmlFor="cityFilter">City</Label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger id="cityFilter">
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
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


          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{paginatedDistributors.length}</span> of{" "}
                <span className="font-medium">{filteredDistributors.length}</span> distributors
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={filteredDistributors.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>

          {/* Data Table */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
              <p className="text-destructive flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {error}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[250px]">Distributor</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDistributors.length > 0 ? (
                    paginatedDistributors.map((distributor) => (
                      <TableRow key={distributor.id} className="hover:bg-muted/10">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <span className="font-medium text-sm">
                                {getInitials(distributor.first_name, distributor.last_name)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">
                                {distributor.first_name} {distributor.last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                CIN: {distributor.cin || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="font-medium">{distributor.phone || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">
                            {distributor.email || 'No email'}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>{distributor.region || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">
                            {distributor.city || 'N/A'}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClasses(distributor.disponible)}`}
                            >
                              {distributor.disponible ? "Available" : "Unavailable"}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateAvailability(distributor.id, !distributor.disponible)}
                              aria-label={`Mark as ${distributor.disponible ? 'unavailable' : 'available'}`}
                            >
                              {distributor.disponible ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="font-medium">
                            {distributor.nomber_livraisons}
                          </span> deliveries
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="hover:bg-muted"
                            >
                              <Link to={`/admin/livreurs/${distributor.id}`} aria-label="View details">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                              onClick={() => {
                                setDistributorToDelete(distributor);
                                setIsDeleteDialogOpen(true);
                              }}
                              aria-label="Delete"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Search className="h-8 w-8" />
                          <p className="font-medium">No distributors found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to permanently delete{" "}
              <span className="font-semibold">
                {distributorToDelete?.first_name} {distributorToDelete?.last_name}
              </span>{" "}
              and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}