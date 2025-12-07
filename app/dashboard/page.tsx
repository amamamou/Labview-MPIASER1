"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
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
  X,
} from "lucide-react"
import Link from "next/link"
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
import { Line as ChartJSLine } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend,
} from "chart.js"
import * as XLSX from "xlsx"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartJSTooltip, Legend)

// ----------------- STATIC DATA / TYPES -----------------
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

// default static chart data (used when no file is parsed)
const defaultChartData = [
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

interface BatteryApiResponse {
  model_used: string
  input: {
    time_h: string
    irradiance_Wm2: number
    solar_power_W: number
    load_power_W: number
  }
  prediction: {
    battery_soc_pct: number
  }
}

interface BatteryCsvResponse extends BatteryApiResponse {
  source?: string
  row_index?: number
}

// chart point type from CSV / Excel (one-day series)
interface ChartPoint {
  time: string
  solar: number
  load: number
  soc: number
}

// KPIs derived from the time series
interface KpiState {
  totalPowerKw: number
  todaysOutputKWh: number
  efficiencyPct: number
  carbonSavedTons: number
}

// ----------------- HELPERS -----------------
function getBatteryAdvice(soc: number) {
  if (soc < 5) {
    return {
      title: "Critique",
      description: "Batterie presque vide. Réduisez immédiatement la charge et basculez sur le réseau ou groupe.",
      pillClass: "bg-red-500/10 text-red-500 border-red-500/40",
    }
  } else if (soc < 20) {
    return {
      title: "Faible",
      description: "Surveillez la consommation. Évitez les charges non essentielles et préparez une source de secours.",
      pillClass: "bg-orange-500/10 text-orange-500 border-orange-500/40",
    }
  } else if (soc < 60) {
    return {
      title: "Normal",
      description: "Fonctionnement nominal. Vous pouvez maintenir la charge actuelle, mais surveillez la météo solaire.",
      pillClass: "bg-yellow-500/10 text-yellow-500 border-yellow-500/40",
    }
  } else if (soc < 90) {
    return {
      title: "Bon",
      description: "Niveau confortable. Possibilité d’augmenter légèrement la charge si nécessaire.",
      pillClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/40",
    }
  } else {
    return {
      title: "Plein",
      description: "Batterie presque pleine. Vous pouvez planifier des charges intensives ou stocker l’excès d’énergie.",
      pillClass: "bg-green-500/10 text-green-500 border-green-500/40",
    }
  }
}

/**
 * Compute KPIs from one-day time series:
 * points.solar -> solar_power_W
 * points.load  -> load_power_W
 * points.soc   -> battery_soc_pct
 */
function computeKpisFromPoints(points: ChartPoint[]): KpiState | null {
  if (!points.length) return null

  const solarValues = points.map((p) => p.solar)
  const loadValues = points.map((p) => p.load)

  const solarSumW = solarValues.reduce((acc, v) => acc + (isNaN(v) ? 0 : v), 0)
  const loadSumW = loadValues.reduce((acc, v) => acc + (isNaN(v) ? 0 : v), 0)
  const maxSolarW = Math.max(...solarValues, 0)

  // Assuming approximate 1 sample per hour → kWh ≈ sum(W) / 1000
  const todaysOutputKWh = solarSumW / 1000
  const totalPowerKw = maxSolarW / 1000

  const efficiencyPct =
    solarSumW > 0 ? Math.max(0, Math.min(100, (loadSumW / solarSumW) * 100)) : 0

  // simple carbon factor: 0.0007 tons CO₂ / kWh (adjust as you like)
  const carbonSavedTons = todaysOutputKWh * 0.0007

  return {
    totalPowerKw,
    todaysOutputKWh,
    efficiencyPct,
    carbonSavedTons,
  }
}

// parse CSV text into chart points using backend-like columns
// expects header containing at least: time_h, solar_power_W, load_power_W, battery_soc_pct
function parseCsvForChart(csvText: string): ChartPoint[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length < 2) {
    console.warn("[24h Chart] CSV has no data rows.")
    return []
  }

  const headerRaw = lines[0]
  const headerCols = headerRaw.split(/[;,]/).map((c) => c.trim())
  const headerLower = headerCols.map((c) => c.toLowerCase())

  const timeIdx = headerLower.indexOf("time_h")
  const solarIdx = headerLower.indexOf("solar_power_w")
  const loadIdx = headerLower.indexOf("load_power_w")
  const socIdx = headerLower.indexOf("battery_soc_pct")

  if (timeIdx === -1 || solarIdx === -1) {
    console.warn(
      "[24h Chart] Missing 'time_h' or 'solar_power_W' in CSV header:",
      headerCols,
    )
    return []
  }

  const points: ChartPoint[] = []

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i]
    if (!row) continue

    const cols = row.split(/[;,]/)
    if (cols.length < headerCols.length) continue

    const timeRaw = cols[timeIdx]?.trim()
    const solarRaw = cols[solarIdx]?.trim()
    const loadRaw = loadIdx !== -1 ? cols[loadIdx]?.trim() : "0"
    const socRaw = socIdx !== -1 ? cols[socIdx]?.trim() : "0"

    if (!timeRaw) continue

    const solar = parseFloat(solarRaw || "0")
    const load = parseFloat(loadRaw || "0")
    const soc = parseFloat(socRaw || "0")

    // extract HH:MM if possible
    let timeLabel = timeRaw
    const match = timeRaw.match(/\d{2}:\d{2}/)
    if (match) {
      timeLabel = match[0]
    }

    points.push({
      time: timeLabel,
      solar: isNaN(solar) ? 0 : solar,
      load: isNaN(load) ? 0 : load,
      soc: isNaN(soc) ? 0 : soc,
    })
  }

  console.log("[24h Chart] Parsed points from CSV/Excel:", points)
  return points
}

// ----------------- COMPONENT -----------------
export default function Dashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  const [solarProduction, setSolarProduction] = useState(0) // 0–100
  const [batteryLevel, setBatteryLevel] = useState(0) // 0–100 (%)
  const [valveState, setValveState] = useState(false)

  // CSV upload & prediction
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPrediction, setCsvPrediction] = useState<BatteryCsvResponse | null>(null)
  const [csvLoading, setCsvLoading] = useState(false)
  const [csvError, setCsvError] = useState<string | null>(null)

  // fake progress
  const [uploadProgress, setUploadProgress] = useState(0)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [showCsvModal, setShowCsvModal] = useState(false)

  // 24h chart series / source
  const [chartSeries, setChartSeries] = useState<any[]>(defaultChartData)
  const [chartSource, setChartSource] = useState<"static" | "csv">("static")

  // KPIs (dynamic once file is parsed)
  const [kpis, setKpis] = useState<KpiState>({
    totalPowerKw: 9728,
    todaysOutputKWh: 156432,
    efficiencyPct: 94.2,
    carbonSavedTons: 2.4,
  })

  // auth
  useEffect(() => {
    const authData = localStorage.getItem("user_profile")
    if (!authData) {
      router.push("/auth/signin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  // log when chart source changes
  useEffect(() => {
    if (chartSource === "csv") {
      console.log("[24h Chart] Using data from uploaded file (CSV/Excel).")
    } else {
      console.log("[24h Chart] Using static demo data (no parsed file).")
    }
  }, [chartSource])

  // sync battery & slider with last prediction
  useEffect(() => {
    if (csvPrediction) {
      const soc = Math.max(0, Math.min(100, csvPrediction.prediction.battery_soc_pct))
      setBatteryLevel(soc)

      const sliderValue = Math.max(
        0,
        Math.min(100, csvPrediction.input.solar_power_W / 40),
      )
      setSolarProduction(sliderValue)
    }
  }, [csvPrediction])

  // cleanup progress timer on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
    }
  }, [])

  const handleSolarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSolarProduction(Number(event.target.value))
  }

  const toggleValve = () => {
    setValveState((prev) => !prev)
  }

  const filteredSources = energySources.filter(
    (source) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setCsvFile(file)
    setCsvPrediction(null)
    setCsvError(null)
    setUploadProgress(0)
  }

  // delete file + reset
  const handleClearFile = () => {
    setCsvFile(null)
    setCsvPrediction(null)
    setCsvError(null)
    setUploadProgress(0)
    setShowCsvModal(false)
    setChartSeries(defaultChartData)
    setChartSource("static")
    setKpis({
      totalPowerKw: 9728,
      todaysOutputKWh: 156432,
      efficiencyPct: 94.2,
      carbonSavedTons: 2.4,
    })

    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    console.log("[24h Chart] Reset to static demo data after file deletion.")
  }

  // fake progress
  const startFakeProgress = () => {
    setUploadProgress(0)
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
    }
    const id = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(id)
          return 90
        }
        return prev + 5
      })
    }, 150)
    progressTimerRef.current = id
  }

  const stopFakeProgress = (success: boolean) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
    }
    progressTimerRef.current = null
    setUploadProgress(success ? 100 : uploadProgress)
  }

  // upload CSV/Excel to backend + parse same file on frontend for chart & KPIs
  const uploadCsvAndPredict = async () => {
    if (!csvFile) {
      setCsvError("Please select a CSV or Excel file first.")
      return
    }

    try {
      setCsvLoading(true)
      setCsvError(null)
      startFakeProgress()

      const fileName = csvFile.name.toLowerCase()
      let points: ChartPoint[] = []

      // --- FRONTEND PARSING FOR 24H CHART & KPIs ---
      if (fileName.endsWith(".csv")) {
        const text = await csvFile.text()
        points = parseCsvForChart(text)
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        try {
          const buffer = await csvFile.arrayBuffer()
          const workbook = XLSX.read(buffer, { type: "array" })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const csvText = XLSX.utils.sheet_to_csv(worksheet)
          points = parseCsvForChart(csvText)
        } catch (e) {
          console.error("[24h Chart] Error parsing Excel file on frontend:", e)
        }
      }

      if (points && points.length > 0) {
        const rechartsData = points.map((p) => ({
          time: p.time,
          solar: p.solar,
          wind: p.load,
          hydro: p.soc,
        }))
        setChartSeries(rechartsData)
        setChartSource("csv")
        console.log("[24h Chart] Using parsed file data for 24h chart.", rechartsData)

        const k = computeKpisFromPoints(points)
        if (k) {
          setKpis(k)
          console.log("[KPI] Computed from CSV/Excel:", k)
        }
      } else {
        console.log("[24h Chart] No points parsed, keeping static chart & KPIs.")
      }

      // --- BACKEND CALL /predict_csv FOR LAST LINE PREDICTION ---
      const formData = new FormData()
      formData.append("file", csvFile)

      const res = await fetch("http://localhost:5000/predict_csv", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      console.log("Raw /predict_csv response:", data)

      if (!res.ok) {
        setCsvError(data?.error || "Prediction error")
        stopFakeProgress(false)
        return
      }

      setCsvPrediction(data as BatteryCsvResponse)
      stopFakeProgress(true)
      setShowCsvModal(true)
    } catch (err: any) {
      console.error(err)
      setCsvError(err?.message || "Network error")
      stopFakeProgress(false)
    } finally {
      setCsvLoading(false)
    }
  }

  if (!isAuthenticated) return null

  const socValue = csvPrediction ? csvPrediction.prediction.battery_soc_pct : batteryLevel
  const advice = getBatteryAdvice(socValue)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-light mb-3 text-foreground">Energy Dashboard</h1>
        <p className="text-lg font-light text-muted-foreground">
          Real-time monitoring of your renewable energy operations
        </p>
      </div>

      {/* Search / actions */}
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

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          {
            label: "Total Power",
            value: `${kpis.totalPowerKw.toFixed(1)} kW`,
            change: "+9%",
            icon: Zap,
            color: "from-primary",
          },
          {
            label: "Today's Output",
            value: `${kpis.todaysOutputKWh.toFixed(0)} kWh`,
            change: "+12%",
            icon: TrendingUp,
            color: "from-accent",
          },
          {
            label: "Efficiency",
            value: `${kpis.efficiencyPct.toFixed(1)}%`,
            change: "+2%",
            icon: Activity,
            color: "from-blue-500",
          },
          {
            label: "Carbon Saved",
            value: `${kpis.carbonSavedTons.toFixed(2)} Tons`,
            change: "+5%",
            icon: Leaf,
            color: "from-green-500",
          },
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
              <span className="text-xs font-light text-primary bg-primary/10 px-2 py-1 rounded">
                {kpi.change}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-light mb-1">{kpi.label}</p>
            <p className="text-2xl font-light text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* 24h chart + pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div
          className="lg:col-span-2 p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all animate-fade-in-up group"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-light flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> 24-Hour Output
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {chartSource === "csv" ? "Data: last uploaded file" : "Data: static demo"}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartSeries}>
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

      {/* Simulation Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-light mb-6 flex items-center gap-2 animate-fade-in-up">
          <Zap className="w-6 h-6 text-primary" /> Simulation du Système
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Solar production slider */}
          <div className="p-6 bg-card border border-border rounded-xl animate-fade-in-up">
            <label className="text-sm font-light text-muted-foreground mb-2 block">Production Solaire</label>
            <input
              type="range"
              min="0"
              max="100"
              value={solarProduction}
              onChange={handleSolarChange}
              className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs font-light text-muted-foreground mt-1">
              <span>0</span>
              <span>100</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Valeur actuelle :{" "}
              <span className="font-medium">{solarProduction.toFixed(1)}</span>
              {csvPrediction && (
                <>
                  {" "}
                  – <span className="font-medium">{csvPrediction.input.solar_power_W.toFixed(1)} W</span>
                </>
              )}
            </p>
          </div>

          {/* Battery level + recommendation */}
          <div className="p-6 bg-card border border-border rounded-xl animate-fade-in-up">
            <label className="text-sm font-light text-muted-foreground mb-2 block">Niveau de Batterie (SOC)</label>

            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              {/* SOC bar */}
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${batteryLevel}%`, transition: "width 0.5s ease-in-out" }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-light text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <p className="mt-2 text-sm">
                  SOC de la batterie :{" "}
                  <span className="font-medium">
                    {csvPrediction ? `${csvPrediction.prediction.battery_soc_pct.toFixed(2)}%` : "– (upload a file)"}
                  </span>
                </p>
              </div>

              {/* Advice */}
              <div
                className={`md:w-1/2 lg:w-1/2 border rounded-lg p-3 text-xs flex flex-col gap-1 ${advice.pillClass}`}
              >
                <span className="font-semibold text-[0.8rem] tracking-wide uppercase">
                  {advice.title}
                </span>
                <p className="leading-snug">
                  {advice.description}
                </p>
              </div>
            </div>

            {csvError && <p className="mt-2 text-xs text-red-500">{csvError}</p>}
          </div>

          {/* Valve */}
          <div className="p-6 bg-card border border-border rounded-xl flex flex-col gap-3 animate-fade-in-up">
            <label className="text-sm font-light text-muted-foreground mb-2 block">Valve Électrique</label>
            <button
              onClick={toggleValve}
              className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                valveState ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {valveState ? "ON" : "OFF"}
            </button>
            <p className="text-xs text-muted-foreground">
              Le niveau de batterie et la production solaire sont synchronisés avec la dernière prédiction.
            </p>
          </div>
        </div>
      </div>

      {/* CSV / Excel upload section */}
      <div className="mb-12">
        <h2 className="text-2xl font-light mb-6 flex items-center gap-2 animate-fade-in-up">
          <Zap className="w-6 h-6 text-primary" /> Predict
        </h2>

        <div className="p-6 bg-card border border-border rounded-xl space-y-4 animate-fade-in-up">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={uploadCsvAndPredict}
              disabled={csvLoading || !csvFile}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-60 hover:bg-primary/90 transition-all"
            >
              {csvLoading ? "Predicting from file..." : "Upload & Predict SOC"}
            </button>

            <button
              onClick={handleClearFile}
              disabled={!csvFile && uploadProgress === 0 && !csvPrediction && !csvError}
              className="px-4 py-2 rounded-lg border border-red-500 bg-red-500 text-white text-sm hover:bg-red-600 hover:border-red-600 disabled:opacity-40 transition-all"
            >
              Delete file / Reset
            </button>
          </div>

          {(csvLoading || uploadProgress > 0) && (
            <div className="space-y-1">
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Progress: {Math.round(uploadProgress)}%</p>
            </div>
          )}

          {csvError && <p className="text-sm text-red-500">{csvError}</p>}
        </div>
      </div>

      {/* Modal for CSV prediction */}
      {showCsvModal && csvPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowCsvModal(false)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-light mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Batterie – Prédiction
            </h3>

            <div className="space-y-2 text-sm">
              <p>
                SOC prédit :{" "}
                <span className="font-medium">
                  {csvPrediction.prediction.battery_soc_pct.toFixed(2)}%
                </span>
              </p>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>time_h : {csvPrediction.input.time_h}</p>
                <p>irradiance_Wm2 : {csvPrediction.input.irradiance_Wm2}</p>
                <p>solar_power_W : {csvPrediction.input.solar_power_W}</p>
                <p>load_power_W : {csvPrediction.input.load_power_W}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleClearFile}
                className="px-4 py-2 rounded-lg border border-red-500 bg-red-500 text-white text-sm hover:bg-red-600 hover:border-red-600 transition-colors"
              >
                Delete file
              </button>

              <button
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
