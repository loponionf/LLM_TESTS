import './App.css'

interface Card {
  id: number
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

const COLUMNS = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'Todo' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
] as const

const CARDS: Card[] = [
  { id: 1, title: 'Setup project', description: 'Initialize Vite + React + TypeScript', priority: 'high' },
  { id: 2, title: 'Define column types', description: 'Backlog, Todo, In Progress, Done', priority: 'medium' },
  { id: 3, title: 'Design card component', description: 'Show title, description, priority badge', priority: 'medium' },
  { id: 4, title: 'Add drag and drop', description: 'Move cards between columns', priority: 'low' },
  { id: 5, title: 'Persist to localStorage', description: 'Save board state on every change', priority: 'low' },
]

const CARDS_BY_COLUMN: Record<string, Card[]> = {
  backlog: [CARDS[0]],
  todo: [CARDS[1], CARDS[2]],
  'in-progress': [CARDS[3]],
  done: [CARDS[4]],
}

const PRIORITY_COLORS: Record<string, string> = {
  low: '#2ea44f',
  medium: '#d29922',
  high: '#da3633',
}

function CardItem({ card }: { card: Card }) {
  return (
    <div className="kb-card">
      <span className="kb-card-title">{card.title}</span>
      <span className="kb-card-desc">{card.description}</span>
      <span
        className="kb-card-badge"
        style={{ backgroundColor: PRIORITY_COLORS[card.priority] }}
      >
        {card.priority}
      </span>
    </div>
  )
}

function Column({ label, cards }: { label: string; cards: Card[] }) {
  return (
    <section className="kb-column" aria-label={label}>
      <h2 className="kb-column-title">
        {label}
        <span className="kb-count">{cards.length}</span>
      </h2>
      <div className="kb-column-cards">
        {cards.map(card => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}

function App() {
  return (
    <main className="localboard">
      <h1>LocalBoard</h1>
      <p className="subtitle">Offline Kanban Board</p>
      <div className="kb-board">
        {COLUMNS.map(column => (
          <Column
            key={column.id}
            label={column.label}
            cards={CARDS_BY_COLUMN[column.id] ?? []}
          />
        ))}
      </div>
    </main>
  )
}

export default App
