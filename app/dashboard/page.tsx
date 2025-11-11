"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  TrendingUp,
  Zap,
  Download,
  Activity,
  Leaf,
  Wind,
  Sun,
  Droplet,
  Gauge,
  ArrowUpRight,
  Filter,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const energySources = [
  { id: "1", name: "Solar Farm Alpha", type: "Solar", power: "2,458 kW", trend: "+12%", icon: Sun, color: "#fbbf24" },
  { id: "2", name: "Wind Station Beta", type: "Wind", power: "1,890 kW", trend: "+8%", icon: Wind, color: "#3b82f6" },
  {
    id: "3",
    name: "Hydro Plant Gamma",
    type: "Hydro",
    power: "3,124 kW",
    trend: "+5%",
    icon: Droplet,
    color: "#06b6d4",
  },
  {
    id: "4",
    name: "Geothermal Central",
    type: "Geothermal",
    power: "1,456 kW",
    trend: "+15%",
    icon: Gauge,
    color: "#dc2626",
  },
]

const chartData = [
  { time: "00:00", solar: 0, wind: 1200, hydro: 2500 },
  { time: "04:00", solar: 50, wind: 1400, hydro: 2400 },
  { time: "08:00", solar: 800, wind: 1100, hydro: 2300 },
  { time: "12:00", solar: 2200, wind: 900, hydro: 2100 },
  { time: "16:00", solar: 1800, wind: 1300, hydro: 2200 },
  { time: "20:00", solar: 200, wind: 1500, hydro: 2400 },
  { time: "24:00", solar: 0, wind: 1200, hydro: 2500 },
]

const pieData = [
  { name: "Solar", value: 2458, fill: "#fbbf24" },
  { name: "Wind", value: 1890, fill: "#3b82f6" },
  { name: "Hydro", value: 3124, fill: "#06b6d4" },
  { name: "Geothermal", value: 1456, fill: "#dc2626" },
]

interface EnergySource {
  id: string
  name: string
  type: string
  power: string
  trend: string
  icon: any
  color: string
}

export default function Dashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  useEffect(() => {
    const authData = localStorage.getItem("user_profile")
    if (!authData) {
      router.push("/auth/signin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const filteredSources = energySources.filter(
    (source) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-light mb-3 text-foreground">Energy Dashboard</h1>
          <p className="text-lg font-light text-muted-foreground">
            Real-time monitoring of your renewable energy operations
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 animate-slide-down">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search energy sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-light"
            />
          </div>
          <button className="px-4 py-3 bg-card border border-border rounded-lg hover:bg-muted hover:scale-105 transition-all flex items-center gap-2 font-light active:scale-95">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:scale-105 transition-all flex items-center gap-2 font-light shadow-lg active:scale-95">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Power", value: "9,728 kW", change: "+9%", icon: Zap, color: "from-primary" },
            { label: "Today's Output", value: "156,432 kWh", change: "+12%", icon: TrendingUp, color: "from-accent" },
            { label: "Efficiency", value: "94.2%", change: "+2%", icon: Activity, color: "from-blue-500" },
            { label: "Carbon Saved", value: "2.4 Tons", change: "+5%", icon: Leaf, color: "from-green-500" },
          ].map((kpi, i) => (
            <div
              key={i}
              className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all hover:scale-105 animate-fade-in-up group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${kpi.color} to-transparent/10 group-hover:scale-110 transition-transform`}
                >
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-light text-primary bg-primary/10 px-2 py-1 rounded">{kpi.change}</span>
              </div>
              <p className="text-muted-foreground text-sm font-light mb-1">{kpi.label}</p>
              <p className="text-2xl font-light text-foreground">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div
            className="lg:col-span-2 p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all animate-fade-in-up group"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-lg font-light mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> 24-Hour Output
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
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
                <Line type="monotone" dataKey="solar" stroke="#fbbf24" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="wind" stroke="#3b82f6" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="hydro" stroke="#06b6d4" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all animate-fade-in-up group"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-lg font-light mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Power Mix
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-light mb-6 flex items-center gap-2 animate-fade-in-up">
            <Zap className="w-6 h-6 text-primary" /> Energy Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSources.map((source, i) => (
              <Link
                key={source.id}
                href={`/dashboard/source/${source.id}`}
                onClick={() => setSelectedSource(source.id)}
                className={`p-6 bg-card border rounded-xl cursor-pointer transition-all hover:scale-105 hover:shadow-lg animate-fade-in-up group ${
                  selectedSource === source.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-transparent to-primary/10 group-hover:scale-110 transition-transform">
                    <source.icon className="w-6 h-6" style={{ color: source.color }} />
                  </div>
                  <div className="text-xs font-light text-primary bg-primary/10 px-2 py-1 rounded">{source.type}</div>
                </div>
                <h3 className="font-light text-lg mb-1">{source.name}</h3>
                <p className="text-muted-foreground text-sm font-light mb-4">{source.power} output</p>
                <div className="flex items-center justify-between">
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mr-3">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent animate-pulse-glow"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-light text-primary whitespace-nowrap flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" /> {source.trend}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {filteredSources.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-light animate-fade-in-up">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No energy sources found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
