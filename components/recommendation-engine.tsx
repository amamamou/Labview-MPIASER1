/**
 * Recommendation Engine Component
 * Displays intelligent energy recommendations
 */

"use client"

import { useEffect, useState } from "react"
import { Lightbulb, AlertCircle, CheckCircle2, TrendingDown } from "lucide-react"
import { generateRecommendations, calculateMetrics } from "@/lib/api-client"

interface RecommendationEngineProps {
  soc: number
  irradiance: number
  solarPower: number
  loadPower: number
  language?: "en" | "fr"
  previousSOC?: number
}

export function RecommendationEngine({
  soc,
  irradiance,
  solarPower,
  loadPower,
  language = "en",
  previousSOC,
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [metrics, setMetrics] = useState({
    efficiency: 0,
    chargeRate: 0,
    dischargeRate: 0,
    netPower: 0,
  })

  useEffect(() => {
    // Determine trend
    let trend: "increasing" | "decreasing" | "stable" = "stable"
    if (previousSOC !== undefined) {
      if (soc > previousSOC + 2) trend = "increasing"
      else if (soc < previousSOC - 2) trend = "decreasing"
    }

    // Generate recommendations
    const recs = generateRecommendations(
      {
        soc,
        irradiance,
        solar_power: solarPower,
        load_power: loadPower,
        previous_trend: trend,
      },
      language
    )

    setRecommendations(recs)

    // Calculate metrics
    const calcs = calculateMetrics(soc, solarPower, loadPower)
    setMetrics(calcs)
  }, [soc, irradiance, solarPower, loadPower, language, previousSOC])

  const getRecommendationIcon = (rec: string) => {
    if (rec.includes("🔴") || rec.includes("CRITICAL") || rec.includes("ALERTE"))
      return <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
    if (rec.includes("🟠") || rec.includes("WARNING") || rec.includes("ATTENTION"))
      return <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
    if (rec.includes("🟢") || rec.includes("✅"))
      return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
    if (rec.includes("📉")) return <TrendingDown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
    return <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-light">
          {language === "fr" ? "Recommandations Énergétiques" : "Energy Recommendations"}
        </h3>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-4 gap-2 mb-6 p-4 bg-muted rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground font-light mb-1">Efficiency</p>
          <p className="text-sm font-medium text-foreground">{Number(metrics.efficiency || 0).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-light mb-1">Net Power</p>
          <p className={`text-sm font-medium ${Number(metrics.netPower || 0) >= 0 ? "text-green-500" : "text-orange-500"}`}>
            {Number(metrics.netPower || 0).toFixed(0)} W
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-light mb-1">Charge Rate</p>
          <p className="text-sm font-medium text-foreground">{Number(metrics.chargeRate || 0).toFixed(1)} W</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-light mb-1">Discharge Rate</p>
          <p className="text-sm font-medium text-foreground">{Number(metrics.dischargeRate || 0).toFixed(1)} W</p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            {getRecommendationIcon(rec)}
            <p className="text-sm font-light text-foreground leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              soc > 40 && metrics.efficiency > 70
                ? "bg-green-500"
                : soc > 20 && metrics.efficiency > 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          ></div>
          <p className="text-xs text-muted-foreground font-light">
            {language === "fr" ? "Système" : "System"} {soc > 40 ? (language === "fr" ? "Nominal" : "Nominal") : language === "fr" ? "À surveiller" : "Needs Attention"}
          </p>
        </div>
      </div>
    </div>
  )
}
