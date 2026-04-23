"use client"

import DisplayMaxTemp from "./WeatherStats/MaxTempItem"
import DisplayMinTemp from "./WeatherStats/MinTempItem";
import DisplayDate from "./WeatherStats/DateItem";
import DisplayDescription from "./WeatherStats/DescriptionItem";
import DisplayHumidity from "./WeatherStats/HumidityItem";
import DisplayWind from "./WeatherStats/DisplayWind";
import { temperatureUnit } from "@/lib/types";

type Props = {
    date: string,
    tempMinCelsius: number,
    tempMaxCelsius: number,
    description: string,
    humidity: number,
    wind: number,
    unit: temperatureUnit
}

export default function WeatherStats({date, tempMinCelsius, tempMaxCelsius, description, humidity, wind, unit}: Props) {
    return (<div>
                <DisplayDate date={date} />
                <DisplayMinTemp tempMinCelsius={tempMinCelsius}
                                displayUnit={unit} />
                <DisplayMaxTemp tempMaxCelsius={tempMaxCelsius}
                                displayUnit={unit} />
                <DisplayDescription description={description} />
                <DisplayHumidity humidity={humidity} />
                <DisplayWind wind={wind} />
            </div>
           );
}