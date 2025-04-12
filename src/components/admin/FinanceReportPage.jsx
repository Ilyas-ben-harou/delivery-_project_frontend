"use client"

import { useState, useEffect } from "react"
import { Download, Calendar, ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react"

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

export default function RapportsFinances() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("6mois")
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 6),
    to: new Date(),
  })
  const [financialData, setFinancialData] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    growth: 0,
    revenueByMonth: [],
    expensesByMonth: [],
    profitByMonth: [],
    revenueByCategory: [],
    topProducts: [],
  })

  // Fetch financial data
  useEffect(() => {
    const fetchFinancialData = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with your actual API call
        // const response = await fetch('/api/admin/rapports/finances', {
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
          revenue: 245680,
          expenses: 156420,
          profit: 89260,
          growth: 12.5,
          revenueByMonth: [
            { month: "Jan", value: 32500 },
            { month: "Fév", value: 36700 },
            { month: "Mar", value: 35600 },
            { month: "Avr", value: 42400 },
            { month: "Mai", value: 48900 },
            { month: "Juin", value: 49580 },
          ],
          expensesByMonth: [
            { month: "Jan", value: 22300 },
            { month: "Fév", value: 24500 },
            { month: "Mar", value: 23800 },
            { month: "Avr", value: 27600 },
            { month: "Mai", value: 29800 },
            { month: "Juin", value: 28420 },
          ],
          profitByMonth: [
            { month: "Jan", value: 10200 },
            { month: "Fév", value: 12200 },
            { month: "Mar", value: 11800 },
            { month: "Avr", value: 14800 },
            { month: "Mai", value: 19100 },
            { month: "Juin", value: 21160 },
          ],
          revenueByCategory: [
            { category: "Électronique", value: 98272 },
            { category: "Vêtements", value: 73704 },
            { category: "Alimentation", value: 49136 },
            { category: "Maison", value: 24568 },
          ],
          topProducts: [
            { name: "Smartphone XYZ", revenue: 32500, quantity: 65 },
            { name: "Écouteurs sans fil", revenue: 24800, quantity: 124 },
            { name: "T-shirt Premium", revenue: 18500, quantity: 185 },
            { name: "Chaussures de sport", revenue: 16200, quantity: 54 },
            { name: "Montre connectée", revenue: 15400, quantity: 35 },
          ],
        }

        setFinancialData(mockData)
      } catch (error) {
        console.error("Erreur lors du chargement des données financières:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données financières. Veuillez réessayer plus tard.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFinancialData()
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
      description: `Le rapport financier sera exporté au format ${format.toUpperCase()} prochainement.`,
    })
  }

  // Prepare chart data
  const revenueExpenseChartData = {
    labels: financialData.revenueByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Revenus",
        data: financialData.revenueByMonth.map((item) => item.value),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
      },
      {
        label: "Dépenses",
        data: financialData.expensesByMonth.map((item) => item.value),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 2,
      },
      {
        label: "Bénéfices",
        data: financialData.profitByMonth.map((item) => item.value),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
    ],
  }

  const revenueByCategoryChartData = {
    labels: financialData.revenueByCategory.map((item) => item.category),
    datasets: [
      {
        label: "Revenus par catégorie",
        data: financialData.revenueByCategory.map((item) => item.value),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(249, 115, 22, 0.8)",
        ],
        borderColor: ["rgb(34, 197, 94)", "rgb(59, 130, 246)", "rgb(168, 85, 247)", "rgb(249, 115, 22)"],
        borderWidth: 1,
      },
    ],
  }

  const profitTrendChartData = {
    labels: financialData.profitByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Évolution des bénéfices",
        data: financialData.profitByMonth.map((item) => item.value),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rapport financier</h1>
          <p className="text-muted-foreground">
            Analyse des revenus, dépenses et bénéfices pour la période sélectionnée
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
              <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financialData.revenue.toLocaleString("fr-FR")} MAD</div>
              <p className="text-xs text-muted-foreground">+{financialData.growth}% depuis la période précédente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses totales</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financialData.expenses.toLocaleString("fr-FR")} MAD</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((financialData.expenses / financialData.revenue) * 100)}% des revenus
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bénéfices nets</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financialData.profit.toLocaleString("fr-FR")} MAD</div>
              <p className="text-xs text-muted-foreground">
                Marge de {Math.round((financialData.profit / financialData.revenue) * 100)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Croissance</CardTitle>
              {financialData.growth > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialData.growth > 0 ? "+" : ""}
                {financialData.growth}%
              </div>
              <p className="text-xs text-muted-foreground">Comparé à la période précédente</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="profit">Bénéfices</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Revenus, dépenses et bénéfices</CardTitle>
                <CardDescription>
                  Comparaison des revenus, dépenses et bénéfices sur la période sélectionnée
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px]">
                  <BarChart
                    data={revenueExpenseChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => value.toLocaleString("fr-FR") + " MAD",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              let label = context.dataset.label || ""
                              if (label) {
                                label += ": "
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat("fr-FR").format(context.parsed.y) + " MAD"
                              }
                              return label
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {isLoading ? (
              <>
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenus par catégorie</CardTitle>
                    <CardDescription>Répartition des revenus par catégorie de produits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <BarChart
                        data={revenueByCategoryChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          indexAxis: "y",
                          scales: {
                            x: {
                              beginAtZero: true,
                              ticks: {
                                callback: (value) => value.toLocaleString("fr-FR") + " MAD",
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  let label = context.dataset.label || ""
                                  if (label) {
                                    label += ": "
                                  }
                                  if (context.parsed.x !== null) {
                                    label += new Intl.NumberFormat("fr-FR").format(context.parsed.x) + " MAD"
                                  }
                                  return label
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des bénéfices</CardTitle>
                    <CardDescription>Tendance des bénéfices sur la période</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <LineChart
                        data={profitTrendChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: (value) => value.toLocaleString("fr-FR") + " MAD",
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  let label = context.dataset.label || ""
                                  if (label) {
                                    label += ": "
                                  }
                                  if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat("fr-FR").format(context.parsed.y) + " MAD"
                                  }
                                  return label
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Produits les plus vendus</CardTitle>
                <CardDescription>Top 5 des produits générant le plus de revenus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {financialData.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-[40px] text-center font-medium">{index + 1}</div>
                      <div className="ml-2 flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.quantity} unités vendues</p>
                      </div>
                      <div className="font-medium">{product.revenue.toLocaleString("fr-FR")} MAD</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir tous les produits
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expenses">
          <div className="p-8 text-center text-muted-foreground">
            Détails des dépenses à venir dans une prochaine mise à jour
          </div>
        </TabsContent>

        <TabsContent value="profit">
          <div className="p-8 text-center text-muted-foreground">
            Analyse détaillée des bénéfices à venir dans une prochaine mise à jour
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
