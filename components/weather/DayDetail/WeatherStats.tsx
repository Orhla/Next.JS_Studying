"use client"

import MaxTemp from "./WeatherStats/MaxTempItem"

type Props = {
    date: string;
    tempMin: number;
    tempMax: number;
    description: string;
    humidity: number;
    wind: number;
}

export default function WeatherStats({date, tempMin, tempMax, description, humidity, wind}: Props) {
    return (
            <MaxTemp tempMax={tempMax} />
           );
}