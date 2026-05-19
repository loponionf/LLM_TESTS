import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('renders the LocalBoard heading', () => {
  render(<App />)
  const heading = screen.getByRole('heading', { name: /LocalBoard/i })
  expect(heading).toBeInTheDocument()
})

test('shows the subtitle text', () => {
  render(<App />)
  expect(screen.getByText('Offline Kanban Board')).toBeInTheDocument()
})

test('renders all four columns', () => {
  render(<App />)
  const expectedColumns = ['Backlog', 'Todo', 'In Progress', 'Done']
  for (const col of expectedColumns) {
    expect(screen.getByRole('heading', { name: new RegExp(col, 'i') })).toBeInTheDocument()
  }
})

test('renders demo cards in columns', () => {
  render(<App />)
  expect(screen.getByText('Setup project')).toBeInTheDocument()
  expect(screen.getByText('Define column types')).toBeInTheDocument()
  expect(screen.getByText('Add drag and drop')).toBeInTheDocument()
})
