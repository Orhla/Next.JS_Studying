"use client"

import { City } from "@/lib/types";
import { useState, useEffect } from "react";
import { fetchCitySearch } from "@/lib/geocoding-api";

type Size = "sm" | "md"

type Props = {
    onSelect: (city: City) => void
    size?: Size
}

const sizeStyles: Record<Size, { input: string; item: string }> = {
    md: {
        input: "rounded-xl border-2 border-blue-400 py-3 px-4 text-base shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200",
        item: "p-3",
    },
    sm: {
        input: "rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100",
        item: "p-2",
    },
}

export default function CitySearch({ onSelect, size = "md" }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<City[]>([])

    const styles = sizeStyles[size]

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

    function handleSelect(city: City) {
        onSelect(city)
        setQuery('')
        setResults([])
    }

    const showDropdown = query.trim().length >= 3

    return (
        <div className="relative">
            <input
                className={`block w-full placeholder:text-gray-400 focus:outline-none transition-colors ${styles.input}`}
                placeholder="Введите название города..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {showDropdown && (
                <ul className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg divide-y max-h-64 overflow-y-auto">
                    {loading && <li className="p-3 text-sm text-gray-400">Поиск...</li>}
                    {error && <li className="p-3 text-sm text-red-500">{error}</li>}
                    {!loading && !error && results && results.length === 0 && (
                        <li className="p-3 text-sm text-gray-400">Города не найдены</li>
                    )}
                    {results && results.map((city) => (
                        <li
                            key={city.id}
                            className={`hover:bg-gray-50 cursor-pointer ${styles.item}`}
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
