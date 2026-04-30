import { cookies } from 'next/headers'
import AdditionalCities from "@/components/weather/AdditionalCities"
import { notFound, redirect } from 'next/navigation'
import { CITIES } from '@/lib/types'
import CityWeatherCard from '@/components/weather/CityWeatherCard'
import Link from 'next/link'
import {fetchCityWeather} from "@/app/actions/weather";

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
  const available = CITIES.filter(c => c.name !== userCityName)

    const weather = await fetchCityWeather(city)

  return (
      <div className="flex flex-col gap-4 w-180 mx-auto">
        <p>Вы выбрали город {userCityName}</p>
        <Link href={`/city/${userCityName}`}><CityWeatherCard weather={weather} /></Link>
        <AdditionalCities available={available} />
      </div>
  )
}
