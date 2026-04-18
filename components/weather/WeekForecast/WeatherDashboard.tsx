"use client"

import DayCard from "./DayCard/DayCard"
import {Day} from "@/app/actions/types";

type Props = {
    forecast: Day[],
    unit: "C" | "F",
    onToggle: () => void
}

export default function WeatherDashboard({forecast, unit, onToggle}: Props) { 

  return (
          <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-150 mx-auto">
              {forecast.map((day, index) => (
                <DayCard key={index}
                         day={day}
                         unit={unit} />
              ))}
            </div>
            <button className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => onToggle()}>°C / °F</button>
          </div>
  )
}
