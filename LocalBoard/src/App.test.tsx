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
