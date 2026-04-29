"use client"

import { fetchCityWeather } from "@/app/api/weather";
import { City } from "@/lib/types";
import { CurrentWeather } from "@/lib/weather-api";
import { weatherCodes } from "@/lib/weatherCodes";
import { useEffect, useState } from "react";

type Status =
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "ready"; weather: CurrentWeather }

type Props = {
    city: City
}

export default function CityWeatherCard({city}: Props) {
    const [status, setStatus] = useState<Status>({ kind: "loading" });

    useEffect(() => {
        fetchCityWeather(city).then(data => {setStatus({kind: "ready", weather: data})})
                            .catch(err => {setStatus({kind: "error", message: err.message})})
    }, [city]);

    if (status.kind === "loading") {
        return <div className="w-180 mx-auto p-4 border-3 rounded-md animate-pulse">Загрузка погоды в {city.name}...</div>;
    }

    if (status.kind === "error") {
        return <div className="w-180 mx-auto p-4 border-3 border-red-500 rounded-md text-red-500">{status.message}</div>;
    }

    return (
        <div className="flex flex-col gap-4 w-180 mx-auto border-3 rounded-md p-4">
            <div>Название города: {status.weather.cityName}</div>
            <div>Температура: {Math.round(status.weather.temperature)}°C</div>
            <div>Погода: {weatherCodes[status.weather.weatherCode]}</div>
            <div>Влажность: {status.weather.humidity}%</div>
            <div>Скорость ветра: {Math.round(status.weather.windSpeed)}км/ч</div>
        </div>
    )
}