"use client"

import CityDailyWeatherCard from "@/components/weather/CityDailyWeatherCard";
import { fetchCityIDSearch } from "@/lib/geocoding-api";
import { useEffect, useState, Suspense } from "react";
import { City } from "@/lib/types";
import { useSearchParams } from "next/navigation";

const MOSCOW_ID = "524901";

export default function CityWeekForecast() {
    const searchParams = useSearchParams()
    const cityID = searchParams.get("id") || MOSCOW_ID
    
    const [city, setCity] = useState<City | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadCityData() {
            setLoading(true)
            setError(null)
            try {
                const data = await fetchCityIDSearch(cityID)
                if (!data) {
                    setError("Город не найден")
                    return
                }
                setCity(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Не удалось загрузить данные")
            } finally {
                setLoading(false)
            }
        }

        loadCityData()
    }, [cityID])

    if (loading) {
        return (
            <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-64">
                <p className="text-gray-400 text-sm animate-pulse">Загрузка актуального прогноза...</p>
            </main>
        )
    }

    if (error || !city) {
        return (
            <main className="max-w-3xl mx-auto px-6 py-8 text-center">
                <p className="text-red-500 font-medium">{error || "Город не найден"}</p>
            </main>
        )
    }

    return (
        <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 tracking-tight">
                {city.name}, <span className="text-gray-500 font-normal">{city.country}</span>
            </h1>
            <div className="w-full">
                <CityDailyWeatherCard city={city} />
            </div>
        </main>
    )
}

// export default async function CityWeekForecast({params}: {params: Promise<{cityID: string}>}) {
//     const rawParams = await params
//     let city
//     try {
//         city = await fetchCityIDSearch(rawParams.cityID);
//     } catch (error) {
//         notFound();
//     }

//     return (
//         <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col items-center">
//             <h1 className="text-3xl font-bold mb-6 text-center">{city.name}, {city.country}</h1>
//             <div className="w-full">
//                 <CityDailyWeatherCard city={city} />
//             </div>
//         </main>
//     )
// }
