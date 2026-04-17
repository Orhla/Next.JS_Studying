"use server"
import { readFile } from 'node:fs/promises';
import path from 'node:path';


import {Day} from "@/app/actions/types";

export async function getAllDaysWeather(): Promise<Day[]> {
    const filePath = path.join(process.cwd(), 'data', 'forecast.json');
    const raw = await readFile(filePath, 'utf-8');
    console.log("I am reading forecast");
    return JSON.parse(raw) as Day[];
}

export async function getWeatherForDay(searchDate: string): Promise<Day | null> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(searchDate)) {
        throw new Error(`Invalid date format: "${searchDate}". Expected YYYY-MM-DD.`);
    }
    const forecast = await getAllDaysWeather();
    for (const day of forecast) {
        if (day.date === searchDate)
            return day;
    }
    return null;
}
