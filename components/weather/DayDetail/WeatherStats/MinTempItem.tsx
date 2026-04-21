"use client"

import { celsToFahr } from "@/lib/weather"

type Props = {
    tempMin: number,
    unit: "C" | "F"
}

export default function DisplayMinTemp({tempMin, unit}: Props) {

    const displayTempMin = unit === "C" ? tempMin : celsToFahr(tempMin);

    return (<div>
                Минимальная температура: {displayTempMin}°{unit}
            </div>
           );
}