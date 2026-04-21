"use client"

import { celsToFahr } from "@/lib/weather"

type Props = {
    tempMax: number,
    unit: "C" | "F"
}

export default function DisplayMaxTemp({tempMax, unit}: Props) {

    const displayTempMax = unit === "C" ? tempMax : celsToFahr(tempMax);

    return (<div>
                Максимальная температура: {displayTempMax}°{unit}
            </div>
           );
}