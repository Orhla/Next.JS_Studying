"use client"

import { City } from "@/lib/types";
import { DailyWeather, fetchCityDailyWeather } from "@/lib/weather-api";
import { weatherCodes } from "@/lib/weatherCodes";
import { useEffect, useState } from "react";
import { datetoRussianLocale } from "@/lib/weather";

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

type Status =
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "ready"; weather: DailyWeather[] }

type Props = {
    city: City
}

export default function CityDailyWeatherCard({city}: Props) {
    const [status, setStatus] = useState<Status>({ kind: "loading" });

    useEffect(() => {
        fetchCityDailyWeather(city).then(data => {setStatus({kind: "ready", weather: data})})
                                .catch(err => {setStatus({kind: "error", message: err.message})})
    }, [city]);

    if (status.kind === "loading") {
        return <div className="p-4 border rounded-xl animate-pulse text-gray-500">Загрузка погоды в {city.name}...</div>;
    }

    if (status.kind === "error") {
        return <div className="p-4 border border-red-500 rounded-xl text-red-500">{status.message}</div>;
    }

    return (
        <div className="flex flex-col gap-3">
            {status.weather.map((day, index) => (
                <div key={index} className="border rounded-xl p-4 shadow-sm bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-base">{datetoRussianLocale(day.date)}</span>
                        <span className="text-2xl">{getWeatherEmoji(day.weatherCode)}</span>
                    </div>
                    <div className="text-gray-500 text-sm mb-3">{weatherCodes[day.weatherCode]}</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="text-gray-500">Мин / Макс</div>
                        <div className="font-medium">{Math.round(day.minTemp)}°C / {Math.round(day.maxTemp)}°C</div>
                        <div className="text-gray-500">Влажность</div>
                        <div className="font-medium">{day.humidity}%</div>
                        <div className="text-gray-500">Ветер</div>
                        <div className="font-medium">{Math.round(day.windSpeed)} км/ч</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
