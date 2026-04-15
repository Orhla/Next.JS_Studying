"use client"

import { Day } from "@/lib/weather"
import WeatherStats from "./WeatherStats"

type Props = {
    day: Day
}

export default function DayDetail({day}: Props) {
    return (<WeatherStats 
                date={day.date}
                tempMin={day.tempMin}
                tempMax={day.tempMax}
                description={day.description}
                humidity={day.humidity}
                wind={day.wind}
            />);
}