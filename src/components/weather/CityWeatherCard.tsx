"use client"

import { CurrentWeather } from "@/lib/weather-api";
import { weatherCodes } from "@/lib/weatherCodes";

type Props = {
    weather: CurrentWeather
}

function getWeatherEmoji(code: number): string {
    if (code === 0) return "☀️";
    if (code <= 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code <= 48) return "🌫️";
    if (code <= 57) return "🌦️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌧️";
    if (code <= 86) return "🌨️";
    return "⛈️";
}

export default function CityWeatherCard({weather}: Props) {
    return (
        <div className="border rounded-xl p-4 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-base">{weather.cityName}</span>
                <span className="text-2xl">{getWeatherEmoji(weather.weatherCode)}</span>
            </div>
            <div className="text-gray-500 text-sm mb-3">{weatherCodes[weather.weatherCode]}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="text-gray-500">Температура</div>
                <div className="font-medium">{Math.round(weather.temperature)}°C</div>
                <div className="text-gray-500">Влажность</div>
                <div className="font-medium">{weather.humidity}%</div>
                <div className="text-gray-500">Ветер</div>
                <div className="font-medium">{Math.round(weather.windSpeed)} км/ч</div>
            </div>
        </div>
    )
}
