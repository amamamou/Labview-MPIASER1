/**
 * API Client for Flask ML Backend
 * Handles prediction requests and data communication
 */

interface EnergyData {
  time_h?: string
  irradiance_Wm2?: number
  solar_power_W?: number
  load_power_W?: number
  // Alternative field names that some APIs might use
  time?: string
  irradiance?: number
  solar_power?: number
  load_power?: number
  soc?: number
}

interface PredictionResponse {
  model_used: string
  prediction: {
    battery_soc_pct: number
  }
  timestamp?: string
}

interface RecommendationInput {
  soc: number
  irradiance: number
  solar_power: number
  load_power: number
  previous_trend?: 'increasing' | 'decreasing' | 'stable'
}

/**
 * Call the Flask API to get battery SOC prediction
 * Supports multiple API formats
 */
export async function getPrediction(data: EnergyData): Promise<PredictionResponse> {
  try {
    console.log('Sending to Flask API:', JSON.stringify(data))

    const payload = {
      time_h: data.time_h || data.time || new Date().toISOString(),
      irradiance_Wm2: data.irradiance_Wm2 || data.irradiance || 0,
      solar_power_W: data.solar_power_W || data.solar_power || 0,
      load_power_W: data.load_power_W || data.load_power || 0,
    }

    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Flask API Error ${response.status}:`, errorText)
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Flask API Response:', result)
    return {
      ...result,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Prediction API Error:', error)
    throw new Error('Failed to fetch prediction from the backend.')
  }
}

/**
 * Generate intelligent recommendations based on system state
 */
export function generateRecommendations(input: RecommendationInput, language: 'en' | 'fr' = 'en'): string[] {
  const recommendations: string[] = []
  const { soc, irradiance, solar_power, load_power, previous_trend } = input

  // French recommendations
  if (language === 'fr') {
    // Battery level recommendations
    if (soc < 20) {
      recommendations.push('🔴 ALERTE: Niveau de batterie critique. Réduisez immédiatement la charge non essentielle.')
      recommendations.push('⚡ Recommandation: Priorité aux charges essentielles uniquement.')
    } else if (soc < 40) {
      recommendations.push('🟠 ATTENTION: Batterie faible. Envisagez de réduire la consommation ou d\'ajouter une source d\'énergie.')
    } else if (soc > 95) {
      recommendations.push('🟢 Batterie pleine. Envisagez d\'augmenter la charge ou de stocker l\'énergie excédentaire.')
    }

    // Irradiance recommendations
    if (irradiance > 800) {
      recommendations.push('☀️ Production solaire élevée détectée - conditions optimales. Utilisez les appareils gourmands maintenant.')
    } else if (irradiance < 200) {
      recommendations.push('☁️ Faible irradiance. La recharge solaire sera limitée. Préparez-vous à consommer depuis la batterie.')
    }

    // Load balance recommendations
    if (load_power > solar_power && soc < 60) {
      recommendations.push('⚠️ Charge élevée par rapport à la production solaire - décharge rapide possible.')
      recommendations.push('💡 Conseil: Reportez les tâches non urgentes à un moment où la production solaire est plus élevée.')
    } else if (solar_power > load_power * 1.5 && soc < 80) {
      recommendations.push('✅ Surplus d\'énergie solaire. C\'est le moment idéal pour recharger complètement la batterie.')
    }

    // Trend-based recommendations
    if (previous_trend === 'decreasing' && soc < 50) {
      recommendations.push('📉 Tendance de décharge détectée. Préparez les solutions de secours.')
    }
  } else {
    // English recommendations
    if (soc < 20) {
      recommendations.push('🔴 CRITICAL ALERT: Battery level critically low. Immediately reduce non-essential loads.')
      recommendations.push('⚡ Recommendation: Essential loads only.')
    } else if (soc < 40) {
      recommendations.push('🟠 WARNING: Battery low. Consider reducing consumption or adding power source.')
    } else if (soc > 95) {
      recommendations.push('🟢 Battery full. Consider increasing load or storing excess energy.')
    }

    if (irradiance > 800) {
      recommendations.push('☀️ High solar production detected - optimal conditions. Use power-hungry appliances now.')
    } else if (irradiance < 200) {
      recommendations.push('☁️ Low irradiance. Solar recharge will be limited. Prepare for battery consumption.')
    }

    if (load_power > solar_power && soc < 60) {
      recommendations.push('⚠️ High load vs solar production - rapid discharge possible.')
      recommendations.push('💡 Tip: Defer non-urgent tasks to peak solar production times.')
    } else if (solar_power > load_power * 1.5 && soc < 80) {
      recommendations.push('✅ Solar surplus detected. Perfect time to fully charge the battery.')
    }

    if (previous_trend === 'decreasing' && soc < 50) {
      recommendations.push('📉 Discharge trend detected. Prepare backup solutions.')
    }
  }

  return recommendations.length > 0
    ? recommendations
    : language === 'fr'
      ? ['✅ Système en bon fonctionnement. Aucune action requise.']
      : ['✅ System operating normally. No action required.']
}

/**
 * Parse CSV data and extract energy parameters
 */
export function parseCSVData(csvText: string): EnergyData[] {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim())
    const record = Object.fromEntries(headers.map((h, i) => [h, values[i]]))

    return {
      time_h: record['time'] || record['timestamp'] || new Date().toISOString(),
      irradiance_Wm2: parseFloat(record['irradiance'] || record['irradiance_wm2'] || '0'),
      solar_power_W: parseFloat(record['solar_power'] || record['solar_power_w'] || '0'),
      load_power_W: parseFloat(record['load_power'] || record['load_power_w'] || '0'),
    }
  })
}

/**
 * Calculate efficiency metrics
 */
export function calculateMetrics(soc: number, solar_power: number, load_power: number) {
  const efficiency = solar_power > 0 ? ((solar_power - load_power) / solar_power) * 100 : 0
  const chargeRate = (solar_power / 100) * (100 - soc)
  const dischargeRate = (load_power / 100) * soc

  return {
    efficiency: Math.max(0, Math.min(100, efficiency)),
    chargeRate,
    dischargeRate,
    netPower: solar_power - load_power,
  }
}
