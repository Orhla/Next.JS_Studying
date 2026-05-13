"use server"

import { City } from "@/lib/types"
import { cookies } from "next/headers"

export async function setCity(city: City) {
    const cookieStore = await cookies()
    cookieStore.set("userCity", JSON.stringify(city))
}