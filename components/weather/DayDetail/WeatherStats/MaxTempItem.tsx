"use client"

import { celsToFahr } from "@/lib/weather"
import { temperatureUnit } from "@/lib/types";

type Props = {
    tempMaxCelsius: number,
    displayUnit: temperatureUnit
}

export default function DisplayMaxTemp({tempMaxCelsius, displayUnit}: Props) {

    const displayTempMax = displayUnit === temperatureUnit.C ? tempMaxCelsius : celsToFahr(tempMaxCelsius);

    return (<div>
                Максимальная температура: {displayTempMax}°{displayUnit}
            </div>
           );
}