"use client"

import { celsToFahr } from "@/lib/weather"
import { temperatureUnit, unitSystem } from "@/lib/types";

type Props = {
    tempMin: number,
    tempMax: number,
    unit: unitSystem
}

export default function DisplayTempRange({tempMin, tempMax, unit}: Props) {

    const tempUnit = unit === unitSystem.EU ? temperatureUnit.C : temperatureUnit.F
    const displayTempMin = unit === unitSystem.EU ? Math.round(tempMin) : celsToFahr(tempMin);
    const displayTempMax = unit === unitSystem.EU ? Math.round(tempMax) : celsToFahr(tempMax);

    return (<div>
                Диапазон температур: {displayTempMin}°{tempUnit} - {displayTempMax}°{tempUnit}
            </div>
           );
}
