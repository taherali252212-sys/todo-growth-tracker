'use client'

import { useEffect, useState } from 'react'
import TodoList from '../components/TodoList'
import GrowthChart from '../components/GrowthChart'
import StatsCard from '../components/StatsCard'

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getStreak(allData) {
  const today = getToday()
  let streak = 0
  let d = new Date()
  while (true) {
    const key = d.toISOString().split('T')[0]
    const todos = allData[key]
    if (!todos || todos.length === 0) break
    const anyDone = todos.some(t => t.completed)
    if (!anyDone) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export default function Home() {
  const [allData, setAllData] = useState({})
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('today') // 'today' | 'history' | 'chart'
  const [historyDate, setHistoryDate] = useState('')

  const today = getToday()

  useEffect(() => {
    fetch('/api/todos')
      .then(r => r.json())
      .then(data => {
        setAllData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleUpdate = (date, todos) => {
    setAllData(prev => ({ ...prev, [date]: todos }))
  }

  // Stats
  const totalDays = Object.keys(allData).length
  const totalTasks = Object.values(allData).flat().length
  const totalDone = Object.values(allData).flat().filter(t => t.completed).length
  const overallRate = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0
  const streak = getStreak(allData)

  const sortedDates = Object.keys(allData).sort((a, b) => new Date(b) - new Date(a))
  const histDates = sortedDates.filter(d => d !== today)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">⚡</div>
          <p className="text-slate-400">Loading your data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
          Daily Growth Tracker
        </h1>
        <p className="text-slate-400 text-sm">
          {new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatsCard icon="🔥" label="Streak" value={`${streak}d`} color="amber" />
        <StatsCard icon="✅" label="Done" value={totalDone} color="green" />
        <StatsCard icon="📅" label="Days" value={totalDays} color="indigo" />
        <StatsCard icon="🎯" label="Rate" value={`${overallRate}%`} color="pink" />
      </div>

      {/* Nav Tabs */}
      <div className="flex gap-2 mb-6 glass rounded-2xl p-1.5 border border-white/10">
        {[
          { key: 'today', label: "📝 Today" },
          { key: 'chart', label: "📈 Growth" },
          { key: 'history', label: "📅 History" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              view === tab.key
                ? 'bg-indigo-600 text-white shadow-lg glow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Views */}
      {view === 'today' && (
        <TodoList
          todos={allData[today] ?? []}
          onUpdate={handleUpdate}
          date={today}
          isToday={true}
        />
      )}

      {view === 'chart' && (
        <GrowthChart allData={allData} />
      )}

      {view === 'history' && (
        <div className="space-y-4">
          {histDates.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center border border-white/10">
              <p className="text-4xl mb-3">🕰️</p>
              <p className="text-slate-400">No history yet. Come back tomorrow!</p>
            </div>
          ) : (
            <>
              {/* Date Picker */}
              <div className="glass rounded-2xl p-4 border border-white/10">
                <label className="text-sm text-slate-400 block mb-2">Jump to date</label>
                <div className="flex flex-wrap gap-2">
                  {histDates.slice(0, 10).map(d => (
                    <button
                      key={d}
                      onClick={() => setHistoryDate(d === historyDate ? '' : d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        historyDate === d
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {new Date(d + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>
              </div>

              {/* History Cards */}
              {(historyDate ? [historyDate] : histDates.slice(0, 5)).map(d => (
                <TodoList
                  key={d}
                  todos={allData[d] ?? []}
                  onUpdate={handleUpdate}
                  date={d}
                  isToday={false}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-slate-600 text-xs mt-10">
        Built with Next.js · Keep showing up every day 💪
      </p>
    </div>
  )
  }
