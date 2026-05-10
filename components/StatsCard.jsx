export default function StatsCard({ icon, label, value, color = 'indigo' }) {
  const colors = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400',
    green:  'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    amber:  'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
    pink:   'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400',
  }
  return (
    <div className={`glass rounded-2xl p-5 bg-gradient-to-br ${colors[color]} border`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-slate-400 font-medium">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  )
}
