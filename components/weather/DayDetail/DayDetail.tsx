"use client"

import WeatherStats from "./WeatherStats"
import {Day} from "@/app/actions/types";

type Props = {
    day: Day,
    unit: "C" | "F",
    onToggle: () => void
}

export default function DayDetail({day, unit, onToggle}: Props) {

    return (<div className="flex justify-center">
                <WeatherStats
                    date={day.date}
                    tempMin={day.tempMin}
                    tempMax={day.tempMax}
                    description={day.description}
                    humidity={day.humidity}
                    wind={day.wind}
                    unit={unit}/>
                <button className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => onToggle()}>°C / °F</button>
            </div>
            );
}
