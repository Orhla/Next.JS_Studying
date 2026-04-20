"use client"

import DayCard from "./DayCard/DayCard"
import {Day} from "@/app/actions/types";
import {useEffect, useState} from "react";
import AverageTemperature from "@/components/weather/WeekForecast/AverageTemperature";


type Props = {
    forecast: Day[],
    avgTemp: number,
    city?: string
    // unit: "C" | "F",
    // onToggle: () => void
}

const fetchTempInBerlin = async (city): Promise<number> => {
    console.log("fetchTempIn", city);
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.40&current=temperature_2m,wind_speed_10m')
    const data = await response.json()
    // console.log("dataInBerlin", data)
    // console.log("tempInBerlin", data.current.temperature_2m)
    return data.current.temperature_2m
}

export default function WeatherDashboard({forecast, avgTemp, city}: Props) {
    const [unit, setUnit] = useState<"C" | "F">("C");
    const toggleUnit = () => setUnit(unit === "C" ? "F" : "C");

    const [tempInBerlin, setTempInBerlin ] = useState<null|number>(null)


    useEffect(() => {
        fetchTempInBerlin(city).then((tempInBerlin) => {
            setTempInBerlin(tempInBerlin)
        })
    }, [city]);

    console.log("tempInBerlin", tempInBerlin)


    return (<>
            <AverageTemperature avgTemp={avgTemp}
                                unit={unit}
                                onToggle={toggleUnit}
            />
            <div className="flex justify-center">
                <div className="flex flex-col gap-4 w-150 mx-auto">
                  {forecast.map((day, index) => (
                    <DayCard key={index}
                             day={day}
                             unit={unit} />
                  ))}
                </div>
                <button className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={toggleUnit}>°C / °F
                </button>
            </div>
        </>
  )
}
