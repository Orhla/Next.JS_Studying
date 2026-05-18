"use client"

import { City } from "@/lib/types";
import { useState, useEffect } from "react";
import { setCity } from "@/app/actions/actions";
import { useRouter } from "next/navigation"
import { fetchCitySearch } from "@/lib/geocoding-api";

export default function CitySearch() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<City[]>([])

    const router = useRouter()

    useEffect(() => {
        if (query.trim().length < 3) {
            setResults([])
            setError(null)
            return
        }
        const timer = setTimeout(async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await fetchCitySearch(query)
                setResults(data)
            } catch (e) {
                setError(e instanceof Error ? e.message : "Что-то пошло не так")
            } finally {
                setLoading(false)
            }
        }, 350)
        return () => clearTimeout(timer)
    }, [query])

    async function handleSelect(city: City) {
        await setCity(city)
        setQuery('')
        setResults([])
        router.push("/")
    }

    const showDropdown = query.trim().length >= 3

    return (
        <div className="relative">
            <input
                className="block w-full rounded-xl border-2 border-blue-400 py-3 px-4 text-base shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Введите название города..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {showDropdown && (
                <ul className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg divide-y max-h-64 overflow-y-auto">
                    {loading && <li className="p-3 text-sm text-gray-400">Поиск...</li>}
                    {error && <li className="p-3 text-sm text-red-500">{error}</li>}
                    {!loading && !error && results.length === 0 && (
                        <li className="p-3 text-sm text-gray-400">Города не найдены</li>
                    )}
                    {results.map((city) => (
                        <li
                            key={city.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleSelect(city)}
                        >
                            <span className="font-medium text-sm">{city.name}</span>
                            <p className="text-xs text-gray-500">{city.country}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
