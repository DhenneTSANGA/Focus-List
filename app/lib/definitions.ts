export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: Priority
  completed: boolean
  createdAt: string
  updatedAt: string
  userId: string
}
