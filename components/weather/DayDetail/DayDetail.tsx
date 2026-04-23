"use client"

import WeatherStats from "./WeatherStats"
import {Day} from "@/app/actions/types";
import { useState } from "react";
import { temperatureUnit } from "@/lib/types";

type Props = {
    day: Day
}

export default function DayDetail({day}: Props) {
    const [unit, setUnit] = useState<temperatureUnit>(temperatureUnit.C);
    const toggleUnit = () => setUnit(unit === temperatureUnit.C ? temperatureUnit.F : temperatureUnit.C);

    return (<div className="flex justify-center">
                <WeatherStats
                    date={day.date}
                    tempMinCelsius={day.tempMin}
                    tempMaxCelsius={day.tempMax}
                    description={day.description}
                    humidity={day.humidity}
                    wind={day.wind}
                    unit={unit}/>
                <button className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={toggleUnit}>°C / °F</button>
            </div>
            );
}
