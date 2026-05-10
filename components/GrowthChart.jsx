'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts'
import { useState } from 'react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl p-3 border border-indigo-500/30 text-sm">
        <p className="font-semibold text-indigo-300 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <span className="font-bold text-white">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function GrowthChart({ allData }) {
  const [chartType, setChartType] = useState('area')

  const chartData = Object.entries(allData)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .slice(-14)
    .map(([date, todos]) => {
      const total = todos.length
      const done = todos.filter(t => t.completed).length
      const rate = total > 0 ? Math.round((done / total) * 100) : 0
      return {
        date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        Total: total,
        Completed: done,
        'Rate %': rate,
      }
    })

  if (chartData.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center border border-white/10">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-slate-400">Complete a few days to see your growth chart!</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          📈 Growth Over Time
          <span className="text-xs bg-indigo-600/30 text-indigo-300 px-2 py-1 rounded-full">Last 14 days</span>
        </h2>
        <div className="flex gap-2">
          {['area', 'bar'].map(t => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                chartType === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {t === 'area' ? '📉 Area' : '📊 Bar'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'area' ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13 }} />
            <Area type="monotone" dataKey="Total" stroke="#6366f1" strokeWidth={2} fill="url(#colorTotal)" />
            <Area type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={2} fill="url(#colorDone)" />
          </AreaChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13 }} />
            <Bar dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Rate %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
                  }
