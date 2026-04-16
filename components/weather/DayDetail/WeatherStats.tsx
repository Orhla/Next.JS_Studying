"use client"

import DisplayMaxTemp from "./WeatherStats/MaxTempItem"
import DisplayMinTemp from "./WeatherStats/MinTempItem";
import DisplayDate from "./WeatherStats/DateItem";
import DisplayDescription from "./WeatherStats/DescriptionItem";
import DisplayHumidity from "./WeatherStats/HumidityItem";
import DisplayWind from "./WeatherStats/DisplayWind";

type Props = {
    date: string;
    tempMin: number;
    tempMax: number;
    description: string;
    humidity: number;
    wind: number;
}

export default function WeatherStats({date, tempMin, tempMax, description, humidity, wind}: Props) {
    return (<div>
                <DisplayDate date={date} />
                <DisplayMinTemp tempMin={tempMin} />
                <DisplayMaxTemp tempMax={tempMax} />
                <DisplayDescription description={description} />
                <DisplayHumidity humidity={humidity} />
                <DisplayWind wind={wind} />
            </div>
           );
}