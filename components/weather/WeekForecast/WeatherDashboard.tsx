"use client"

import DayCard from "./DayCard/DayCard"
import {Day} from "@/app/actions/types";
import { useEffect, useState } from "react"
import AverageTemperature from "./AverageTemperature"
import CitySelector from "./CitySelector";
import { unitSystem } from "@/lib/types";
import { fetchForecast } from "@/app/actions/weather";
import { City, CITIES } from "@/lib/types";

type Props = {
    avgTemp: number
}

export default function WeatherDashboard({avgTemp}: Props) {

  const [forecast, setForecast] = useState<Day[]>([])

  // const [unitSystem, setUnitSystem] = useState<temperatureUnit>(temperatureUnit.C);
  // const toggleUnit = () => setUnitSystem(unitSystem === temperatureUnit.C ? temperatureUnit.F : temperatureUnit.C);

  const [system, setSystem] = useState<unitSystem>(unitSystem.EU);
  const toggleUnit = () => setSystem(system === unitSystem.EU ? unitSystem.US : unitSystem.EU);

  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0])


  useEffect(() => {
        fetchForecast(selectedCity).then(setForecast)
    }, [selectedCity]);


  return (
          <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-180 mx-auto">
              <CitySelector selectedCity={selectedCity}
                            onCityChange={setSelectedCity}/>
              <AverageTemperature avgTemp={avgTemp}
                                unit={system}
                                onToggle={toggleUnit} />
              {forecast.map((day, index) => (
                <DayCard key={index}
                         day={day}
                         system={system} />
              ))}
            </div>
            <button className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={toggleUnit}>{system === unitSystem.EU ? "EU" : "US"}</button>
          </div>
  )
}
