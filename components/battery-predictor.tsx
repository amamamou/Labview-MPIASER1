/**
 * Battery Predictor Component
 * Displays real-time battery SOC prediction from ML model
 */

"use client"

import { useEffect, useState } from "react"
import { Zap, AlertCircle, TrendingUp, RefreshCw } from "lucide-react"
import { getPrediction } from "@/lib/api-client"

interface BatteryPredictorProps {
  solarPower: number
  loadPower: number
  irradiance: number
  currentTime?: string  // Current data point timestamp
  remainingTime?: string  // Estimated time until battery depletes
  onPredictionUpdate?: (soc: number) => void
}

export function BatteryPredictor({
  solarPower,
  loadPower,
  irradiance,
  currentTime,
  remainingTime,
  onPredictionUpdate,
}: BatteryPredictorProps) {
  const [predictedSOC, setPredictedSOC] = useState(75)
  const [loading, setLoading] = useState(false)
  const [modelUsed, setModelUsed] = useState("--")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getPrediction({
          time_h: new Date().toISOString(),
          irradiance_Wm2: irradiance,
          solar_power_W: solarPower,
          load_power_W: loadPower,
        })

        setPredictedSOC(Math.round(response.prediction.battery_soc_pct))
        setModelUsed(response.model_used)
        setLastUpdate(new Date())

        if (onPredictionUpdate) {
          onPredictionUpdate(response.prediction.battery_soc_pct)
        }
      } catch (err) {
        setError("Failed to fetch prediction")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    // Fetch prediction every 30 seconds
    fetchPrediction()
    const interval = setInterval(fetchPrediction, 30000)

    return () => clearInterval(interval)
  }, [solarPower, loadPower, irradiance, onPredictionUpdate])

  const getSOCColor = () => {
    if (predictedSOC < 20) return "from-red-500 to-red-600"
    if (predictedSOC < 40) return "from-orange-500 to-orange-600"
    if (predictedSOC < 60) return "from-yellow-500 to-yellow-600"
    if (predictedSOC < 80) return "from-lime-500 to-lime-600"
    return "from-green-500 to-green-600"
  }

  const getSOCStatus = () => {
    if (predictedSOC < 20) return "Critical"
    if (predictedSOC < 40) return "Low"
    if (predictedSOC < 60) return "Medium"
    if (predictedSOC < 80) return "High"
    return "Full"
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all animate-fade-in-up">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-light">Battery SOC Prediction</h3>
        </div>
        <button
          onClick={() => {
            setLoading(true)
            // Trigger refetch by updating loading state
          }}
          className="p-2 hover:bg-muted rounded-lg transition-all disabled:opacity-50"
          disabled={loading}
          title="Refresh prediction"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 font-light">{error}</p>
        </div>
      )}

      {/* Main SOC Display */}
      <div className="mb-6">
        <div className="flex items-end gap-2 mb-2">
          <div className="text-5xl font-light text-foreground">{predictedSOC}%</div>
          <div className="mb-1">
            <div
              className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${getSOCColor()} text-white`}
            >
              {getSOCStatus()}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-light">Predicted State of Charge</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getSOCColor()} transition-all duration-500`}
            style={{ width: `${predictedSOC}%` }}
          ></div>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground font-light mb-1">Solar Power</p>
          <p className="text-sm font-medium text-foreground">{Number(solarPower || 0).toFixed(0)} W</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-light mb-1">Load Power</p>
          <p className="text-sm font-medium text-foreground">{Number(loadPower || 0).toFixed(0)} W</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-light mb-1">Irradiance</p>
          <p className="text-sm font-medium text-foreground">{Number(irradiance || 0).toFixed(0)} W/m²</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-light mb-1">Model</p>
          <p className="text-sm font-medium text-foreground font-mono">{modelUsed}</p>
        </div>
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className="text-xs text-muted-foreground font-light text-center pt-3 border-t border-border">
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
