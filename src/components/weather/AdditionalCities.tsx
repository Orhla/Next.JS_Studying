"use client"

import { useState, useEffect } from "react"
import { City } from "@/lib/types"
import CityWeatherCard from "@/components/weather/CityWeatherCard"
import {CurrentWeather, fetchCityWeather} from "@/lib/weather-api";

import Link from "next/link"
import CitySearch from "@/components/weather/CitySearch"

const STORAGE_KEY = "additionalCities"

export default function AdditionalCities({ available }: { available: City[] }) {
    const [selected, setSelected] = useState<City[]>([])
    const [citiesWeather, setCitiesWeather] = useState<CurrentWeather[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

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
        setError(null)
        fetchCitiesWeather()
            .catch((e) => {setError(e instanceof Error ? e.message : "Что-то пошло не так")})
            .finally(() => setLoading(false))
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
            <h2 className="font-semibold mb-2">Дополнительные города</h2>
            <CitySearch size="sm" onSelect={toggle} />
            {selected.length > 0 && (
                <div className="flex flex-col gap-3 mt-3">
                    {citiesWeather.map(weather => {
                        const city = selected.find(c => c.name === weather.cityName)
                        if (!city) return null
                        return (
                            <div key={city.id} className="relative">
                                <Link href={`/city/${city.id}`}>
                                    <CityWeatherCard weather={weather} />
                                </Link>
                                <button
                                    onClick={() => toggle(city)}
                                    className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:text-red-500 text-gray-400 text-xs transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
