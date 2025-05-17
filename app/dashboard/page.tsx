import { getTasks } from "@/app/lib/tasks"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import TasksOverview from "@/components/dashboard/tasks-overview"
import TaskList from "@/components/dashboard/task-list"
import TasksProgress from "@/components/dashboard/tasks-progress"

export default async function DashboardPage() {
  const tasks = await getTasks()

  // Calculate task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length

  // Calculate completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Get upcoming tasks (due in the next 3 days)
  const today = new Date()
  const threeDaysFromNow = new Date(today)
  threeDaysFromNow.setDate(today.getDate() + 3)

  const upcomingTasks = tasks
    .filter((task) => {
      const dueDate = new Date(task.dueDate)
      return !task.completed && dueDate <= threeDaysFromNow
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <TasksOverview
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            pendingTasks={pendingTasks}
            highPriorityTasks={highPriorityTasks}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <TaskList initialTasks={upcomingTasks} />
            <TasksProgress completionRate={completionRate} />
          </div>
        </main>
      </div>
    </div>
  )
}
