import { expect, test } from 'vitest'
import { COLUMNS, DEMO_TASKS, cardsByColumn, PRIORITY_COLORS } from './tasks'
import type { Task, TaskStatus, TaskPriority } from './tasks'

test('cardsByColumn groups tasks by status correctly', () => {
  const grouped = cardsByColumn(DEMO_TASKS)

  expect(grouped.backlog).toHaveLength(1)
  expect(grouped.backlog[0].title).toBe('Setup project')

  expect(grouped.todo).toHaveLength(2)
  expect(grouped.todo.map(t => t.title)).toEqual(['Define column types', 'Design card component'])

  expect(grouped['in-progress']).toHaveLength(1)
  expect(grouped['in-progress'][0].title).toBe('Add drag and drop')

  expect(grouped.done).toHaveLength(1)
  expect(grouped.done[0].title).toBe('Persist to localStorage')
})

test('cardsByColumn returns empty arrays for no matching tasks', () => {
  const empty: Task[] = []
  const grouped = cardsByColumn(empty)

  for (const status of Object.keys(grouped) as TaskStatus[]) {
    expect(grouped[status]).toEqual([])
  }
})

test('cardsByColumn distributes tasks across all columns', () => {
  const all: Task[] = [
    { id: 1, title: 'a', description: 'b', status: 'backlog', priority: 'low', tags: [] },
    { id: 2, title: 'c', description: 'd', status: 'todo', priority: 'medium', tags: [] },
    { id: 3, title: 'e', description: 'f', status: 'in-progress', priority: 'high', tags: [] },
    { id: 4, title: 'g', description: 'h', status: 'done', priority: 'low', tags: [] },
  ]
  const grouped = cardsByColumn(all)

  expect(grouped.backlog).toHaveLength(1)
  expect(grouped.todo).toHaveLength(1)
  expect(grouped['in-progress']).toHaveLength(1)
  expect(grouped.done).toHaveLength(1)
})

test('all expected statuses exist in COLUMNS', () => {
  const ids = COLUMNS.map(c => c.id)

  expect(ids).toContain('backlog')
  expect(ids).toContain('todo')
  expect(ids).toContain('in-progress')
  expect(ids).toContain('done')
})

test('COLUMNS length matches TaskStatus count', () => {
  const expected: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'done']
  expect(COLUMNS).toHaveLength(expected.length)
})

test('DEMO_TASKS include all required fields', () => {
  const requiredFields: (keyof Task)[] = ['id', 'title', 'description', 'status', 'priority', 'tags']

  for (const task of DEMO_TASKS) {
    for (const field of requiredFields) {
      expect(task).toHaveProperty(field)
    }
    // tags must be an array
    expect(Array.isArray(task.tags)).toBe(true)
  }
})

test('DEMO_TASKS statuses are valid TaskStatus values', () => {
  const valid: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'done']
  for (const task of DEMO_TASKS) {
    expect(valid).toContain(task.status)
  }
})

test('DEMO_TASKS priorities are valid TaskPriority values', () => {
  const valid: TaskPriority[] = ['low', 'medium', 'high']
  for (const task of DEMO_TASKS) {
    expect(valid).toContain(task.priority)
  }
})

test('PRIORITY_COLORS covers all priorities', () => {
  expect(PRIORITY_COLORS.low).toBeDefined()
  expect(PRIORITY_COLORS.medium).toBeDefined()
  expect(PRIORITY_COLORS.high).toBeDefined()
})

test('DEMO_TASKS have unique ids', () => {
  const ids = DEMO_TASKS.map(t => t.id)
  const unique = new Set(ids)
  expect(unique.size).toBe(ids.length)
})
