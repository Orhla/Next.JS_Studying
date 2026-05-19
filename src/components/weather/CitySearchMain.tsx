"use client"

import { City } from "@/lib/types"
import { setCity } from "@/app/actions/actions"
import { useRouter } from "next/navigation"
import CitySearch from "./CitySearch"

export default function CitySearchMain() {
    const router = useRouter()

    async function handleSelect(city: City) {
        await setCity(city)
        router.push("/")
    }

    return <CitySearch onSelect={handleSelect} size="md" />
}
