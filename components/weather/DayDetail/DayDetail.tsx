"use client"

import WeatherStats from "./WeatherStats"
import {Day} from "@/app/actions/types";

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
