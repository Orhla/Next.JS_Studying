import { cookies } from 'next/headers'
import AdditionalCities from "@/components/weather/AdditionalCities"
import { redirect } from 'next/navigation'
import { City, CITIES } from '@/lib/types'
import CityWeatherCard from '@/components/weather/CityWeatherCard'
import Link from 'next/link'
import {fetchCityWeather} from "@/app/actions/weather";
import CitySearch from '@/components/weather/CitySearch'
import { getCityFromCookies } from '@/lib/weather'

export default async function CityCurrentWeather() {  

  const cookieStore = await cookies()
  const userCityCookie = cookieStore.get("userCity")
  if (!userCityCookie) {
    redirect('/set-city')
  }
  const userCity = getCityFromCookies(userCityCookie?.value)
  const weather = await fetchCityWeather(userCity)

  const available = CITIES.filter(c => c.name !== userCity.name)

  return (
      <div className="flex flex-col gap-4 w-180 mx-auto">
        <CitySearch />
        <p>Вы выбрали город {userCity.name}</p>
        <Link href={`/city/${userCity.id}`}><CityWeatherCard weather={weather} /></Link>
        <AdditionalCities available={available} />
      </div>
  )
}
