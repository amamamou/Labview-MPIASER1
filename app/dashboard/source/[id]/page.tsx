"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, BarChart3, Download, TrendingUp } from "lucide-react"

interface ChartData {
  time: string
  power: number
}

export default function SourceDetail() {
  const params = useParams()
  const router = useRouter()
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    // Generate mock chart data
    const data = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      power: Math.floor(Math.random() * 400) + 200,
    }))
    setChartData(data)
  }, [])

  const sourceNames: Record<string, { name: string; type: string; description: string }> = {
    "1": {
      name: "Solar Farm A",
      type: "Solar",
      description: "Large-scale photovoltaic installation in California",
    },
    "2": {
      name: "Wind Turbine A",
      type: "Wind",
      description: "Offshore wind turbine generating clean energy",
    },
    "3": {
      name: "Hydro Plant B",
      type: "Hydro",
      description: "Hydroelectric power plant on the Colorado River",
    },
    "4": {
      name: "Solar Farm C",
      type: "Solar",
      description: "Medium-scale solar installation with monitoring",
    },
  }

  const source = sourceNames[params.id as string]

  if (!source) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-24 text-center">
          <p className="text-muted-foreground">Source not found</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 animate-fade-in-up">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-normal text-muted-foreground hover:text-foreground mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl md:text-5xl font-light mb-2 text-foreground">{source.name}</h1>
            <p className="text-muted-foreground font-light">{source.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                label: "Current Output",
                value: "248 MW",
                icon: BarChart3,
              },
              {
                label: "Efficiency",
                value: "94%",
                icon: TrendingUp,
              },
              {
                label: "Daily Production",
                value: "5,952 MWh",
                icon: BarChart3,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 bg-card border border-border rounded-lg"
                style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-light text-muted-foreground">{stat.label}</p>
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-light text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Chart Visualization */}
          <div
            className="p-6 bg-card border border-border rounded-lg mb-8"
            style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-normal text-foreground">24-Hour Power Output</h2>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-normal bg-primary text-primary-foreground rounded hover:bg-primary/90 transition">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded border border-border flex items-end justify-around p-4 gap-1">
              {chartData.map((data, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-primary to-accent rounded-sm opacity-70 hover:opacity-100 transition"
                  style={{
                    height: `${(data.power / 600) * 100}%`,
                    animation: `fadeInUp 0.6s ease-out ${0.4 + i * 0.02}s both`,
                  }}
                  title={`${data.time}: ${data.power} MW`}
                ></div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div
            className="p-6 bg-card border border-border rounded-lg"
            style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}
          >
            <h2 className="text-lg font-normal text-foreground mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Type", value: source.type },
                { label: "Status", value: "Active" },
                { label: "Capacity", value: "500 MW" },
                { label: "Location", value: "California, USA" },
                { label: "Installation Date", value: "January 2022" },
                { label: "Total Generation", value: "2.1 GWh/year" },
              ].map((spec, i) => (
                <div key={i}>
                  <p className="text-xs font-light text-muted-foreground uppercase tracking-wide">{spec.label}</p>
                  <p className="text-lg font-normal text-foreground mt-1">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
