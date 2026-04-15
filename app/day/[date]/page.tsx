"use client"

import forecastData from '@/data/forecast.json';
import { useParams } from 'next/navigation';
import { findDay, Day } from '@/lib/weather'
import DayDetail from "@/components/weather/DayDetail/DayDetail";

function getSyncForecast(): Day[] {
  const days: Day[] = forecastData;
  return days;
}

export default function DayForecast() {
    const params = useParams();
    const searchDate = params.date;
    
    const day = findDay(getSyncForecast(), String(searchDate));
    if (day) {
        return (
            <div>
                <p>Forecast: {params.date}</p>
                <DayDetail day={day}/>
            </div>)
    }
}