"use client"

import { celsToFahr } from "@/lib/weather"
import { temperatureUnit, unitSystem } from "@/lib/types";

type Props = {
    tempMaxCelsius: number,
    system: unitSystem
}

export default function DisplayMaxTemp({tempMaxCelsius, system}: Props) {

    const displayTempMax = system === unitSystem.EU ? Math.round(tempMaxCelsius) : celsToFahr(tempMaxCelsius);
    const displayUnit = system === unitSystem.EU ? temperatureUnit.C : temperatureUnit.F;

    return (<div>
                Максимальная температура: {displayTempMax}°{displayUnit}
            </div>
           );
}