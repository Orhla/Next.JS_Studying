import { cookies } from 'next/headers'
import AdditionalCities from "./AdditionalCities"
import { notFound, redirect } from 'next/navigation'
import { CITIES } from '@/lib/types'
import CityWeatherCard from '@/components/weather/CityWeatherCard'
import Link from 'next/link'

export default async function CityCurrentWeather() {
    const cookieStore = await cookies()
    const userCity = cookieStore.get("userCity")
    if (!userCity) {
        redirect('/set-city')
    }
    const userCityName = decodeURIComponent(userCity?.value ?? "Unknown");
    const city = CITIES.find(c => c.name.toLowerCase() === userCityName.toLowerCase());
    if (!city) {
        return notFound();
    }

    return (
        <div className="flex flex-col gap-4 w-180 mx-auto">
                <p>Вы выбрали город {userCityName}</p>
                <Link href={`/city/${userCityName}`}><CityWeatherCard city={city} /></Link>
                <AdditionalCities mainCityName={userCityName} />
        </div>
        )
}