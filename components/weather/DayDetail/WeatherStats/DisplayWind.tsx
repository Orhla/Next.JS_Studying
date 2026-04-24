"use client"

import { unitSystem } from "@/lib/types";
import { kmPerHourToMPerSecond, kmPerHourToMilesPerHour } from "@/lib/weather";

type Props = {
    wind: number,
    system: unitSystem
}

export default function DisplayWind({wind, system}: Props) {
    // props drilling.
    const displayWind = system === unitSystem.EU ? kmPerHourToMPerSecond(wind) : kmPerHourToMilesPerHour(wind);
    const displayUnit = system === unitSystem.EU ? "м/с" : "миль/ч";

    return (
        <div>
            Ветер: {displayWind}{displayUnit}
        </div>
    );
}
