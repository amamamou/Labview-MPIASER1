"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
const csvData = [
  { date: "2025-01-01", solar: 1240, wind: 1850, hydro: 980, efficiency: 94.2 },
  { date: "2025-01-02", solar: 1320, wind: 1920, hydro: 1020, efficiency: 95.1 },
  { date: "2025-01-03", solar: 1180, wind: 1780, hydro: 950, efficiency: 93.8 },
  { date: "2025-01-04", solar: 1400, wind: 2010, hydro: 1100, efficiency: 96.3 },
  { date: "2025-01-05", solar: 1520, wind: 2100, hydro: 1150, efficiency: 97.2 },
]

export default function DataPage() {
  const [filter, setFilter] = useState("week")

  return (
      <div className="min-h-screen bg-background">
      <Navbar />
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Data & Analytics</h1>
          <p className="text-muted-foreground">View and analyze your renewable energy data</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["day", "week", "month", "year"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === option
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:border-primary/50"
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-2xl border border-border">
          <h2 className="font-semibold mb-6">Energy Production by Source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={csvData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
              <XAxis dataKey="date" stroke="currentColor" className="text-muted-foreground" />
              <YAxis stroke="currentColor" className="text-muted-foreground" />
              <Tooltip />
              <Legend />
              <Bar dataKey="solar" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              <Bar dataKey="wind" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="hydro" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-card rounded-2xl border border-border">
          <h2 className="font-semibold mb-6">System Efficiency Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={csvData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
              <XAxis dataKey="date" stroke="currentColor" className="text-muted-foreground" />
              <YAxis stroke="currentColor" className="text-muted-foreground" />
              <Tooltip />
              <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="p-6 bg-card rounded-2xl border border-border overflow-x-auto">
        <h2 className="font-semibold mb-6">Raw Data</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold">Date</th>
              <th className="text-right py-3 px-4 font-semibold">Solar (kW)</th>
              <th className="text-right py-3 px-4 font-semibold">Wind (kW)</th>
              <th className="text-right py-3 px-4 font-semibold">Hydro (kW)</th>
              <th className="text-right py-3 px-4 font-semibold">Efficiency %</th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((row) => (
              <tr key={row.date} className="border-b border-border hover:bg-muted/50 transition">
                <td className="py-3 px-4">{row.date}</td>
                <td className="text-right py-3 px-4 text-amber-600 font-medium">{row.solar}</td>
                <td className="text-right py-3 px-4 text-blue-600 font-medium">{row.wind}</td>
                <td className="text-right py-3 px-4 text-cyan-600 font-medium">{row.hydro}</td>
                <td className="text-right py-3 px-4 text-green-600 font-medium">{row.efficiency}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
<Footer />
    </div>
  )
}
