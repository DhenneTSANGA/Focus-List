"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, ResponsiveContainer } from "recharts"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

// Définition de l'interface Task (doit correspondre à la structure de votre API /api/tasks)
interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  // Ajoutez d'autres propriétés de tâche si nécessaire
}

// Nouvelles interfaces pour les statistiques détaillées
interface MonthlyStats {
  [key: string]: { // "YYYY-MM"
    total: number;
    completed: number;
    pending: number;
    missed: number;
  };
}

interface YearlyStats {
  [key: string]: { // "YYYY"
    total: number;
    completed: number;
    pending: number;
    missed: number;
  };
}

// Interfaces pour les données de graphique
interface ChartData {
  name: string;
  total: number;
  completed: number;
  pending: number;
  missed: number;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [totalTasks, setTotalTasks] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [pendingTasks, setPendingTasks] = useState(0)
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({})
  const [yearlyStats, setYearlyStats] = useState<YearlyStats>({})
  const [monthlyChartData, setMonthlyChartData] = useState<ChartData[]>([])
  const [yearlyChartData, setYearlyChartData] = useState<ChartData[]>([])
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      if (!isSignedIn) {
        setLoading(false)
        return
      }
      try {
        const response = await fetch('/api/tasks')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const tasks: Task[] = await response.json()

        const total = tasks.length
        const completed = tasks.filter(task => task.completed).length
        const pending = total - completed

        setTotalTasks(total)
        setCompletedTasks(completed)
        setPendingTasks(pending)

        // Calculate monthly and yearly stats
        const newMonthlyStats: MonthlyStats = {}
        const newYearlyStats: YearlyStats = {}
        const now = new Date()

        tasks.forEach(task => {
          const dueDate = new Date(task.dueDate);
          const year = dueDate.getFullYear().toString();
          const month = (dueDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
          const monthKey = `${year}-${month}`;
          const yearKey = year;

          // Initialize month stats if not exists
          if (!newMonthlyStats[monthKey]) {
            newMonthlyStats[monthKey] = { total: 0, completed: 0, pending: 0, missed: 0 };
          }
          // Initialize year stats if not exists
          if (!newYearlyStats[yearKey]) {
            newYearlyStats[yearKey] = { total: 0, completed: 0, pending: 0, missed: 0 };
          }

          newMonthlyStats[monthKey].total++;
          newYearlyStats[yearKey].total++;

          if (task.completed) {
            newMonthlyStats[monthKey].completed++;
            newYearlyStats[yearKey].completed++;
          } else {
            if (dueDate < now) { // Task is not completed and due date is in the past
              newMonthlyStats[monthKey].missed++;
              newYearlyStats[yearKey].missed++;
            } else { // Task is not completed and due date is in the future or today
              newMonthlyStats[monthKey].pending++;
              newYearlyStats[yearKey].pending++;
            }
          }
        });

        setMonthlyStats(newMonthlyStats);
        setYearlyStats(newYearlyStats);

        // Prepare data for charts
        const sortedMonthlyKeys = Object.keys(newMonthlyStats).sort((a, b) => a.localeCompare(b));
        const preparedMonthlyChartData: ChartData[] = sortedMonthlyKeys.map(key => ({
          name: key,
          ...newMonthlyStats[key]
        }));
        setMonthlyChartData(preparedMonthlyChartData);

        const sortedYearlyKeys = Object.keys(newYearlyStats).sort((a, b) => a.localeCompare(b));
        const preparedYearlyChartData: ChartData[] = sortedYearlyKeys.map(key => ({
          name: key,
          ...newYearlyStats[key]
        }));
        setYearlyChartData(preparedYearlyChartData);

      } catch (err) {
        console.error("Failed to fetch tasks:", err)
        setError("Échec du chargement des données. Veuillez réessayer.")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [isSignedIn])

  if (!isLoaded || !isSignedIn || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{loading ? "Chargement du tableau de bord..." : "Vous devez être connecté pour voir cette page."}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <section className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Retour à l'accueil</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Tableau de Bord de {user?.firstName || "l'utilisateur"}</h1>
      </div>

      {/* Overall Task Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total des Tâches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tâches Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{completedTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tâches en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{pendingTasks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid: Calendar + Monthly Stats & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Calendar */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Calendrier des Tâches</h2>
          <Card className="mb-8 p-4 h-[400px] flex items-center justify-center">
            <CardContent className="flex justify-center p-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !selectedCalendarDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedCalendarDate ? format(selectedCalendarDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedCalendarDate}
                    onSelect={setSelectedCalendarDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Monthly Statistics & Charts */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Statistiques Mensuelles</h2>
          <div className="grid gap-6 mb-8">
            {Object.entries(monthlyStats).sort(([a], [b]) => a.localeCompare(b)).map(([monthKey, stats]) => (
              <Card key={monthKey} className="flex flex-col md:flex-row justify-between items-center p-4">
                <CardTitle className="mb-2 md:mb-0 text-xl md:text-2xl">{monthKey}</CardTitle>
                <div className="grid grid-cols-2 gap-4 text-center md:text-left">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-green-500">Terminées</span>
                    <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-yellow-500">En Cours</span>
                    <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-red-500">Manquées</span>
                    <p className="text-2xl font-bold text-red-500">{stats.missed}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Monthly Bar Chart */}
          <h2 className="text-2xl font-bold mb-4">Graphique Mensuel des Tâches</h2>
          <Card className="mb-8 p-4">
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyChartData}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total" fill="#8884d8" />
                  <Bar dataKey="completed" name="Terminées" fill="#82ca9d" />
                  <Bar dataKey="pending" name="En Cours" fill="#ffc658" />
                  <Bar dataKey="missed" name="Manquées" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Line Chart */}
          <h2 className="text-2xl font-bold mb-4">Tendance Mensuelle des Tâches Terminées</h2>
          <Card className="mb-8 p-4">
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={monthlyChartData}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" name="Tâches Terminées" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second main content grid: Yearly Stats & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left Column: Yearly Statistics */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Statistiques Annuelles</h2>
          <div className="grid gap-6 mb-8">
            {Object.entries(yearlyStats).sort(([a], [b]) => a.localeCompare(b)).map(([yearKey, stats]) => (
              <Card key={yearKey} className="flex flex-col md:flex-row justify-between items-center p-4">
                <CardTitle className="mb-2 md:mb-0 text-xl md:text-2xl">{yearKey}</CardTitle>
                <div className="grid grid-cols-2 gap-4 text-center md:text-left">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-green-500">Terminées</span>
                    <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-yellow-500">En Cours</span>
                    <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-red-500">Manquées</span>
                    <p className="text-2xl font-bold text-red-500">{stats.missed}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Yearly Charts */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Graphique Annuel des Tâches</h2>
          <Card className="mb-8 p-4">
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={yearlyChartData}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total" fill="#8884d8" />
                  <Bar dataKey="completed" name="Terminées" fill="#82ca9d" />
                  <Bar dataKey="pending" name="En Cours" fill="#ffc658" />
                  <Bar dataKey="missed" name="Manquées" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-4">Tendance Annuelle des Tâches Terminées</h2>
          <Card className="p-4">
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={yearlyChartData}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" name="Tâches Terminées" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
