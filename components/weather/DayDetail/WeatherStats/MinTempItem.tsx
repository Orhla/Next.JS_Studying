"use client"

import { celsToFahr } from "@/lib/weather"
import { temperatureUnit, unitSystem } from "@/lib/types";

type Props = {
    tempMinCelsius: number,
    system: unitSystem
}

export default function DisplayMinTemp({tempMinCelsius, system}: Props) {

    const displayTempMin = system === unitSystem.EU ? Math.round(tempMinCelsius) : celsToFahr(tempMinCelsius);
    const displayUnit = system === unitSystem.EU ? temperatureUnit.C : temperatureUnit.F;

    return (<div>
                Минимальная температура: {displayTempMin}°{displayUnit}
            </div>
           );
}