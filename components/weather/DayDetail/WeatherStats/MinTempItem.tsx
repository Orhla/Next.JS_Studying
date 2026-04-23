"use client"

import { celsToFahr } from "@/lib/weather"
import { temperatureUnit } from "@/lib/types";

type Props = {
    tempMinCelsius: number,
    displayUnit: temperatureUnit
}

export default function DisplayMinTemp({tempMinCelsius, displayUnit}: Props) {

    const displayTempMin = displayUnit === temperatureUnit.C ? tempMinCelsius : celsToFahr(tempMinCelsius);

    return (<div>
                Минимальная температура: {displayTempMin}°{displayUnit}
            </div>
           );
}