"use client"

// import { useState } from "react"
import { celsToFahr } from "@/lib/weather"

type Props = {
    avgTemp: number,
    unit: "C" | "F",
    onToggle: () => void
}

export default function AverageTemperature({avgTemp, unit, onToggle}: Props) {

    return (<div className="text-center">
                <div>
                    Средняя температура: {unit === "C" ? `${avgTemp} °C` : `${celsToFahr(avgTemp)} °F`}
                </div>
                <button  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                         onClick={() => onToggle()}>°C / °F</button>
            </div>
    )
}
