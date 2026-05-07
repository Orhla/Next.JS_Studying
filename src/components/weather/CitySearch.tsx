"use client"

import { fetchCitySearch } from "@/app/actions/weather";
import { City } from "@/lib/types";
import { useState } from "react";
import { setCity } from "@/app/actions/actions";
import { useRouter } from "next/navigation"

export default function CitySearch() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<City[]>([])

    async function handleSearch() {
        if (!query.trim()) return
        setLoading(true)
        setError(null)
        try {
            const data = await fetchCitySearch(query);
            console.log(data);
            setResults(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Что-то пошло не так")
        } finally {
            setLoading(false);
        }
    }

    const router = useRouter()

    async function handleSelect(city: City) {
        await setCity(city);
        router.push("/");
    }

    // if (loading) {
    //     return <div>Загрузка...</div>
    // }

    if (error) {
        return <div>Произошла ошибка: {error}</div>
    }
    console.log("loading", loading);
    return (
    <div className="relative flex-column flex-1 shrink-0 gap-4">
        <p>{loading ?? "Loading..."}</p>
        <div className="flex flex-1 shrink-0 gap-4">
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder="Введите название города..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSearch() }}
            />
            <button className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={handleSearch}>Поиск</button>
        </div>
      <ul className="border rounded divide-y bg-white shadow-md">
        {results.length > 0 ? (
          results.map((city) => (
            <li
              key={city.id}
              className="p-3 hover:bg-gray-50 cursor-pointer text-black"
              onClick={() => handleSelect(city)}
            >
              <span className="font-medium">{city.name}</span>
              <p className="text-xs text-gray-500">{city.country}</p>
            </li>
          ))
        ) : (
          !loading && <li className="p-3 text-gray-400">Города не найдены</li>
        )}
      </ul>
    </div>
  );
}
