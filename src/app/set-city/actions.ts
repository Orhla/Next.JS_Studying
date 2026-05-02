"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function setCity(cityName: string) {
    const cookieStore = await cookies()
    cookieStore.set("userCity", cityName)
    redirect("/city-weather")
}