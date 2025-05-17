import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertTriangle, ListTodo } from "lucide-react"

interface TasksOverviewProps {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  highPriorityTasks: number
}

export default function TasksOverview({
  totalTasks,
  completedTasks,
  pendingTasks,
  highPriorityTasks,
}: TasksOverviewProps) {
  return (
    <>
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des tâches</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground">Tâches créées</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tâches terminées</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">
            {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% du total` : "0% du total"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tâches en cours</CardTitle>
          <Clock className="h-4 w-4 text-violet-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTasks}</div>
          <p className="text-xs text-muted-foreground">
            {totalTasks > 0 ? `${Math.round((pendingTasks / totalTasks) * 100)}% du total` : "0% du total"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Haute priorité</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highPriorityTasks}</div>
          <p className="text-xs text-muted-foreground">
            {totalTasks > 0 ? `${Math.round((highPriorityTasks / totalTasks) * 100)}% du total` : "0% du total"}
          </p>
        </CardContent>
      </Card>
    </>
  )
}
