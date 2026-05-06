import CityDailyWeatherCard from "@/components/weather/CityDailyWeatherCard";
import { notFound } from "next/navigation";
import {fetchCityWeather, fetchCityIDSearch} from "@/app/actions/weather";

export default async function CityWeekForecast({params}: {params: Promise<{cityID: string}>}) {
    const rawParams = await params
    const city = await fetchCityIDSearch(rawParams.cityID);
    if (!city) {
        return notFound();
    }
    await fetchCityWeather(city)

    return (<CityDailyWeatherCard city={city} />)
}