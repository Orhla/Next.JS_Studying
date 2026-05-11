import CityDailyWeatherCard from "@/components/weather/CityDailyWeatherCard";
import { notFound } from "next/navigation";
import {getCityWeatherAction} from "@/app/actions/weather";
import { fetchCityIDSearch } from "@/lib/geocoding-api";

export default async function CityWeekForecast({params}: {params: Promise<{cityID: string}>}) {
    const rawParams = await params
    let city
    try {
        city = await fetchCityIDSearch(rawParams.cityID);
    } catch (error) {
        return notFound();
    }
    // if (!city) {
    //     return notFound();
    // }
    await getCityWeatherAction(city)

    return (<CityDailyWeatherCard city={city} />)
}
