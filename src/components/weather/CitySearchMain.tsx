"use client"

import { City } from "@/lib/types"
import { useRouter } from "next/navigation"
import CitySearch from "./CitySearch"

const STORAGE_KEY = "mainCity"

type Props = {
    onCityChange?: (city: City) => void
}

export default function CitySearchMain({ onCityChange }: Props) {
    const router = useRouter()

    function handleSelect(city: City) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(city))
        window.ym?.(109326374, 'reachGoal', 'city_selected')
        if (onCityChange) {
            onCityChange(city)
        } else {
            router.push("/")
        }
    }

    return <CitySearch onSelect={handleSelect} size="md" />
}
