/**
 * Battery Gauge Component
 * Circular battery level indicator
 */

"use client"

import { useEffect, useRef } from "react"

interface BatteryGaugeProps {
  percentage: number
  size?: number
  label?: string
}

export function BatteryGauge({ percentage, size = 200, label = "Battery Level" }: BatteryGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = (canvas.width - 40) / 2

    // Clear canvas
    ctx.fillStyle = "transparent"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "var(--color-border)"
    ctx.lineWidth = 4
    ctx.stroke()

    // Determine color based on percentage
    let color = "#ef4444" // Red
    if (percentage >= 20 && percentage < 40) color = "#f97316" // Orange
    else if (percentage >= 40 && percentage < 60) color = "#eab308" // Yellow
    else if (percentage >= 60 && percentage < 80) color = "#84cc16" // Lime
    else if (percentage >= 80) color = "#10b981" // Green

    // Draw percentage arc
    const startAngle = -Math.PI / 2
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = color
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw percentage text
    ctx.font = `bold ${Math.floor(radius / 2)}px system-ui`
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY - 10)

    // Draw label text
    ctx.font = `12px system-ui`
    ctx.fillStyle = "var(--color-muted-foreground)"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(label, centerX, centerY + 20)
  }, [percentage, label])

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="drop-shadow-lg"
      />
    </div>
  )
}
