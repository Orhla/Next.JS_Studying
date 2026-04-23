"use client"

import { celsToFahr } from "@/lib/weather"
import { temperatureUnit } from "@/lib/types";

type Props = {
    tempMin: number,
    tempMax: number,
    unit: temperatureUnit
}

export default function DisplayTempRange({tempMin, tempMax, unit}: Props) {

    const displayTempMin = unit === temperatureUnit.C ? tempMin : celsToFahr(tempMin);
    const displayTempMax = unit === temperatureUnit.C ? tempMax : celsToFahr(tempMax);

    return (<div>
                Диапазон температур: {displayTempMin}°{unit} - {displayTempMax}°{unit}
            </div>
           );
}
