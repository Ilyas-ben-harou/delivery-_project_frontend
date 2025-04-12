"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  BarChart3,
  Box,
  CircleDollarSign,
  Clock,
  Package,
  PackageCheck,
  PackageX,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react"

import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { BarChartWrapper } from "../ui/BarChartWrapper"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDistributors: 0,
    activeDistributors: 0,
    totalDeliveries: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    failedDeliveries: 0,
    revenue: 0,
    deliveryRate: 0,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API

        setStats({
          totalDistributors: 48,
          activeDistributors: 32,
          totalDeliveries: 1248,
          pendingDeliveries: 124,
          completedDeliveries: 1056,
          failedDeliveries: 68,
          revenue: 45680,
          deliveryRate: 84.6,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const deliveryChartData = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        label: "Livraisons complétées",
        data: [65, 78, 52, 91, 83, 56, 48],
        backgroundColor: "rgba(34, 197, 94, 0.8)",
      },
      {
        label: "Livraisons échouées",
        data: [12, 8, 6, 14, 9, 7, 5],
        backgroundColor: "rgba(239, 68, 68, 0.8)",
      },
    ],
  }

  const revenueChartData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Revenu (MAD)",
        data: [12500, 18700, 15600, 22400, 28900, 45680],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
    ],
  }

  const recentActivities = [
    { id: 1, type: "delivery", message: "Livraison #12458 complétée par Mohammed A.", time: "Il y a 10 minutes" },
    { id: 2, type: "user", message: "Nouveau distributeur Sara B. inscrit", time: "Il y a 45 minutes" },
    { id: 3, type: "delivery", message: "Livraison #12457 échouée - client absent", time: "Il y a 1 heure" },
    { id: 4, type: "payment", message: "Paiement de 1250 MAD effectué à Karim C.", time: "Il y a 3 heures" },
    { id: 5, type: "delivery", message: "Livraison #12456 complétée par Fatima D.", time: "Il y a 5 heures" },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <Button variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Dernière mise à jour: {new Date().toLocaleTimeString("fr-FR")}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Distributeurs" icon={<Users />} value={stats.totalDistributors}>
          {stats.activeDistributors} actifs ({Math.round((stats.activeDistributors / stats.totalDistributors) * 100)}%)
        </MetricCard>
        <MetricCard title="Livraisons totales" icon={<Package />} value={stats.totalDeliveries}>
          {stats.pendingDeliveries} en attente
        </MetricCard>
        <MetricCard title="Taux de livraison" icon={<TrendingUp />} value={`${stats.deliveryRate}%`}>
          +2.5% depuis le mois dernier
        </MetricCard>
        <MetricCard title="Revenu" icon={<CircleDollarSign />} value={`${stats.revenue.toLocaleString("fr-FR")} MAD`}>
          +12% depuis le mois dernier
        </MetricCard>
      </div>

      {/* Delivery Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          title="Livraisons complétées"
          value={stats.completedDeliveries}
          percentage={(stats.completedDeliveries / stats.totalDeliveries) * 100}
          icon={<PackageCheck className="text-green-600" />}
          color="green"
        />
        <StatusCard
          title="Livraisons en attente"
          value={stats.pendingDeliveries}
          percentage={(stats.pendingDeliveries / stats.totalDeliveries) * 100}
          icon={<Truck className="text-yellow-600" />}
          color="yellow"
        />
        <StatusCard
          title="Livraisons échouées"
          value={stats.failedDeliveries}
          percentage={(stats.failedDeliveries / stats.totalDeliveries) * 100}
          icon={<PackageX className="text-red-600" />}
          color="red"
        />
      </div>

      {/* Charts + Activities */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aperçu des livraisons</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Tabs defaultValue="weekly" className="space-y-4">
              <TabsList>
                <TabsTrigger value="daily">Quotidien</TabsTrigger>
                <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <BarChartWrapper data={deliveryChartData} />
              </TabsContent>
              <TabsContent value="weekly">
                <BarChartWrapper data={deliveryChartData} />
              </TabsContent>
              <TabsContent value="monthly">
                <BarChartWrapper data={revenueChartData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Les 5 dernières activités sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} {...activity} />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Voir toutes les activités
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickLinkCard
          title="Gestion des distributeurs"
          description="Gérez les comptes distributeurs, leurs zones et leurs commissions."
          icon={<Users />}
          link="/admin/livreurs"
        />
        <QuickLinkCard
          title="Suivi des livraisons"
          description="Suivez en temps réel l'état des livraisons et les performances."
          icon={<Truck />}
          link="/admin/livraisons"
        />
        <QuickLinkCard
          title="Gestion des utilisateurs"
          description="Gérez les comptes administrateurs, managers et support."
          icon={<Box />}
          link="/admin/clients"
        />
        <QuickLinkCard
          title="Rapports et statistiques"
          description="Consultez les rapports détaillés et les analyses de performance."
          icon={<BarChart3 />}
          link="/admin/reports"
        />
      </div>
    </div>
  )
}

// Components for reuse
function MetricCard({ title, icon, value, children }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{children}</p>
      </CardContent>
    </Card>
  )
}

function StatusCard({ title, value, percentage, icon, color }) {
  const bg = {
    green: "bg-green-50",
    yellow: "bg-yellow-50",
    red: "bg-red-50",
  }[color]

  const textColor = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  }[color]

  return (
    <Card className={bg}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
        <p className={`text-xs ${textColor}/80`}>{Math.round(percentage)}% du total</p>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ type, message, time }) {
  const iconColor = type === "delivery" ? "text-blue-600" : type === "user" ? "text-green-600" : "text-yellow-600"

  const iconBg = type === "delivery" ? "bg-blue-100" : type === "user" ? "bg-green-100" : "bg-yellow-100"

  const Icon = type === "delivery" ? Package : type === "user" ? Users : CircleDollarSign

  return (
    <div className="flex items-start gap-4">
      <div className={`mt-1 rounded-full p-2 ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{message}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

function QuickLinkCard({ title, description, icon, link }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="mt-2">
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={link}>
            Accéder
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}