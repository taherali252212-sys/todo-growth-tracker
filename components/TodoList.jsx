'use client'

import { useState } from 'react'

export default function TodoList({ todos, onUpdate, date, isToday }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const addTodo = async () => {
    const text = input.trim()
    if (!text) return
    const updated = [...todos, { id: Date.now(), text, completed: false, createdAt: new Date().toISOString() }]
    setInput('')
    await save(updated)
  }

  const toggle = async (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    await save(updated)
  }

  const remove = async (id) => {
    const updated = todos.filter(t => t.id !== id)
    await save(updated)
  }

  const save = async (updated) => {
    setLoading(true)
    try {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, todos: updated }),
      })
      onUpdate(date, updated)
    } finally {
      setLoading(false)
    }
  }

  const done = todos.filter(t => t.completed).length
  const pct = todos.length > 0 ? Math.round((done / todos.length) * 100) : 0

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isToday ? "📝 Today's Todos" : `📅 ${new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}`}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {done}/{todos.length} completed
          </p>
        </div>
        {loading && <span className="text-xs text-indigo-400 animate-pulse">Saving…</span>}
      </div>

      {/* Progress Bar */}
      {todos.length > 0 && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span>
            <span className={pct === 100 ? 'text-emerald-400 font-bold' : ''}>{pct}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct === 100
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              }}
            />
          </div>
          {pct === 100 && (
            <p className="text-emerald-400 text-sm font-semibold mt-2 text-center">
              🎉 All done! Amazing work!
            </p>
          )}
        </div>
      )}

      {/* Add Input (only for today) */}
      {isToday && (
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 glow"
          >
            + Add
          </button>
        </div>
      )}

      {/* Todo Items */}
      {todos.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p className="text-3xl mb-2">✨</p>
          <p>{isToday ? 'Add your first task for today!' : 'No tasks recorded for this day.'}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-all group fade-in"
            >
              <button
                onClick={() => toggle(todo.id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  todo.completed
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-500 hover:border-indigo-400'
                }`}
              >
                {todo.completed && <span className="text-white text-xs">✓</span>}
              </button>
              <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {todo.text}
              </span>
              {isToday && (
                <button
                  onClick={() => remove(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all text-lg leading-none"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
        }
