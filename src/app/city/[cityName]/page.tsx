import CityDailyWeatherCard from "@/components/weather/CityDailyWeatherCard";
import { CITIES } from "@/lib/types";
import { notFound } from "next/navigation";
import {fetchCityWeather} from "@/app/actions/weather";

export default async function CityWeekForecast({params}: {params: Promise<{cityName: string}>}) {
    const rawParams = await params
    const searchCity = decodeURIComponent(rawParams.cityName);
    const city = CITIES.find(c => c.name.toLowerCase() === searchCity.toLowerCase());
    if (!city) {
        return notFound();
    }
    await fetchCityWeather(city)

    return (<CityDailyWeatherCard city={city} />)
}
