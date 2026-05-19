import './App.css'
import { COLUMNS, PRIORITY_COLORS, cardsByColumn, DEMO_TASKS } from './domain/tasks'
import type { Task } from './domain/tasks'

function CardItem({ card }: { card: Task }) {
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
      {card.tags.length > 0 && (
        <span className="kb-card-tags">{card.tags.join(', ')}</span>
      )}
    </div>
  )
}

function Column({ label, cards }: { label: string; cards: Task[] }) {
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
  const grouped = cardsByColumn(DEMO_TASKS)

  return (
    <main className="localboard">
      <h1>LocalBoard</h1>
      <p className="subtitle">Offline Kanban Board</p>
      <div className="kb-board">
        {COLUMNS.map(column => (
          <Column
            key={column.id}
            label={column.label}
            cards={grouped[column.id]}
          />
        ))}
      </div>
    </main>
  )
}

export default App
