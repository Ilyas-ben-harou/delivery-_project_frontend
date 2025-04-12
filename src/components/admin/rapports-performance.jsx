"use client"

import { useState, useEffect } from "react"
import { Download, Calendar, ArrowUpRight, Award, Clock, TrendingUp } from "lucide-react"

import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { BarChart, LineChart } from "../ui/chart"
import { Skeleton } from "../ui/skeleton"
import { useToast } from "../ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar as CalendarComponent } from "../ui/calendar"
import { format, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { Progress } from "../ui/progress"
import { Avatar, AvatarFallback } from "../ui/avatar"

export default function RapportsPerformance() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("6mois")
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 6),
    to: new Date(),
  })
  const [performanceData, setPerformanceData] = useState({
    deliveryRate: 0,
    avgDeliveryTime: 0,
    customerSatisfaction: 0,
    onTimeDelivery: 0,
    deliveryRateByMonth: [],
    deliveryTimeByMonth: [],
    satisfactionByMonth: [],
    topDistributors: [],
    performanceByZone: [],
  })

  // Fetch performance data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with your actual API call
        // const response = await fetch('/api/admin/rapports/performance', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     from: dateRange.from.toISOString(),
        //     to: dateRange.to.toISOString()
        //   }),
        // })
        // const data = await response.json()

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockData = {
          deliveryRate: 92.5,
          avgDeliveryTime: 45, // minutes
          customerSatisfaction: 4.7, // out of 5
          onTimeDelivery: 94.2, // percentage
          deliveryRateByMonth: [
            { month: "Jan", value: 88.2 },
            { month: "Fév", value: 89.5 },
            { month: "Mar", value: 90.1 },
            { month: "Avr", value: 91.3 },
            { month: "Mai", value: 92.0 },
            { month: "Juin", value: 92.5 },
          ],
          deliveryTimeByMonth: [
            { month: "Jan", value: 52 },
            { month: "Fév", value: 50 },
            { month: "Mar", value: 48 },
            { month: "Avr", value: 47 },
            { month: "Mai", value: 46 },
            { month: "Juin", value: 45 },
          ],
          satisfactionByMonth: [
            { month: "Jan", value: 4.3 },
            { month: "Fév", value: 4.4 },
            { month: "Mar", value: 4.5 },
            { month: "Avr", value: 4.6 },
            { month: "Mai", value: 4.6 },
            { month: "Juin", value: 4.7 },
          ],
          topDistributors: [
            {
              id: 1,
              name: "Mohammed Alaoui",
              deliveryRate: 98.2,
              avgTime: 38,
              satisfaction: 4.9,
              completedDeliveries: 245,
            },
            {
              id: 2,
              name: "Sara Benani",
              deliveryRate: 96.5,
              avgTime: 40,
              satisfaction: 4.8,
              completedDeliveries: 210,
            },
            {
              id: 3,
              name: "Youssef El Fassi",
              deliveryRate: 95.8,
              avgTime: 42,
              satisfaction: 4.7,
              completedDeliveries: 185,
            },
            {
              id: 4,
              name: "Fatima Doukkali",
              deliveryRate: 94.3,
              avgTime: 44,
              satisfaction: 4.6,
              completedDeliveries: 168,
            },
            {
              id: 5,
              name: "Karim Chaoui",
              deliveryRate: 93.1,
              avgTime: 46,
              satisfaction: 4.5,
              completedDeliveries: 152,
            },
          ],
          performanceByZone: [
            { zone: "NORD", deliveryRate: 91.2, avgTime: 47, satisfaction: 4.6 },
            { zone: "SUD", deliveryRate: 93.5, avgTime: 44, satisfaction: 4.7 },
            { zone: "EST", deliveryRate: 90.8, avgTime: 48, satisfaction: 4.5 },
            { zone: "OUEST", deliveryRate: 92.3, avgTime: 46, satisfaction: 4.6 },
            { zone: "CENTRE", deliveryRate: 94.7, avgTime: 40, satisfaction: 4.8 },
          ],
        }

        setPerformanceData(mockData)
      } catch (error) {
        console.error("Erreur lors du chargement des données de performance:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de performance. Veuillez réessayer plus tard.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPerformanceData()
  }, [dateRange, toast])

  // Handle period change
  const handlePeriodChange = (value) => {
    setPeriod(value)
    const today = new Date()

    switch (value) {
      case "1mois":
        setDateRange({
          from: subMonths(today, 1),
          to: today,
        })
        break
      case "3mois":
        setDateRange({
          from: subMonths(today, 3),
          to: today,
        })
        break
      case "6mois":
        setDateRange({
          from: subMonths(today, 6),
          to: today,
        })
        break
      case "1an":
        setDateRange({
          from: subMonths(today, 12),
          to: today,
        })
        break
      case "personnalise":
        // Keep current date range when switching to custom
        break
      default:
        setDateRange({
          from: subMonths(today, 6),
          to: today,
        })
    }
  }

  // Handle export
  const handleExport = (format) => {
    toast({
      title: "Export en cours",
      description: `Le rapport de performance sera exporté au format ${format.toUpperCase()} prochainement.`,
    })
  }

  // Prepare chart data
  const deliveryRateChartData = {
    labels: performanceData.deliveryRateByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Taux de livraison (%)",
        data: performanceData.deliveryRateByMonth.map((item) => item.value),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
      },
    ],
  }

  const deliveryTimeChartData = {
    labels: performanceData.deliveryTimeByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Temps moyen de livraison (min)",
        data: performanceData.deliveryTimeByMonth.map((item) => item.value),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
    ],
  }

  const satisfactionChartData = {
    labels: performanceData.satisfactionByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Satisfaction client (sur 5)",
        data: performanceData.satisfactionByMonth.map((item) => item.value),
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgb(168, 85, 247)",
        borderWidth: 2,
      },
    ],
  }

  const zonePerformanceChartData = {
    labels: performanceData.performanceByZone.map((item) => item.zone),
    datasets: [
      {
        label: "Taux de livraison (%)",
        data: performanceData.performanceByZone.map((item) => item.deliveryRate),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "Temps moyen (min)",
        data: performanceData.performanceByZone.map((item) => item.avgTime),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "Satisfaction (sur 5)",
        data: performanceData.performanceByZone.map((item) => item.satisfaction * 20), // Scale to percentage
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgb(168, 85, 247)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rapport de performance</h1>
          <p className="text-muted-foreground">
            Analyse des performances de livraison et satisfaction client pour la période sélectionnée
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1mois">Dernier mois</SelectItem>
              <SelectItem value="3mois">3 derniers mois</SelectItem>
              <SelectItem value="6mois">6 derniers mois</SelectItem>
              <SelectItem value="1an">Dernière année</SelectItem>
              <SelectItem value="personnalise">Période personnalisée</SelectItem>
            </SelectContent>
          </Select>

          {period === "personnalise" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: fr })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: fr })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: fr })
                    )
                  ) : (
                    <span>Sélectionner une période</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("excel")}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de livraison</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.deliveryRate}%</div>
              <Progress value={performanceData.deliveryRate} className="mt-2" indicatorClassName="bg-green-500" />
              <p className="text-xs text-muted-foreground mt-2">
                +{(performanceData.deliveryRate - performanceData.deliveryRateByMonth[0].value).toFixed(1)}% depuis{" "}
                {performanceData.deliveryRateByMonth[0].month}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps moyen de livraison</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.avgDeliveryTime} minutes</div>
              <Progress
                value={100 - (performanceData.avgDeliveryTime / 60) * 100}
                className="mt-2"
                indicatorClassName="bg-blue-500"
              />
              <p className="text-xs text-muted-foreground mt-2">
                -{performanceData.deliveryTimeByMonth[0].value - performanceData.avgDeliveryTime} minutes depuis{" "}
                {performanceData.deliveryTimeByMonth[0].month}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction client</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.customerSatisfaction}/5</div>
              <Progress
                value={(performanceData.customerSatisfaction / 5) * 100}
                className="mt-2"
                indicatorClassName="bg-purple-500"
              />
              <p className="text-xs text-muted-foreground mt-2">
                +{(performanceData.customerSatisfaction - performanceData.satisfactionByMonth[0].value).toFixed(1)}{" "}
                depuis {performanceData.satisfactionByMonth[0].month}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livraisons à l'heure</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.onTimeDelivery}%</div>
              <Progress value={performanceData.onTimeDelivery} className="mt-2" indicatorClassName="bg-green-500" />
              <p className="text-xs text-muted-foreground mt-2">Objectif: 95%</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="distributors">Distributeurs</TabsTrigger>
          <TabsTrigger value="zones">Zones géographiques</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction client</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Évolution des indicateurs clés</CardTitle>
                <CardDescription>
                  Suivi des principaux indicateurs de performance sur la période sélectionnée
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px]">
                  <LineChart
                    data={{
                      labels: performanceData.deliveryRateByMonth.map((item) => item.month),
                      datasets: [
                        {
                          label: "Taux de livraison (%)",
                          data: performanceData.deliveryRateByMonth.map((item) => item.value),
                          borderColor: "rgb(34, 197, 94)",
                          backgroundColor: "rgba(34, 197, 94, 0.5)",
                          yAxisID: "y",
                        },
                        {
                          label: "Temps moyen (min)",
                          data: performanceData.deliveryTimeByMonth.map((item) => item.value),
                          borderColor: "rgb(59, 130, 246)",
                          backgroundColor: "rgba(59, 130, 246, 0.5)",
                          yAxisID: "y1",
                        },
                        {
                          label: "Satisfaction (sur 5)",
                          data: performanceData.satisfactionByMonth.map((item) => item.value),
                          borderColor: "rgb(168, 85, 247)",
                          backgroundColor: "rgba(168, 85, 247, 0.5)",
                          yAxisID: "y2",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: "index",
                        intersect: false,
                      },
                      stacked: false,
                      scales: {
                        y: {
                          type: "linear",
                          display: true,
                          position: "left",
                          min: 80,
                          max: 100,
                          title: {
                            display: true,
                            text: "Taux de livraison (%)",
                          },
                        },
                        y1: {
                          type: "linear",
                          display: true,
                          position: "right",
                          min: 30,
                          max: 60,
                          grid: {
                            drawOnChartArea: false,
                          },
                          title: {
                            display: true,
                            text: "Temps moyen (min)",
                          },
                        },
                        y2: {
                          type: "linear",
                          display: true,
                          position: "right",
                          min: 4,
                          max: 5,
                          grid: {
                            drawOnChartArea: false,
                          },
                          title: {
                            display: true,
                            text: "Satisfaction (sur 5)",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="distributors">
          {isLoading ? (
            <Skeleton className="h-[500px] w-full" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Top 5 des distributeurs</CardTitle>
                <CardDescription>Classement des distributeurs les plus performants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {performanceData.topDistributors.map((distributor, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-[40px] text-center">
                        {index === 0 ? (
                          <Award className="h-6 w-6 text-yellow-500 mx-auto" />
                        ) : index === 1 ? (
                          <Award className="h-6 w-6 text-gray-400 mx-auto" />
                        ) : index === 2 ? (
                          <Award className="h-6 w-6 text-amber-700 mx-auto" />
                        ) : (
                          <div className="font-medium">{index + 1}</div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {distributor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-medium">{distributor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {distributor.completedDeliveries} livraisons complétées
                        </div>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{distributor.deliveryRate}%</div>
                          <div className="text-xs text-muted-foreground">Taux</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{distributor.avgTime} min</div>
                          <div className="text-xs text-muted-foreground">Temps</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{distributor.satisfaction}/5</div>
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir tous les distributeurs
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="zones">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Performance par zone géographique</CardTitle>
                <CardDescription>Comparaison des indicateurs de performance par zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <BarChart
                    data={performanceData.performanceByZone.map((zone) => ({
                      name: zone.zone,
                      value: zone.deliveryRate,
                    }))}
                    dataKey="value"
                    nameKey="name"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="satisfaction">
          <div className="p-8 text-center text-muted-foreground">
            Analyse détaillée de la satisfaction client à venir dans une prochaine mise à jour
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}