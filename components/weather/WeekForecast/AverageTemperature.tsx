"use client"

import { celsToFahr } from "@/lib/weather"
import { unitSystem } from "@/lib/types"

type Props = {
    avgTemp: number,
    unit: unitSystem,
    onToggle: () => void
}

export default function AverageTemperature({avgTemp, unit, onToggle}: Props) {
    return (<div className="text-center">
                <div>
                    Средняя температура: {unit === unitSystem.EU ? `${avgTemp} °C` : `${celsToFahr(avgTemp)} °F`}
                </div>
                <button  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                         onClick={onToggle}>{unit === unitSystem.EU ? "EU" : "US"}</button>
            </div>
    )
}
