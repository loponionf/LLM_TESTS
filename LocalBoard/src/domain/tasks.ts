export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
}

export const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'Todo' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#2ea44f',
  medium: '#d29922',
  high: '#da3633',
}

export const DEMO_TASKS: Task[] = [
  {
    id: 1,
    title: 'Setup project',
    description: 'Initialize Vite + React + TypeScript',
    status: 'backlog',
    priority: 'high',
    tags: ['infra'],
  },
  {
    id: 2,
    title: 'Define column types',
    description: 'Backlog, Todo, In Progress, Done',
    status: 'todo',
    priority: 'medium',
    tags: ['types'],
  },
  {
    id: 3,
    title: 'Design card component',
    description: 'Show title, description, priority badge',
    status: 'todo',
    priority: 'medium',
    tags: ['ui'],
  },
  {
    id: 4,
    title: 'Add drag and drop',
    description: 'Move cards between columns',
    status: 'in-progress',
    priority: 'low',
    tags: ['ux'],
  },
  {
    id: 5,
    title: 'Persist to localStorage',
    description: 'Save board state on every change',
    status: 'done',
    priority: 'low',
    tags: ['infra'],
  },
]

export function cardsByColumn(tasks: Task[]): Record<TaskStatus, Task[]> {
  const map: Record<TaskStatus, Task[]> = {
    backlog: [],
    todo: [],
    'in-progress': [],
    done: [],
  }
  for (const task of tasks) {
    map[task.status].push(task)
  }
  return map
}
