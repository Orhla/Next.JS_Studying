"use client"

import { CurrentWeather } from "@/lib/weather-api";
import { weatherCodes } from "@/lib/weatherCodes";

type Props = {
    weather: CurrentWeather
}

export default function CityWeatherCard({weather}: Props) {
    return (
        <div className="flex flex-col gap-4 w-180 mx-auto border-3 rounded-md p-4">
            <div>Название города: {weather.cityName}</div>
            <div>Температура: {Math.round(weather.temperature)}°C</div>
            <div>Погода: {weatherCodes[weather.weatherCode]}</div>
            <div>Влажность: {weather.humidity}%</div>
            <div>Скорость ветра: {Math.round(weather.windSpeed)}км/ч</div>
        </div>
    )
}
