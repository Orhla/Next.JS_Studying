"use client"

import DisplayMaxTemp from "./WeatherStats/MaxTempItem"
import DisplayMinTemp from "./WeatherStats/MinTempItem";
import DisplayDate from "./WeatherStats/DateItem";
import DisplayDescription from "./WeatherStats/DescriptionItem";
import DisplayHumidity from "./WeatherStats/HumidityItem";
import DisplayWind from "./WeatherStats/DisplayWind";

type Props = {
    date: string,
    tempMin: number,
    tempMax: number,
    description: string,
    humidity: number,
    wind: number,
    unit: "C" | "F"
}

export default function WeatherStats({date, tempMin, tempMax, description, humidity, wind, unit}: Props) {
    return (<div>
                <DisplayDate date={date} />
                <DisplayMinTemp tempMin={tempMin}
                                unit={unit} />
                <DisplayMaxTemp tempMax={tempMax}
                                unit={unit} />
                <DisplayDescription description={description} />
                <DisplayHumidity humidity={humidity} />
                <DisplayWind wind={wind} />
            </div>
           );
}