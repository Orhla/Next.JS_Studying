"use client"

import DayCard from "./DayCard/DayCard"
import {Day} from "@/app/actions/types";

type Props = {
    forecast: Day[],
}

export default function WeekForecast({forecast}: Props) {
    return (
        <div className="flex flex-col gap-4 justify-center-safe h-screen w-200 mx-auto">
          {forecast.map((day, index) => (
            <DayCard key={index} day={day}/>
          ))}
        </div>
    )
}
