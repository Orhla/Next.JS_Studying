"use client"

import DayCard from "./DayCard/DayCard"
import {Day} from "@/app/actions/types";
import {useState} from "react";
import AverageTemperature from "@/components/weather/WeekForecast/AverageTemperature";


type Props = {
    forecast: Day[],
    avgTemp: number
    // unit: "C" | "F",
    // onToggle: () => void
}

export default function WeatherDashboard({forecast, avgTemp}: Props) {
    const [unit, setUnit] = useState<"C" | "F">("C");
    const toggleUnit = () => setUnit(unit === "C" ? "F" : "C");


    return (<>
            <AverageTemperature avgTemp={avgTemp}
                                unit={unit}
                                onToggle={toggleUnit} />

            <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-150 mx-auto">
              {forecast.map((day, index) => (
                <DayCard key={index}
                         day={day}
                         unit={unit} />
              ))}
            </div>
            <button className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={toggleUnit}>°C / °F</button>
          </div>
        </>
  )
}
