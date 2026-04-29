"use client"

import DisplayMaxTemp from "./WeatherStats/MaxTempItem"
import DisplayMinTemp from "./WeatherStats/MinTempItem";
import DisplayDate from "./WeatherStats/DateItem";
import DisplayDescription from "./WeatherStats/DescriptionItem";
import DisplayHumidity from "./WeatherStats/HumidityItem";
import DisplayWind from "./WeatherStats/DisplayWind";
import { unitSystem } from "@/lib/types";
import { weatherCodes } from "@/lib/weatherCodes";

type Props = {
    date: string,
    tempMinCelsius: number,
    tempMaxCelsius: number,
    description: string,
    humidity: number,
    wind: number,
    system: unitSystem
}

export default function WeatherStats({date, tempMinCelsius, tempMaxCelsius, description, humidity, wind, system}: Props) {
    return (<div>
                <DisplayDate date={date} />
                <DisplayMinTemp tempMinCelsius={tempMinCelsius}
                                system={system} />
                <DisplayMaxTemp tempMaxCelsius={tempMaxCelsius}
                                system={system} />
                <DisplayDescription description={description} />
                <DisplayHumidity humidity={humidity} />
                <DisplayWind wind={wind}
                             system={system} />
            </div>
           );
}