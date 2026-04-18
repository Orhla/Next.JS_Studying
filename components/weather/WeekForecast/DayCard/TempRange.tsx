"use client"

import { celsToFahr } from "@/lib/weather"

type Props = {
    tempMin: number,
    tempMax: number,
    unit: "C" | "F"
}

export default function DisplayTempRange({tempMin, tempMax, unit}: Props) {

    const displayTempMin = unit === "C" ? tempMin : celsToFahr(tempMin);
    const displayTempMax = unit === "C" ? tempMax : celsToFahr(tempMax);

    return (<div>
                Диапазон температур: {displayTempMin}°{unit} - {displayTempMax}°{unit}
            </div>
           );
}