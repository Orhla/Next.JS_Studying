"use client"

import { Day } from "@/lib/weather"
import DayCard from "./DayCard/DayCard"

type Props = {
    forecast: Day[],
    todayDate: string
}

export default function WeekForecast({forecast, todayDate}: Props) {
    return (
        <div className="flex flex-col gap-4 justify-center-safe h-screen w-200 mx-auto">
          {forecast.map((day, index) => (
            <DayCard key={index}
                     day={day}
                     todayDate={todayDate} />
          ))}
        </div>
    )
}