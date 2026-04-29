import { CurrentWeather, DailyWeather, buildWeatherUrl, mapCurrentWeather, buildWeekWeatherUrl, mapDailyWeather } from "@/lib/weather-api"
import { City } from "@/lib/types";
import { notFound } from "next/navigation";

export async function fetchCityWeather(city: City): Promise<CurrentWeather> {
    let response = null;
    let weatherData = null;
    try {
        response = await fetch(buildWeatherUrl(city));
        weatherData = await response.json();
        return mapCurrentWeather(city.name, weatherData);
    } catch {
        return notFound();
    }
}


export async function fetchCityDailyWeather(city: City): Promise<DailyWeather[]> {
    let response = null;
    let weatherData = null;
    try {
        response = await fetch(buildWeekWeatherUrl(city));
        weatherData = await response.json();
        return mapDailyWeather(city.name, weatherData);
    } catch {
        return notFound();
    }
}