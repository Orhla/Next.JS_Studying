"use client"

import { useState, useEffect } from "react"
import { City, CITIES } from "@/lib/types"
import CityWeatherCard from "@/components/weather/CityWeatherCard"
import { CurrentWeather } from "@/lib/weather-api";

import Link from "next/link"
import {fetchCityWeather} from "@/app/actions/weather";

const STORAGE_KEY = "additionalCities"

export default function AdditionalCities({ available }: { available: City[] }) {
    const [selected, setSelected] = useState<City[]>([])
    const [citiesWeather, setCitiesWeather] = useState<CurrentWeather[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            setSelected(JSON.parse(stored))
        }
    }, [])

    useEffect(() => {
        const fetchCitiesWeather = async ()=>{
            const citiesWeather: CurrentWeather[] = await Promise.all(selected.map((city) =>  fetchCityWeather(city)))
            setCitiesWeather(citiesWeather)
        }
        setLoading(true)
        fetchCitiesWeather()
            .catch(() => {window.alert("Something went wrong")})
            .finally(()=>setLoading(false))
    }, [selected]);

    function toggle(city: City) {
        setSelected(prev => {
            const next = prev.some(c => c.name === city.name)
                ? prev.filter(c => c.name !== city.name)
                : [...prev, city]
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            return next
        })
    }

    if (loading) {
        return <div>Загрузка...</div>
    }

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
                    {citiesWeather.map(weather => (
                        <div key={weather.cityName}>
                            <li key={weather.cityName}>
                                {weather.cityName}
                                <button onClick={() => toggle(CITIES.find(c=>c.name === weather.cityName))}>✕</button>
                            </li>
                            <Link href={`/city/${weather.cityName}`}><CityWeatherCard weather={weather} /></Link>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    )
}
