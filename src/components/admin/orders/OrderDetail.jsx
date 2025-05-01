import { useState, useEffect } from "react";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Loader, MapPin, Package, Calendar, User, Truck, Phone, Building, CreditCard, FileText, ArrowLeft } from "lucide-react";
import { adminAxios } from "../../../api/axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
export default function OrderDetail() {
    const {id} = useParams(); // Get the order ID from the URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await adminAxios.get(`/orders/${id}`);
                setOrder(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération de la commande:", err);
                toast.error("Erreur", {
                    description: "Impossible de récupérer la commande.",
                });
                setError(err.message || "Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    // Status badge colors
    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "processing": return "bg-blue-100 text-blue-800";
            case "shipped": return "bg-purple-100 text-purple-800";
            case "delivered": return "bg-green-100 text-green-800";
            case "cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading order details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md text-red-800">
                <p>Error: {error}</p>
                <p>Please try again later or contact support.</p>
            </div>
        );
    }


    const formatDate = (dateString) => {
        if (!dateString) return "Not scheduled";
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
            
                <h1 className="text-2xl flex items-center gap-1 font-bold">
                    <ArrowLeft 
                        onClick={()=>navigate(-1)}
                        className="mr-2 h-5 w-5  hover:bg-gray-200 rounded" />
                    Order #{order.order_number}</h1>
                <Badge className={getStatusColor(order.status)}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="mr-2 h-5 w-5" />
                            Product Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Product Name</p>
                            <p className="font-medium">{order.designation_product}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Width</p>
                                <p className="font-medium">{order.product_width || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Height</p>
                                <p className="font-medium">{order.product_height || "N/A"}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Weight</p>
                            <p className="font-medium">{order.weight || "N/A"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p>{order.description || "No description available"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-bold text-lg">{order.amount.toFixed(2)} MAD</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Dates and Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5" />
                            Delivery Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Collection Date</p>
                                <p className="font-medium">{formatDate(order.collection_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Delivery Date</p>
                                <p className="font-medium">{formatDate(order.delivery_date)}</p>
                            </div>
                        </div>

                        {order.livreur ? (
                            <div className="mt-4 border-t pt-4">
                                <p className="text-sm text-gray-500 font-medium flex items-center">
                                    <Truck className="mr-2 h-4 w-4" />
                                    Assigned Delivery Person
                                </p>
                                <p className="font-medium">{order.livreur.first_name} {order.livreur.last_name}</p>
                                <p className="text-sm text-gray-500">CIN: {order.livreur.cin}</p>
                                <p className="text-sm text-gray-500">Address: {order.livreur.adresse}</p>
                            </div>
                        ) : (
                            <div className="mt-4 border-t pt-4">
                                <p className="text-sm text-gray-500 italic">No delivery person assigned yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Client Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Building className="mr-2 h-5 w-5" />
                            Merchant Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{order.client.prenom} {order.client.nom}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Shop</p>
                            <p className="font-medium">{order.client.boutique}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">City</p>
                                <p className="font-medium">{order.client.ville}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">{order.client.adresse || "N/A"}</p>
                            </div>
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <p className="text-sm text-gray-500 flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Payment Information
                            </p>
                            <p className="text-sm">Bank: {order.client.banque}</p>
                            <p className="text-sm font-mono">RIB: {order.client.rib}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            Customer Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{order.customer_info.full_name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium">{order.customer_info.phone_number}</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                Delivery Address
                            </p>
                            <p>{order.customer_info.address}</p>
                            <p>{order.customer_info.city} - {order.customer_info.zone_geographic.name}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="mr-2 h-5 w-5" />
                            Order Timeline
                        </CardTitle>
                        <CardDescription>
                            Track the progress of this order
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="mr-3 bg-green-100 p-2 rounded-full">
                                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">Order Created</p>
                                    <p className="text-sm text-gray-500">{formatDate(order.collection_date)}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className={`mr-3 ${order.status === "pending" ? "bg-gray-100" : "bg-green-100"} p-2 rounded-full`}>
                                    <svg className={`h-4 w-4 ${order.status === "pending" ? "text-gray-400" : "text-green-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {order.status === "pending" ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        )}
                                    </svg>
                                </div>
                                <div>
                                    <p className={`font-medium ${order.status === "pending" ? "text-gray-400" : ""}`}>Processing</p>
                                    <p className="text-sm text-gray-500">{order.status !== "pending" ? "In progress" : "Waiting"}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className={`mr-3 ${["pending", "processing"].includes(order.status) ? "bg-gray-100" : "bg-green-100"} p-2 rounded-full`}>
                                    <svg className={`h-4 w-4 ${["pending", "processing"].includes(order.status) ? "text-gray-400" : "text-green-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {["pending", "processing"].includes(order.status) ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        )}
                                    </svg>
                                </div>
                                <div>
                                    <p className={`font-medium ${["pending", "processing"].includes(order.status) ? "text-gray-400" : ""}`}>Out for Delivery</p>
                                    <p className="text-sm text-gray-500">{["shipped", "delivered"].includes(order.status) ? "On the way" : "Waiting"}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className={`mr-3 ${order.status === "delivered" ? "bg-green-100" : "bg-gray-100"} p-2 rounded-full`}>
                                    <svg className={`h-4 w-4 ${order.status === "delivered" ? "text-green-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {order.status === "delivered" ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        )}
                                    </svg>
                                </div>
                                <div>
                                    <p className={`font-medium ${order.status === "delivered" ? "" : "text-gray-400"}`}>Delivered</p>
                                    <p className="text-sm text-gray-500">{order.status === "delivered" ? formatDate(order.delivery_date) : "Not yet delivered"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}