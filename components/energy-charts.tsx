/**
 * Energy Charts Component
 * Displays comprehensive energy data visualization
 */

"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Activity, BarChart3, TrendingUp, Zap } from "lucide-react"

interface EnergyDataPoint {
  time: string
  solar_power: number
  load_power: number
  battery_soc: number
  irradiance: number
  efficiency: number
}

interface EnergyChartsProps {
  data: EnergyDataPoint[]
  title?: string
  compact?: boolean
}

export function EnergyCharts({ data, title = "Energy Analysis", compact = false }: EnergyChartsProps) {
  const chartHeight = compact ? 250 : 350

  const processedData = useMemo(() => {
    return data.slice(-48).map((point) => ({
      ...point,
      time: typeof point.time === "string" ? point.time.split(" ").pop() || point.time : String(point.time),
    }))
  }, [data])

  if (processedData.length === 0) {
    return (
      <div className="p-6 bg-card border border-border rounded-xl text-center text-muted-foreground font-light">
        No data available yet
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-light">{title}</h3>
      </div>

      {/* Solar & Load Power */}
      <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-yellow-500" />
          <h4 className="font-light">Power Output</h4>
        </div>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="solar_power"
              stroke="#fbbf24"
              fillOpacity={1}
              fill="url(#colorSolar)"
              name="Solar Power (W)"
            />
            <Area
              type="monotone"
              dataKey="load_power"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorLoad)"
              name="Load Power (W)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Battery SOC */}
      <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <h4 className="font-light">Battery State of Charge</h4>
        </div>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="battery_soc"
              stroke="#10b981"
              dot={false}
              strokeWidth={2.5}
              name="Battery SOC (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Irradiance & Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Irradiance */}
        <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-orange-500" />
            <h4 className="font-light">Solar Irradiance</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="irradiance" fill="#f97316" name="Irradiance (W/m²)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Efficiency */}
        <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-blue-500" />
            <h4 className="font-light">System Efficiency</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2.5}
                name="Efficiency (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
