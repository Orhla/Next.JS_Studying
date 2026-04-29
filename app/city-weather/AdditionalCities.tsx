"use client"

import { useState, useEffect } from "react"
import { City, CITIES } from "@/lib/types"
import CityWeatherCard from "@/components/weather/CityWeatherCard"
import Link from "next/link"

const STORAGE_KEY = "additionalCities"

export default function AdditionalCities({ mainCityName }: { mainCityName: string }) {
    const [selected, setSelected] = useState<City[]>([])

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) setSelected(JSON.parse(stored))
    }, [])


    function toggle(city: City) {
        setSelected(prev => {
            const next = prev.some(c => c.name === city.name)
                ? prev.filter(c => c.name !== city.name)
                : [...prev, city]
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            return next
        })
    }

    const available = CITIES.filter(c => c.name !== mainCityName)

    return (
        <div>
            <h2>Дополнительные города</h2>
            <select onChange={e => {
                const city = available.find(c => c.name === e.target.value)
                if (city) toggle(city)
                e.target.value = ""
            }} defaultValue="">
                <option value="" disabled>Добавить город...</option>
                {available.map(city => (
                    <option key={city.name} value={city.name}>
                        {selected.some(c => c.name === city.name) ? `✓ ${city.name}` : city.name}
                    </option>
                ))}
            </select>
            {selected.length > 0 && (
                <ul>
                    {selected.map(city => (
                        <div key={city.name}>
                            <li key={city.name}>
                                {city.name}
                                <button onClick={() => toggle(city)}>✕</button>
                            </li>
                            <Link href={`/city/${city.name}`}><CityWeatherCard city={city} /></Link>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    )
}