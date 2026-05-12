"use client"

import { City } from "@/lib/types";
import { DailyWeather, fetchCityDailyWeather } from "@/lib/weather-api";
import { weatherCodes } from "@/lib/weatherCodes";
import { useEffect, useState } from "react";
import { datetoRussianLocale } from "@/lib/weather";

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
        return <div className="w-180 mx-auto p-4 border-3 rounded-md animate-pulse">Загрузка погоды в {city.name}...</div>;
    }

    if (status.kind === "error") {
        return <div className="w-180 mx-auto p-4 border-3 border-red-500 rounded-md text-red-500">{status.message}</div>;
    }

    return (
        <div className="flex flex-col gap-4 w-180 mx-auto">
                {status.weather.map((day, index) => (
                <div key={index}>
                    <div>Название города: {day.cityName}</div>
                    <div>Дата: {datetoRussianLocale(day.date)}</div>
                    <div>Минимальная температура: {Math.round(day.minTemp)}°C</div>
                    <div>Максимальная температура: {Math.round(day.maxTemp)}°C</div>
                    <div>Погода: {weatherCodes[day.weatherCode]}</div>
                    <div>Влажность: {day.humidity}%</div>
                    <div>Скорость ветра: {Math.round(day.windSpeed)}км/ч</div>
                </div>
                ))}
        </div>
    );
}
