"use server"
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { City } from '@/lib/types';


import {Day} from "@/app/actions/types";

export async function fetchForecast(city: City): Promise<Day[]> {
    console.log("fetchTempIn", city);
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + city.latitude + '&longitude=' + city.longitude + '&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,weather_code,relative_humidity_2m_max')
    const data = await response.json()
    // console.log("dataInBerlin", data)
    // console.log("tempInBerlin", data.current.temperature_2m)
    const days: Day[] = data.daily.time.map((date: string, index: number) => ( {
        date: date,
        tempMin: data.daily.temperature_2m_min[index],
        tempMax: data.daily.temperature_2m_max[index],
        description: data.daily.weather_code[index],
        humidity: data.daily.relative_humidity_2m_max[index],
        wind: data.daily.wind_speed_10m_max[index],
    }));
    return days;
}

export async function getAllDaysWeather(): Promise<Day[]> {
    const filePath = path.join(process.cwd(), 'data', 'forecast.json');
    const raw = await readFile(filePath, 'utf-8');
    console.log("I am reading forecast");
    return JSON.parse(raw) as Day[];
}

export async function getWeatherForDay(searchDate: string, city: City): Promise<Day | null | undefined> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(searchDate)) {
        throw new Error(`Invalid date format: "${searchDate}". Expected YYYY-MM-DD.`);
    }
    // const forecast = await getAllDaysWeather();
    const forecast = await fetchForecast(city);
    for (const day of forecast) {
        if (day.date === searchDate)
            return day;
    }
    return null;
}
