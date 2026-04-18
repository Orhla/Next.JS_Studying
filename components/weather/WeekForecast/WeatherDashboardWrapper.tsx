"use client"

import { useState } from "react"
import { Day } from "@/app/actions/types"
import DisplayAverageTemp from "./AverageTemperature"
import WeatherDashboard from "./WeatherDashboard"

type Props = {
    forecast: Day[],
    avgTemp: number
}

export default function WeatherDashboardWrapper({forecast, avgTemp}: Props) {
    const [unit, setUnit] = useState<"C" | "F">("C");
    const toggleUnit = () => setUnit(unit === "C" ? "F" : "C");

    return (
        <>
            <DisplayAverageTemp avgTemp={avgTemp}
                                unit={unit}
                                onToggle={toggleUnit} />
            <WeatherDashboard forecast={forecast}
                              unit={unit}
                              onToggle={toggleUnit} />
        </>
    )
}