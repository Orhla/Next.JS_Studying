"use client"

import WeatherStats from "./WeatherStats";
import {Day} from "@/app/actions/types";
import { useState } from "react";
import { unitSystem } from "@/lib/types";
import { weatherCodes, weatherCodesDescription } from "@/lib/weatherCodes";

type Props = {
    day: Day
}

export default function DayDetail({day}: Props) {
    const [system, setSystem] = useState<unitSystem>(unitSystem.EU)
    const toggleUnit = () => setSystem(system === unitSystem.EU ? unitSystem.US : unitSystem.EU);

    const isValidCode = day.description in weatherCodes;
    const safeWeatherCode = isValidCode ? (day.description as string as weatherCodesDescription) : "0";

    return (<div className="flex justify-center">
                <WeatherStats
                    date={day.date}
                    tempMinCelsius={day.tempMin}
                    tempMaxCelsius={day.tempMax}
                    description={safeWeatherCode}
                    humidity={day.humidity}
                    wind={day.wind}
                    system={system}/>
                <button className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={toggleUnit}>{system === unitSystem.EU ? "EU" : "US"}</button>
            </div>
            );
}
