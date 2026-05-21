"use client"

import AdditionalCities from "@/components/weather/AdditionalCities"
import { useRouter } from 'next/navigation'
import CityWeatherCard from '@/components/weather/CityWeatherCard'
import Link from 'next/link'
import CitySearchMain from '@/components/weather/CitySearchMain'
import { CurrentWeather, fetchCityWeather } from '@/lib/weather-api'
import { City } from "@/lib/types"
import { useEffect, useState } from "react"

const STORAGE_KEY = "mainCity"

export default function CityCurrentWeather() {
  const router = useRouter()
  const [userCity, setUserCity] = useState<City>()
  const [weather, setWeather] = useState<CurrentWeather>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedMainCity = localStorage.getItem(STORAGE_KEY)
    
    if (!storedMainCity) {
      router.push('/set-city');
      return;
    }
    try {
      const parsedCity = JSON.parse(storedMainCity)
      setUserCity(parsedCity);
    } catch (error) {
      router.push('/set-city')
    }
  }, [router])

  useEffect(() => {
    if (!userCity) return

    async function loadWeather(userCity: City) {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCityWeather(userCity)
        setWeather(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить погоду")
      } finally {
        setLoading(false)
      }
    }

    loadWeather(userCity)
  }, [userCity])

  if (!userCity) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-gray-400 text-sm animate-pulse">Определение города...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl mx-auto px-4">
      <CitySearchMain onCityChange={setUserCity} />
      
      <p className="text-sm text-gray-600">
        Вы выбрали город: <span className="font-semibold text-gray-900">{userCity.name}</span>
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading && !weather ? (
        <div className="p-6 border rounded-xl bg-gray-50 text-center text-sm text-gray-400 animate-pulse">
          Загрузка погоды...
        </div>
      ) : (
        weather && (
          <Link href={`/city?id=${userCity.id}`} className="block hover:opacity-95 transition-opacity">
            <CityWeatherCard weather={weather} />
          </Link>
        )
      )}

      <AdditionalCities />
    </div>
  )
}
