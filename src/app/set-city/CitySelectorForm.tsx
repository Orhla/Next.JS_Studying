"use client"

import { useState } from "react"
import { City, CITIES } from "@/lib/types"
import CitySelector from "@/components/weather/WeekForecast/CitySelector"
import { setCity } from "./actions"

export default function CitySelectorForm() {
    const [selectedCity, setSelectedCity] = useState<City>(CITIES[0])

    return (
        <form action={() => setCity(selectedCity.name)}>
            <CitySelector selectedCity={selectedCity} onCityChange={setSelectedCity} />
            <button className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    type="submit">Сохранить</button>
        </form>
    )
}